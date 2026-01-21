import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// GET /api/timers - List all timers for the shop
export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const timers = await db.timer.findMany({
    where: {
      shop: session.shop,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json({ timers });
}

// POST /api/timers - Create a new timer
export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const data = await request.json();

  const timer = await db.timer.create({
    data: {
      shop: session.shop,
      name: data.name,
      type: data.type,
      title: data.title,
      subheading: data.subheading || null,

      // Timer settings
      endDate: data.endDate ? new Date(data.endDate) : null,
      timerType: data.timerType || "countdown",
      fixedMinutes: data.fixedMinutes || null,
      isRecurring: data.isRecurring || false,
      recurringConfig: data.recurringConfig || null,

      // Labels
      daysLabel: data.daysLabel || "Days",
      hoursLabel: data.hoursLabel || "Hrs",
      minutesLabel: data.minutesLabel || "Mins",
      secondsLabel: data.secondsLabel || "Secs",

      // Scheduling
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      onExpiry: data.onExpiry || "unpublish",

      // CTA (for top-bottom-bar)
      ctaType: data.ctaType || null,
      buttonText: data.buttonText || null,
      buttonLink: data.buttonLink || null,

      // Design
      designConfig: data.designConfig || {},

      // Placement
      placementConfig: data.placementConfig || {},
      productSelection: data.productSelection || "all",
      selectedProducts: data.selectedProducts || null,
      selectedCollections: data.selectedCollections || null,
      excludedProducts: data.excludedProducts || null,
      productTags: data.productTags || null,
      pageSelection: data.pageSelection || null,
      excludedPages: data.excludedPages || null,

      // Geolocation
      geolocation: data.geolocation || "all-world",
      countries: data.countries || null,

      // Status
      isPublished: data.isPublished || false,
      isActive: true,
    },
  });

  return Response.json({ timer }, { status: 201 });
}
