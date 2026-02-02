import crypto from "crypto";

/**
 * Validates that a request came from Shopify's App Proxy.
 *
 * Shopify signs app proxy requests with HMAC. The signature is passed as
 * a query parameter named "signature". We need to verify it using the
 * app's API secret.
 *
 * @see https://shopify.dev/docs/apps/build/online-store/app-proxies#security
 */

export interface ProxyValidationResult {
  isValid: boolean;
  shop?: string;
  error?: string;
}

/**
 * Validates the Shopify App Proxy signature.
 *
 * @param request - The incoming request object
 * @returns ProxyValidationResult with isValid flag and shop domain if valid
 */
export function validateProxyRequest(request: Request): ProxyValidationResult {
  const url = new URL(request.url);
  const params = url.searchParams;

  // Extract signature from query params
  const signature = params.get("signature");
  if (!signature) {
    return { isValid: false, error: "Missing signature parameter" };
  }

  // Extract shop domain
  const shop = params.get("shop");
  if (!shop) {
    return { isValid: false, error: "Missing shop parameter" };
  }

  // Get API secret from environment (support multiple common env var names)

  const apiSecret =
    process.env.SHOPIFY_CLIENT_SECRET ||
    process.env.SHOPIFY_API_SECRET ||
    process.env.SHOPIFY_API_SECRET_KEY;

  if (!apiSecret) {
    return { isValid: false, error: "API secret not configured" };
  }

  // Build the message to sign using the raw query string sent by Shopify,
  // excluding the `signature` param without altering encoding/order.
  // This avoids mismatches caused by URLSearchParams re-encoding.
  const rawQuery = url.search.startsWith("?")
    ? url.search.slice(1)
    : url.search;

  // Remove the signature param in a way that preserves the original encoding/order
  // Handles cases where signature may be first, middle, or last param.
  const message = rawQuery
    .split("&")
    .filter((pair) => !pair.startsWith("signature="))
    .join("&");

  // Compute HMAC-SHA256 (hex digest to match Shopify app proxy "signature" param)

  const computed = crypto

    .createHmac("sha256", apiSecret)

    .update(message, "utf8")

    .digest("hex");

  // Normalize for comparison
  const receivedSig = signature.toLowerCase();
  const computedSig = computed.toLowerCase();

  // timingSafeEqual requires buffers of the same length
  const recvBuf = Buffer.from(receivedSig, "utf8");
  const compBuf = Buffer.from(computedSig, "utf8");
  const isValid =
    recvBuf.length === compBuf.length &&
    crypto.timingSafeEqual(recvBuf, compBuf);

  if (!isValid) {
    return { isValid: false, error: "Invalid signature" };
  }

  return { isValid: true, shop };
}

/**
 * Helper to extract shop domain from proxy request headers or params.
 * Fallback chain: query param > header > null
 */
export function getShopFromProxy(request: Request): string | null {
  const url = new URL(request.url);
  const shopParam = url.searchParams.get("shop");
  if (shopParam) return shopParam;

  // Some proxies may pass shop in headers (non-standard)
  const shopHeader = request.headers.get("x-shopify-shop-domain");
  if (shopHeader) return shopHeader;

  return null;
}
