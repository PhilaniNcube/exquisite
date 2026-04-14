import crypto from "crypto";

export interface PayGateConfig {
  payGateId: string;
  encryptionKey: string;
  initiateUrl: string;
  redirectUrl: string;
  queryUrl: string;
}

export interface PayGateInitiateData {
  PAYGATE_ID: string;
  REFERENCE: string;
  AMOUNT: string;
  CURRENCY: string;
  RETURN_URL: string;
  TRANSACTION_DATE: string;
  LOCALE: string;
  COUNTRY: string;
  EMAIL: string;
  NOTIFY_URL: string;
  CHECKSUM: string;
}

export interface PayGateInitiateResponse {
  PAYGATE_ID: string;
  PAY_REQUEST_ID: string;
  REFERENCE: string;
  CHECKSUM: string;
}

export class PayGateService {
  private config: PayGateConfig;

  constructor(config: PayGateConfig) {
    this.config = config;
  }

  get redirectUrl(): string {
    return this.config.redirectUrl;
  }

  /**
   * Generate MD5 checksum by concatenating all field values (no delimiter) + encryption key.
   * Per PayGate docs: md5(field1value + field2value + ... + encryptionKey)
   */
  generateChecksum(data: Record<string, string | undefined>): string {
    const values = Object.values(data)
      .filter((v): v is string => v !== undefined && v !== null && v !== "")
      .join("");
    const checksumSource = values + this.config.encryptionKey;
    return crypto.createHash("md5").update(checksumSource).digest("hex");
  }

  /**
   * Generate redirect checksum: MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
   */
  generateRedirectChecksum(payRequestId: string, reference: string): string {
    const checksumSource =
      this.config.payGateId + payRequestId + reference + this.config.encryptionKey;
    return crypto.createHash("md5").update(checksumSource).digest("hex");
  }

  /**
   * Verify a checksum received from PayGate (notify or query response).
   * The checksum is MD5 of all field values (excluding CHECKSUM itself) + key.
   */
  verifyChecksum(data: Record<string, string>): boolean {
    const receivedChecksum = data.CHECKSUM;
    if (!receivedChecksum) return false;

    const dataWithoutChecksum = { ...data };
    delete dataWithoutChecksum.CHECKSUM;

    const calculatedChecksum = this.generateChecksum(dataWithoutChecksum);
    return calculatedChecksum === receivedChecksum;
  }

  /**
   * Initiate a PayWeb3 transaction.
   * POST to PayGate initiate endpoint, returns PAY_REQUEST_ID for redirect.
   */
  async initiateTransaction(params: {
    reference: string;
    amountInCents: number;
    currency?: string;
    returnUrl: string;
    notifyUrl: string;
    email: string;
    locale?: string;
    country?: string;
  }): Promise<PayGateInitiateResponse> {
    const now = new Date();
    const transactionDate = now.toISOString().replace("T", " ").substring(0, 19);

    const data: Record<string, string> = {
      PAYGATE_ID: this.config.payGateId,
      REFERENCE: params.reference,
      AMOUNT: params.amountInCents.toString(),
      CURRENCY: params.currency || "ZAR",
      RETURN_URL: params.returnUrl,
      TRANSACTION_DATE: transactionDate,
      LOCALE: params.locale || "en-za",
      COUNTRY: params.country || "ZAF",
      EMAIL: params.email,
      NOTIFY_URL: params.notifyUrl,
    };

    const checksum = this.generateChecksum(data);
    data.CHECKSUM = checksum;

    const body = new URLSearchParams(data).toString();
    console.log("[PayGate] Initiating transaction:", {
      url: this.config.initiateUrl,
      payGateId: this.config.payGateId,
      reference: params.reference,
      amount: params.amountInCents,
      bodyLength: body.length,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
    const refererDomain = new URL(siteUrl).hostname;

    const response = await fetch(this.config.initiateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": refererDomain,
      },
      body,
      cache: "no-store",
    });

    console.log("[PayGate] Initiate response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[PayGate] Initiate error body:", errorBody.substring(0, 500));
      throw new Error(`PayGate initiate HTTP error: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log("[PayGate] Initiate response body:", responseText.substring(0, 300));
    const responseParams = new URLSearchParams(responseText);

    const result: Record<string, string> = {};
    responseParams.forEach((value, key) => {
      result[key] = value;
    });

    if (result.ERROR) {
      throw new Error(`PayGate initiate error: ${result.ERROR}`);
    }

    if (!result.PAY_REQUEST_ID) {
      throw new Error(`PayGate initiate failed: no PAY_REQUEST_ID returned. Response: ${responseText}`);
    }

    // Verify response checksum
    const responseChecksum = result.CHECKSUM;
    const responseDataWithoutChecksum = { ...result };
    delete responseDataWithoutChecksum.CHECKSUM;
    const calculatedResponseChecksum = this.generateChecksum(responseDataWithoutChecksum);

    if (calculatedResponseChecksum !== responseChecksum) {
      throw new Error("PayGate initiate response checksum mismatch");
    }

    return {
      PAYGATE_ID: result.PAYGATE_ID,
      PAY_REQUEST_ID: result.PAY_REQUEST_ID,
      REFERENCE: result.REFERENCE,
      CHECKSUM: result.CHECKSUM,
    };
  }

  /**
   * Get the redirect form data needed to send the customer to PayGate's payment page.
   * Returns PAY_REQUEST_ID and CHECKSUM for the redirect POST form.
   */
  getRedirectData(payRequestId: string, reference: string): {
    PAY_REQUEST_ID: string;
    CHECKSUM: string;
  } {
    const checksum = this.generateRedirectChecksum(payRequestId, reference);
    return {
      PAY_REQUEST_ID: payRequestId,
      CHECKSUM: checksum,
    };
  }

  /**
   * Query a transaction status from PayGate.
   */
  async queryTransaction(payRequestId: string, reference: string): Promise<Record<string, string>> {
    const data: Record<string, string> = {
      PAYGATE_ID: this.config.payGateId,
      PAY_REQUEST_ID: payRequestId,
      REFERENCE: reference,
    };

    const checksum = this.generateChecksum(data);
    data.CHECKSUM = checksum;

    const response = await fetch(this.config.queryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data).toString(),
      cache: "no-store",
    });

    const responseText = await response.text();
    const responseParams = new URLSearchParams(responseText);

    const result: Record<string, string> = {};
    responseParams.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }

  /**
   * Verify payment amount (in cents) matches expected.
   */
  verifyPaymentAmount(expectedAmountCents: number, receivedAmountCents: number): boolean {
    return expectedAmountCents === receivedAmountCents;
  }

  /**
   * Map PayGate TRANSACTION_STATUS to order status.
   * 0=Not Done, 1=Approved, 2=Declined, 3=Cancelled, 4=User Cancelled, 5=Received, 7=Settlement Voided
   */
  mapTransactionStatus(transactionStatus: string): "pending" | "processing" | "completed" | "cancelled" {
    switch (transactionStatus) {
      case "1":
        return "completed";
      case "2":
        return "cancelled";
      case "3":
      case "4":
        return "cancelled";
      case "5":
        return "processing";
      case "0":
      case "7":
      default:
        return "pending";
    }
  }
}

/**
 * Initialize PayGate service with environment variables
 */
export function getPayGateService(): PayGateService {
  const config: PayGateConfig = {
    payGateId: process.env.PAYGATE_ID || "",
    encryptionKey: process.env.PAYGATE_ENCRYPTION_KEY || "",
    initiateUrl: process.env.PAYGATE_INITIATE_URL || "https://secure.paygate.co.za/payweb3/initiate.trans",
    redirectUrl: process.env.PAYGATE_REDIRECT_URL || "https://secure.paygate.co.za/payweb3/process.trans",
    queryUrl: process.env.PAYGATE_QUERY_URL || "https://secure.paygate.co.za/payweb3/query.trans",
  };

  if (!config.payGateId || !config.encryptionKey) {
    throw new Error(
      "PayGate configuration is incomplete. Please set PAYGATE_ID and PAYGATE_ENCRYPTION_KEY environment variables."
    );
  }

  return new PayGateService(config);
}
