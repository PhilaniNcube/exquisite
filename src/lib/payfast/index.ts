import crypto from "crypto";

export interface PayFastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  cell_number: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description?: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
}

export interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  paymentUrl: string;
  validationUrl: string;
}

export class PayFastService {
  private config: PayFastConfig;

  constructor(config: PayFastConfig) {
    this.config = config;
  }

  get paymentUrl(): string {
    return this.config.paymentUrl;
  }

  get validationUrl(): string {
    return this.config.validationUrl;
  }

  /**
   * PayFast-compliant URL encoding: uppercase hex, spaces as '+'
   */
  private pfEncode(str: string): string {
    return encodeURIComponent(str.trim())
      .replace(/%20/g, "+")
      .replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
      .replace(/%[0-9a-f]{2}/gi, (match) => match.toUpperCase());
  }

  /**
   * The required field order per PayFast docs.
   * Signature must use this exact order, not alphabetical.
   */
  private static readonly FIELD_ORDER = [
    // Merchant details
    "merchant_id",
    "merchant_key",
    "return_url",
    "cancel_url",
    "notify_url",
    // Customer details
    "name_first",
    "name_last",
    "email_address",
    "cell_number",
    // Transaction details
    "m_payment_id",
    "amount",
    "item_name",
    "item_description",
    "custom_int1",
    "custom_int2",
    "custom_int3",
    "custom_int4",
    "custom_int5",
    "custom_str1",
    "custom_str2",
    "custom_str3",
    "custom_str4",
    "custom_str5",
    // Transaction options
    "email_confirmation",
    "confirmation_address",
    // Payment method
    "payment_method",
    // Subscription fields
    "subscription_type",
    "billing_date",
    "recurring_amount",
    "frequency",
    "cycles",
    // Split payment
    "setup",
  ];

  private buildParamString(
    data: Record<string, string | undefined>,
    options?: {
      passphrase?: string;
      orderedKeys?: string[];
      excludeKeys?: string[];
    }
  ): string {
    const entries: string[] = [];
    const excludedKeys = new Set(options?.excludeKeys ?? []);
    const orderedKeys = options?.orderedKeys ?? Object.keys(data);
    const seenKeys = new Set<string>();

    for (const key of orderedKeys) {
      const value = data[key];

      if (
        seenKeys.has(key) ||
        excludedKeys.has(key) ||
        value === undefined ||
        value === null ||
        value === ""
      ) {
        continue;
      }

      seenKeys.add(key);
      entries.push(`${key}=${this.pfEncode(String(value))}`);
    }

    for (const [key, value] of Object.entries(data)) {
      if (
        seenKeys.has(key) ||
        excludedKeys.has(key) ||
        value === undefined ||
        value === null ||
        value === ""
      ) {
        continue;
      }

      entries.push(`${key}=${this.pfEncode(String(value))}`);
    }

    const passphraseToUse = options?.passphrase ?? this.config.passphrase;

    if (passphraseToUse) {
      entries.push(`passphrase=${this.pfEncode(passphraseToUse)}`);
    }

    return entries.join("&");
  }

  /**
   * Generate MD5 signature for PayFast payment
   */
  generateSignature(
    data: Record<string, string | undefined>,
    passphrase?: string
  ): string {
    const paramString = this.buildParamString(data, {
      passphrase,
      orderedKeys: PayFastService.FIELD_ORDER,
    });

    return crypto.createHash("md5").update(paramString).digest("hex");
  }

  generateITNSignature(
    data: Record<string, string | undefined>,
    passphrase?: string
  ): string {
    const paramString = this.buildParamString(data, {
      passphrase,
      excludeKeys: ["signature"],
    });

    return crypto.createHash("md5").update(paramString).digest("hex");
  }

  /**
   * Verify signature from PayFast ITN
   */
  verifySignature(
    data: Record<string, string>,
    providedSignature: string,
    passphrase?: string
  ): boolean {
    // Create a copy without the signature
    const dataWithoutSignature = { ...data };
    delete dataWithoutSignature.signature;
    
    const calculatedSignature = this.generateSignature(
      dataWithoutSignature,
      passphrase
    );
    
    return calculatedSignature === providedSignature;
  }

  verifyITNSignature(
    data: Record<string, string>,
    providedSignature: string,
    passphrase?: string
  ): boolean {
    const calculatedSignature = this.generateITNSignature(data, passphrase);

    return calculatedSignature === providedSignature;
  }

  createITNValidationString(data: Record<string, string>): string {
    return this.buildParamString(data, {
      passphrase: "",
      excludeKeys: ["signature"],
    });
  }

  /**
   * Verify PayFast server confirmation
   */
  async verifyServerConfirmation(paramString: string): Promise<boolean> {
    try {
      const response = await fetch(this.validationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: paramString,
      });

      const result = await response.text();
      return result === "VALID";
    } catch (error) {
      console.error("Error verifying PayFast server confirmation:", error);
      return false;
    }
  }

  /**
   * Verify PayFast IP address
   */
  isValidPayFastIP(ip: string): boolean {
    const validIPs = [
      // PayFast IP ranges
      "197.97.145.144/28", // Range: 197.97.145.144 - 197.97.145.159
      "41.74.179.192/27", // Range: 41.74.179.192 - 41.74.179.223
      "102.216.36.0/28", // Range: 102.216.36.0 - 102.216.36.15
      "102.216.36.128/28", // Range: 102.216.36.128 - 102.216.36.143
      "144.126.193.139",
    ];

    // For sandbox testing, allow localhost
    if (ip === "127.0.0.1" || ip === "::1") {
      return true;
    }

    // Check if IP is in valid ranges
    // Note: For production, implement proper IP range checking
    return validIPs.some((validIP) => {
      if (validIP.includes("/")) {
        return this.isIPInCIDR(ip, validIP);
      }
      return ip === validIP;
    });
  }

  private isIPInCIDR(ip: string, cidr: string): boolean {
    const [range, bits] = cidr.split("/");
    const mask = ~(2 ** (32 - Number(bits)) - 1) >>> 0;
    const ipNum = ip.split(".").reduce((n, o) => (n << 8) + Number(o), 0) >>> 0;
    const rangeNum = range.split(".").reduce((n, o) => (n << 8) + Number(o), 0) >>> 0;
    return (ipNum & mask) === (rangeNum & mask);
  }

  /**
   * Verify payment data matches expected amount
   */
  verifyPaymentData(expectedAmount: number, receivedAmount: number): boolean {
    return Math.abs(expectedAmount - receivedAmount) < 0.01;
  }

  /**
   * Create payment data object
   */
  createPaymentData(params: {
    orderId: string;
    amount: number;
    itemName: string;
    itemDescription?: string;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    customerCell: string;
    returnUrl: string;
    cancelUrl: string;
    notifyUrl: string;
    customFields?: {
      str1?: string;
      str2?: string;
      str3?: string;
      str4?: string;
      str5?: string;
      int1?: string;
      int2?: string;
      int3?: string;
      int4?: string;
      int5?: string;
    };
  }): PayFastPaymentData & { signature: string } {
    const data: PayFastPaymentData = {
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
      return_url: params.returnUrl,
      cancel_url: params.cancelUrl,
      notify_url: params.notifyUrl,
      name_first: params.customerFirstName,
      name_last: params.customerLastName,
      email_address: params.customerEmail,
      cell_number: params.customerCell,
      m_payment_id: params.orderId,
      amount: params.amount.toFixed(2),
      item_name: params.itemName,
      item_description: params.itemDescription,
    };

    // Add custom fields if provided
    if (params.customFields) {
      if (params.customFields.str1) data.custom_str1 = params.customFields.str1;
      if (params.customFields.str2) data.custom_str2 = params.customFields.str2;
      if (params.customFields.str3) data.custom_str3 = params.customFields.str3;
      if (params.customFields.str4) data.custom_str4 = params.customFields.str4;
      if (params.customFields.str5) data.custom_str5 = params.customFields.str5;
      if (params.customFields.int1) data.custom_int1 = params.customFields.int1;
      if (params.customFields.int2) data.custom_int2 = params.customFields.int2;
      if (params.customFields.int3) data.custom_int3 = params.customFields.int3;
      if (params.customFields.int4) data.custom_int4 = params.customFields.int4;
      if (params.customFields.int5) data.custom_int5 = params.customFields.int5;
    }

    // Generate signature
    const signature = this.generateSignature(data as unknown as Record<string, string | undefined>);

    return {
      ...data,
      signature,
    };
  }
}

/**
 * Initialize PayFast service with environment variables
 */
export function getPayFastService(): PayFastService {
  const config: PayFastConfig = {
    merchantId: process.env.PAYFAST_MERCHANT_ID || "",
    merchantKey: process.env.PAYFAST_MERCHANT_KEY || "",
    passphrase: process.env.PAYFAST_PASSPHRASE || "",
    paymentUrl: process.env.PAYFAST_PAYMENT_URL || "https://sandbox.payfast.co.za/eng/process",
    validationUrl: process.env.PAYFAST_VALIDATION_URL || "https://sandbox.payfast.co.za/eng/query/validate",
  };

  if (!config.merchantId || !config.merchantKey) {
    throw new Error(
      "PayFast configuration is incomplete. Please set PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY environment variables."
    );
  }

  return new PayFastService(config);
}
