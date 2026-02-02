import crypto from "crypto";

export interface ProxyValidationResult {
  isValid: boolean;
  shop?: string;
  error?: string;
}

export function validateProxyRequest(request: Request): ProxyValidationResult {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search); // decoded view of query params

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

  // Get API secret from environment
  const apiSecret =
    process.env.SHOPIFY_CLIENT_SECRET ||
    process.env.SHOPIFY_API_SECRET ||
    process.env.SHOPIFY_API_SECRET_KEY;

  if (!apiSecret) {
    return { isValid: false, error: "API secret not configured" };
  }

  // Remove the signature param before building the message
  params.delete("signature");

  // Build sorted message: key=value&key2=value2...
  // - Use decoded values (URLSearchParams already decodes)
  // - Sort lexicographically by key name
  const keys = Array.from(params.keys()).sort();

  const message = keys
    .map((key) => {
      // URLSearchParams might have multiple entries per key; app proxies
      // usually don't, but we handle it in case:
      const values = params.getAll(key);
      // If there are multiple values, each "key=value" is included in order
      return values.map((value) => `${key}=${value}`).join("&");
    })
    .filter(Boolean)
    .join("&");

  const computed = crypto
    .createHmac("sha256", apiSecret)
    .update(message, "utf8")
    .digest("hex");

  const receivedSig = signature.toLowerCase();
  const computedSig = computed.toLowerCase();

  const recvBuf = Buffer.from(receivedSig, "utf8");
  const compBuf = Buffer.from(computedSig, "utf8");

  const isValid =
    recvBuf.length === compBuf.length &&
    crypto.timingSafeEqual(recvBuf, compBuf);

  if (!isValid) {
    return {
      isValid: false,
      error: "Invalid signature",
    };
  }

  return { isValid: true, shop };
}

export function getShopFromProxy(request: Request): string | null {
  const url = new URL(request.url);
  const shopParam = url.searchParams.get("shop");
  if (shopParam) return shopParam;

  const shopHeader = request.headers.get("x-shopify-shop-domain");
  if (shopHeader) return shopHeader;

  return null;
}
