# PayFast Payment Integration

This document explains how to use the PayFast payment integration in your Exquisite application.

## Overview

PayFast is a South African payment gateway that allows you to accept online payments securely. This integration supports:

- ✅ Secure payment processing
- ✅ Multiple payment methods (Credit Card, EFT, etc.)
- ✅ Payment confirmations via ITN (Instant Transaction Notifications)
- ✅ Sandbox testing environment
- ✅ Order tracking and status updates

## Environment Variables

The following environment variables are required in your `.env.local` file:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID="10000100"        # Your PayFast Merchant ID
PAYFAST_MERCHANT_KEY="46f0cd694581a"  # Your PayFast Merchant Key
PAYFAST_PASSPHRASE="jt7NOE43FZPn"     # Your PayFast Passphrase (Salt)
PAYFAST_MODE="sandbox"                 # "sandbox" or "live"
```

### Getting Your Credentials

1. **Sandbox (Testing):**
   - Visit [https://sandbox.payfast.co.za](https://sandbox.payfast.co.za)
   - Register for a free sandbox account
   - Find your credentials in the Settings section
   - Set your passphrase in Settings > Security > Salt Passphrase

2. **Live (Production):**
   - Visit [https://www.payfast.co.za](https://www.payfast.co.za)
   - Complete the merchant registration
   - Get your live credentials from your dashboard
   - Set a strong passphrase

## How It Works

### Payment Flow

1. **Customer adds items to cart** → Items are stored in the cart store
2. **Customer proceeds to checkout** → Checkout form is displayed
3. **Customer fills in details** → Cell number and confirms order
4. **Order is created** → Order is saved with "pending" status
5. **PayFast payment initialized** → Payment data is prepared with signature
6. **Redirect to PayFast** → Customer is redirected to PayFast payment page
7. **Customer completes payment** → Customer pays via PayFast
8. **ITN notification sent** → PayFast sends payment confirmation to your server
9. **Order status updated** → Order status is updated to "completed"
10. **Customer redirected back** → Customer is redirected to success page

### Security Checks

The integration performs the following security checks on payment notifications:

1. **Signature Verification** - Validates the MD5 signature
2. **IP Verification** - Ensures the request comes from PayFast servers
3. **Amount Verification** - Confirms the payment amount matches the order
4. **Server Confirmation** - Validates with PayFast servers

## File Structure

```
src/
├── lib/
│   └── payfast/
│       └── index.ts                  # PayFast service and utilities
├── app/
│   ├── api/
│   │   └── payfast/
│   │       ├── initialize/
│   │       │   └── route.ts          # Payment initialization endpoint
│   │       └── notify/
│   │           └── route.ts          # ITN handler endpoint
│   └── (public)/
│       └── checkout/
│           ├── success/
│           │   └── page.tsx          # Payment success page
│           └── cancel/
│               └── page.tsx          # Payment cancelled page
└── components/
    └── checkout/
        └── checkout-form.tsx         # Checkout form with PayFast integration
```

## API Endpoints

### POST /api/payfast/initialize

Initializes a PayFast payment for an order.

**Request Body:**
```json
{
  "orderId": "123",
  "cellNumber": "+27821234567"
}
```

**Response:**
```json
{
  "success": true,
  "paymentData": {
    "merchant_id": "10000100",
    "merchant_key": "46f0cd694581a",
    "amount": "150.00",
    "item_name": "Order #123",
    "signature": "abc123...",
    ...
  },
  "paymentUrl": "https://sandbox.payfast.co.za/eng/process"
}
```

### POST /api/payfast/notify

Receives payment notifications from PayFast (ITN).

**This endpoint is called by PayFast, not your frontend.**

PayFast will POST payment details to this URL when:
- Payment is completed
- Payment is cancelled
- Payment status changes

## Testing

### Sandbox Testing

1. Ensure `PAYFAST_MODE="sandbox"` in your `.env.local`
2. Use the sandbox merchant credentials
3. Create a test order and proceed to payment
4. You'll be redirected to the PayFast sandbox
5. Login with sandbox buyer credentials:
   - **Username:** sbtu01@payfast.io
   - **Password:** clientpass
6. Complete the test payment using the PayFast wallet

### Local Development with ITN

For local development, PayFast cannot reach your localhost notify URL. Use one of these solutions:

1. **ngrok** - Expose your local server:
   ```bash
   ngrok http 3000
   ```
   Then update `NEXT_PUBLIC_SERVER_URL` in `.env.local` to your ngrok URL

2. **Expose** - Alternative to ngrok:
   ```bash
   expose share http://localhost:3000
   ```

## Troubleshooting

### Common Issues

1. **Signature Mismatch**
   - Ensure passphrase is set correctly in both your code and PayFast dashboard
   - Check that all fields are URL encoded correctly
   - Verify the field order matches PayFast requirements

2. **ITN Not Received**
   - Check that notify_url is publicly accessible
   - Verify your firewall allows PayFast IPs
   - Check server logs for incoming requests
   - For local dev, ensure ngrok/expose is running

3. **Payment Amount Mismatch**
   - Verify cart total calculation
   - Check that amounts are formatted to 2 decimal places
   - Ensure currency is in ZAR

4. **Invalid PayFast IP**
   - Whitelist PayFast IP ranges:
     - 197.97.145.144/28
     - 41.74.179.192/27
     - 102.216.36.0/28
     - 102.216.36.128/28
     - 144.126.193.139

## Going Live

When ready to go live:

1. Register for a live PayFast merchant account
2. Update environment variables:
   ```env
   PAYFAST_MERCHANT_ID="your_live_merchant_id"
   PAYFAST_MERCHANT_KEY="your_live_merchant_key"
   PAYFAST_PASSPHRASE="your_live_passphrase"
   PAYFAST_MODE="live"
   ```
3. Set your production `NEXT_PUBLIC_SERVER_URL`
4. Test with small real transactions first
5. Monitor ITN logs for the first few transactions

## Additional Resources

- [PayFast Documentation](https://developers.payfast.co.za/docs)
- [PayFast Sandbox](https://sandbox.payfast.co.za)
- [PayFast Support](https://support.payfast.co.za)
- [PayFast Dashboard](https://www.payfast.co.za)

## Support

For issues with:
- **Integration code** - Check this documentation and project issues
- **PayFast account** - Contact PayFast support
- **Payment errors** - Check PayFast dashboard and ITN logs
