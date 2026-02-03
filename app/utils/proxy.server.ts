import crypto from "crypto";

export interface ProxyValidationResult {
  isValid: boolean;
  shop?: string | null;
  error?: string;
}

export function validateProxyRequest(request: Request): ProxyValidationResult {
  const url = new URL(request.url);

  // Raw query string WITHOUT leading '?'
  const rawQuery = url.search.slice(1);

  if (!rawQuery) {
    return { isValid: false, error: "Missing query string" };
  }

  const searchParams = new URLSearchParams(rawQuery);

  const received = searchParams.get("signature");
  if (!received) {
    return { isValid: false, error: "Missing signature" };
  }

  // Build a map of all params except signature
  const params: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (key === "signature") continue;
    // URLSearchParams gives decoded values already
    params[key] = value ?? "";
  }

  // Sort keys alphabetically
  const sortedKeys = Object.keys(params).sort();

  // Build "key=value" pairs joined by "&"
  const message = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");

  console.log("🔥 HMAC MESSAGE:", message);

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    return { isValid: false, error: "Missing SHOPIFY_API_SECRET env var" };
  }

  const computed = crypto
    .createHmac("sha256", secret)
    .update(message, "utf8")
    .digest("hex");

  // Length check to avoid throwing in timingSafeEqual
  const computedBuf = Buffer.from(computed, "hex");
  const receivedBuf = Buffer.from(received, "hex");

  if (computedBuf.length !== receivedBuf.length) {
    return { isValid: false, error: "Signature length mismatch" };
  }

  const isValid = crypto.timingSafeEqual(computedBuf, receivedBuf);

  return {
    isValid,
    shop: searchParams.get("shop"),
    error: isValid ? undefined : "Signature mismatch",
  };
}

export function getShopFromProxy(request: Request): string | null {
  const url = new URL(request.url);
  return (
    url.searchParams.get("shop") || request.headers.get("x-shopify-shop-domain")
  );
}
