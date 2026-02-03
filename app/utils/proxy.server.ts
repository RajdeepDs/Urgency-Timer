import crypto from "crypto";

export interface ProxyValidationResult {
  isValid: boolean;
  shop?: string | null;
  error?: string;
}

/**
 * Validates a Shopify App Proxy request signature.
 */
export function validateProxyRequest(request: Request): ProxyValidationResult {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const received = searchParams.get("signature");
  if (!received) {
    return { isValid: false, error: "Missing signature" };
  }

  // 1. Get all keys except signature and sort lexicographically
  const sortedKeys = Array.from(searchParams.keys())
    .filter((key) => key !== "signature")
    .sort();

  // 2. Construct message: key=value joined with NO separator
  // Multi-value params (like tags) are joined with commas per Shopify docs.
  const message = sortedKeys
    .map((key) => {
      const value = searchParams.getAll(key).join(",");
      return `${key}=${value}`;
    })
    .join("");

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error("❌ Missing SHOPIFY_API_SECRET env var");
    return { isValid: false, error: "Server configuration error" };
  }

  // 3. Compute HMAC-SHA256
  const computed = crypto
    .createHmac("sha256", secret)
    .update(message, "utf8")
    .digest("hex");

  // 4. Secure comparison
  const computedBuf = Buffer.from(computed, "hex");
  const receivedBuf = Buffer.from(received, "hex");

  if (computedBuf.length !== receivedBuf.length) {
    return { isValid: false, error: "Signature mismatch" };
  }

  const isValid = crypto.timingSafeEqual(computedBuf, receivedBuf);

  return {
    isValid,
    shop: searchParams.get("shop"),
    error: isValid ? undefined : `Mismatch. Message was: ${message}`,
  };
}
