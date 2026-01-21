import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import type {
  TimerFormData,
  TimerErrorResponse,
  TogglePublishRequest,
} from "../types/timer";

// GET /api/timers/:id - Get single timer
export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { session } = await authenticate.admin(request);
    const { id } = params;

    if (!id) {
      return json<TimerErrorResponse>(
        { error: "Timer ID required" },
        { status: 400 },
      );
    }

    const timer = await db.timer.findFirst({
      where: {
        id,
        shop: session.shop, // Ensure user can only access their own timers
      },
    });

    if (!timer) {
      return json<TimerErrorResponse>(
        { error: "Timer not found" },
        { status: 404 },
      );
    }

    return json({ timer });
  } catch (error) {
    console.error("Error fetching timer:", error);
    return json<TimerErrorResponse>(
      { error: "Failed to fetch timer" },
      { status: 500 },
    );
  }
}

// PUT /api/timers/:id - Update timer
// DELETE /api/timers/:id - Delete timer
// PATCH /api/timers/:id - Publish/unpublish
export async function action({ request, params }: ActionFunctionArgs) {
  try {
    const { session } = await authenticate.admin(request);
    const { id } = params;

    if (!id) {
      return json<TimerErrorResponse>(
        { error: "Timer ID required" },
        { status: 400 },
      );
    }

    // Verify timer belongs to shop
    const existingTimer = await db.timer.findFirst({
      where: { id, shop: session.shop },
    });

    if (!existingTimer) {
      return json<TimerErrorResponse>(
        { error: "Timer not found" },
        { status: 404 },
      );
    }

    // DELETE
    if (request.method === "DELETE") {
      await db.timer.delete({ where: { id } });
      return json({ success: true });
    }

    // PATCH - Toggle publish status
    if (request.method === "PATCH") {
      const { isPublished } = (await request.json()) as TogglePublishRequest;

      if (typeof isPublished !== "boolean") {
        return json<TimerErrorResponse>(
          { error: "isPublished must be a boolean" },
          { status: 400 },
        );
      }

      const timer = await db.timer.update({
        where: { id },
        data: { isPublished },
      });

      return json({ timer });
    }

    // PUT - Full update
    if (request.method === "PUT") {
      const data = (await request.json()) as TimerFormData;

      // Validate timer type if provided
      if (data.type) {
        const validTypes = [
          "product-page",
          "top-bottom-bar",
          "landing-page",
          "cart-page",
        ];
        if (!validTypes.includes(data.type)) {
          return json<TimerErrorResponse>(
            { error: "Invalid timer type" },
            { status: 400 },
          );
        }
      }

      const timer = await db.timer.update({
        where: { id },
        data: {
          name: data.name || existingTimer.name,
          title: data.title || existingTimer.title,
          subheading:
            data.subheading !== undefined
              ? data.subheading
              : existingTimer.subheading,

          endDate: data.endDate
            ? new Date(data.endDate)
            : existingTimer.endDate,
          timerType: data.timerType || existingTimer.timerType,
          fixedMinutes:
            data.fixedMinutes !== undefined
              ? data.fixedMinutes
              : existingTimer.fixedMinutes,
          isRecurring:
            data.isRecurring !== undefined
              ? data.isRecurring
              : existingTimer.isRecurring,
          recurringConfig:
            data.recurringConfig !== undefined
              ? (data.recurringConfig as any)
              : existingTimer.recurringConfig,

          daysLabel: data.daysLabel || existingTimer.daysLabel,
          hoursLabel: data.hoursLabel || existingTimer.hoursLabel,
          minutesLabel: data.minutesLabel || existingTimer.minutesLabel,
          secondsLabel: data.secondsLabel || existingTimer.secondsLabel,

          startsAt: data.startsAt
            ? new Date(data.startsAt)
            : existingTimer.startsAt,
          onExpiry: data.onExpiry || existingTimer.onExpiry,

          ctaType:
            data.ctaType !== undefined ? data.ctaType : existingTimer.ctaType,
          buttonText:
            data.buttonText !== undefined
              ? data.buttonText
              : existingTimer.buttonText,
          buttonLink:
            data.buttonLink !== undefined
              ? data.buttonLink
              : existingTimer.buttonLink,

          designConfig:
            (data.designConfig as any) || existingTimer.designConfig,
          placementConfig:
            (data.placementConfig as any) || existingTimer.placementConfig,

          productSelection:
            data.productSelection || existingTimer.productSelection,
          selectedProducts:
            data.selectedProducts !== undefined
              ? (data.selectedProducts as any)
              : existingTimer.selectedProducts,
          selectedCollections:
            data.selectedCollections !== undefined
              ? (data.selectedCollections as any)
              : existingTimer.selectedCollections,
          excludedProducts:
            data.excludedProducts !== undefined
              ? (data.excludedProducts as any)
              : existingTimer.excludedProducts,
          productTags:
            data.productTags !== undefined
              ? (data.productTags as any)
              : existingTimer.productTags,
          pageSelection:
            data.pageSelection !== undefined
              ? data.pageSelection
              : existingTimer.pageSelection,
          excludedPages:
            data.excludedPages !== undefined
              ? (data.excludedPages as any)
              : existingTimer.excludedPages,

          geolocation: data.geolocation || existingTimer.geolocation,
          countries:
            data.countries !== undefined
              ? (data.countries as any)
              : existingTimer.countries,

          isPublished:
            data.isPublished !== undefined
              ? data.isPublished
              : existingTimer.isPublished,
        },
      });

      return json({ timer });
    }

    return json<TimerErrorResponse>(
      { error: "Method not allowed" },
      { status: 405 },
    );
  } catch (error) {
    console.error("Error updating timer:", error);
    return json<TimerErrorResponse>(
      { error: "Failed to update timer" },
      { status: 500 },
    );
  }
}
