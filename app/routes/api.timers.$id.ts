import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// GET /api/timers/:id - Get single timer
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { id } = params;

  if (!id) {
    return Response.json({ error: "Timer ID required" }, { status: 400 });
  }

  const timer = await db.timer.findFirst({
    where: {
      id,
      shop: session.shop, // Ensure user can only access their own timers
    },
  });

  if (!timer) {
    return Response.json({ error: "Timer not found" }, { status: 404 });
  }

  return Response.json({ timer });
}

// PUT /api/timers/:id - Update timer
// DELETE /api/timers/:id - Delete timer
// PATCH /api/timers/:id - Publish/unpublish
export async function action({ request, params }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { id } = params;

  if (!id) {
    return Response.json({ error: "Timer ID required" }, { status: 400 });
  }

  // Verify timer belongs to shop
  const existingTimer = await db.timer.findFirst({
    where: { id, shop: session.shop },
  });

  if (!existingTimer) {
    return Response.json({ error: "Timer not found" }, { status: 404 });
  }

  // DELETE
  if (request.method === "DELETE") {
    await db.timer.delete({ where: { id } });
    return Response.json({ success: true });
  }

  // PATCH - Toggle publish status
  if (request.method === "PATCH") {
    const { isPublished } = await request.json();
    const timer = await db.timer.update({
      where: { id },
      data: { isPublished },
    });
    return Response.json({ timer });
  }

  // PUT - Full update
  if (request.method === "PUT") {
    const data = await request.json();

    const timer = await db.timer.update({
      where: { id },
      data: {
        name: data.name,
        title: data.title,
        subheading: data.subheading || null,

        endDate: data.endDate ? new Date(data.endDate) : null,
        timerType: data.timerType,
        fixedMinutes: data.fixedMinutes || null,
        isRecurring: data.isRecurring || false,
        recurringConfig: data.recurringConfig || null,

        daysLabel: data.daysLabel || "Days",
        hoursLabel: data.hoursLabel || "Hrs",
        minutesLabel: data.minutesLabel || "Mins",
        secondsLabel: data.secondsLabel || "Secs",

        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        onExpiry: data.onExpiry || "unpublish",

        ctaType: data.ctaType || null,
        buttonText: data.buttonText || null,
        buttonLink: data.buttonLink || null,

        designConfig: data.designConfig || {},
        placementConfig: data.placementConfig || {},

        productSelection: data.productSelection || "all",
        selectedProducts: data.selectedProducts || null,
        selectedCollections: data.selectedCollections || null,
        excludedProducts: data.excludedProducts || null,
        productTags: data.productTags || null,
        pageSelection: data.pageSelection || null,
        excludedPages: data.excludedPages || null,

        geolocation: data.geolocation || "all-world",
        countries: data.countries || null,

        isPublished:
          data.isPublished !== undefined
            ? data.isPublished
            : existingTimer.isPublished,
      },
    });

    return Response.json({ timer });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
