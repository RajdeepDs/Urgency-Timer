import { useState, useCallback } from "react";
import type {
  TimerTypeValue,
  TimerStarts,
  OnExpiryAction,
  CallToActionType,
  DesignConfig,
  PlacementConfig,
  Timer,
} from "../types/timer";

interface UseTimerFormProps {
  existingTimer?: Timer | null;
  timerType: "product-page" | "top-bottom-bar";
}

export function useTimerForm({ existingTimer, timerType }: UseTimerFormProps) {
  // Basic Information
  const [timerName, setTimerName] = useState(existingTimer?.name || "");
  const [title, setTitle] = useState(existingTimer?.title || "");
  const [subheading, setSubheading] = useState(existingTimer?.subheading || "");

  // Timer Type Settings
  const [timerTypeValue, setTimerTypeValue] = useState<TimerTypeValue>(
    (existingTimer?.timerType as TimerTypeValue) || "countdown"
  );
  const [timerStarts, setTimerStarts] = useState<TimerStarts>("now");

  // Date & Time
  const [endDate, setEndDate] = useState<Date>(
    existingTimer?.endDate ? new Date(existingTimer.endDate) : new Date()
  );
  const date = existingTimer?.endDate ? new Date(existingTimer.endDate) : new Date();
  const hours = date.getHours();
  const mins = date.getMinutes();

  const [hour, setHour] = useState(
    hours > 12 ? String(hours - 12) : String(hours || 12)
  );
  const [minute, setMinute] = useState(String(mins).padStart(2, "0"));
  const [period, setPeriod] = useState<"AM" | "PM">(hours >= 12 ? "PM" : "AM");

  // Fixed Minutes
  const [fixedMinutes, setFixedMinutes] = useState(
    String(existingTimer?.fixedMinutes || "10")
  );

  // Timer Labels
  const [daysLabel, setDaysLabel] = useState(existingTimer?.daysLabel || "Days");
  const [hoursLabel, setHoursLabel] = useState(existingTimer?.hoursLabel || "Hrs");
  const [minutesLabel, setMinutesLabel] = useState(
    existingTimer?.minutesLabel || "Mins"
  );
  const [secondsLabel, setSecondsLabel] = useState(
    existingTimer?.secondsLabel || "Secs"
  );

  // Once It Ends
  const [onceItEnds, setOnceItEnds] = useState<OnExpiryAction>(
    (existingTimer?.onExpiry as OnExpiryAction) || "unpublish"
  );

  // Call to Action (for top-bottom-bar)
  const [callToAction, setCallToAction] = useState<CallToActionType>(
    (existingTimer?.ctaType as CallToActionType) || "no"
  );
  const [buttonText, setButtonText] = useState(existingTimer?.buttonText || "Shop now!");
  const [buttonLink, setButtonLink] = useState(existingTimer?.buttonLink || "");

  // Design Configuration
  const [designConfig, setDesignConfig] = useState<DesignConfig>(
    existingTimer?.designConfig || {}
  );

  // Placement Configuration
  const [placementConfig, setPlacementConfig] = useState<PlacementConfig>(
    existingTimer?.placementConfig || {}
  );

  // Published State
  const [isPublished, setIsPublished] = useState(existingTimer?.isPublished || false);

  // Update design config
  const updateDesignConfig = useCallback((updates: Partial<DesignConfig>) => {
    setDesignConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  // Update placement config
  const updatePlacementConfig = useCallback((updates: Partial<PlacementConfig>) => {
    setPlacementConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setTimerName("");
    setTitle("");
    setSubheading("");
    setTimerTypeValue("countdown");
    setTimerStarts("now");
    setEndDate(new Date());
    setHour("12");
    setMinute("00");
    setPeriod("AM");
    setFixedMinutes("10");
    setDaysLabel("Days");
    setHoursLabel("Hrs");
    setMinutesLabel("Mins");
    setSecondsLabel("Secs");
    setOnceItEnds("unpublish");
    setCallToAction("no");
    setButtonText("Shop now!");
    setButtonLink("");
    setDesignConfig({});
    setPlacementConfig({});
    setIsPublished(false);
  }, []);

  // Get form data for submission
  const getFormData = useCallback(() => {
    return {
      timerName,
      title,
      subheading,
      timerTypeValue,
      timerStarts,
      endDate,
      hour,
      minute,
      period,
      fixedMinutes,
      daysLabel,
      hoursLabel,
      minutesLabel,
      secondsLabel,
      onceItEnds,
      callToAction,
      buttonText,
      buttonLink,
      designConfig,
      placementConfig,
      isPublished,
    };
  }, [
    timerName,
    title,
    subheading,
    timerTypeValue,
    timerStarts,
    endDate,
    hour,
    minute,
    period,
    fixedMinutes,
    daysLabel,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    onceItEnds,
    callToAction,
    buttonText,
    buttonLink,
    designConfig,
    placementConfig,
    isPublished,
  ]);

  return {
    // Basic Info
    timerName,
    setTimerName,
    title,
    setTitle,
    subheading,
    setSubheading,

    // Timer Type
    timerTypeValue,
    setTimerTypeValue,
    timerStarts,
    setTimerStarts,

    // Date & Time
    endDate,
    setEndDate,
    hour,
    setHour,
    minute,
    setMinute,
    period,
    setPeriod,

    // Fixed Minutes
    fixedMinutes,
    setFixedMinutes,

    // Labels
    daysLabel,
    setDaysLabel,
    hoursLabel,
    setHoursLabel,
    minutesLabel,
    setMinutesLabel,
    secondsLabel,
    setSecondsLabel,

    // Once It Ends
    onceItEnds,
    setOnceItEnds,

    // CTA
    callToAction,
    setCallToAction,
    buttonText,
    setButtonText,
    buttonLink,
    setButtonLink,

    // Design & Placement
    designConfig,
    setDesignConfig,
    updateDesignConfig,
    placementConfig,
    setPlacementConfig,
    updatePlacementConfig,

    // Published
    isPublished,
    setIsPublished,

    // Utility methods
    resetForm,
    getFormData,
  };
}
