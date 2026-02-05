import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * Managed Pricing Redirect Route
 *
 * This route handles redirects to Shopify's managed pricing page.
 * Server-side redirects ensure proper iframe breakout and compatibility
 * with Shopify's embedding requirements.
 *
 * Usage: Navigate to /api/billing/managed-pricing?plan=<planId>
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // 1. Destructure the custom 'redirect' helper from authenticate.admin
  const { session, redirect: shopifyRedirect } =
    await authenticate.admin(request);

  if (!session?.shop) {
    throw new Response("Unauthorized", { status: 401 });
  }

  try {
    const storeHandle = session.shop.replace(".myshopify.com", "");
    const appHandle = "urgency-timer-3";

    // Use the shopify:// protocol or a full admin URL
    const managedPricingUrl = `https://admin.shopify.com/store/${storeHandle}/charges/${appHandle}/pricing_plans`;

    // 2. Use shopifyRedirect with target: "_top" to break out of the iframe
    return shopifyRedirect(managedPricingUrl, { target: "_top" });
  } catch (error) {
    console.error("Error redirecting:", error);
    return redirect("/plans?error=billing_redirect_failed");
  }
};
