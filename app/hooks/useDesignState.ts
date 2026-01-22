import { useState, useCallback, useEffect } from "react";
import type { DesignConfig, ColorHSBA, PositioningType, BackgroundType } from "../types/timer";
import { hexToHsb, hsbToHex } from "../utils/timer/color";

interface UseDesignStateProps {
  timerType: "product" | "top-bottom-bar";
  initialConfig?: DesignConfig;
  onConfigChange?: (config: DesignConfig) => void;
}

export function useDesignState({
  timerType,
  initialConfig = {},
  onConfigChange,
}: UseDesignStateProps) {
  // Positioning (for top-bottom-bar)
  const [positioning, setPositioning] = useState<PositioningType>(
    initialConfig.positioning || "top"
  );

  // Background
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(
    initialConfig.backgroundType || "single"
  );
  const [backgroundColor, setBackgroundColor] = useState<ColorHSBA>(
    initialConfig.backgroundColor ? hexToHsb(initialConfig.backgroundColor) : { hue: 0, saturation: 0, brightness: 1, alpha: 1 }
  );

  // Background color popover and text field
  const [bgColorPopover, setBgColorPopover] = useState(false);
  const [bgColorText, setBgColorText] = useState(
    initialConfig.backgroundColor || "#ffffff"
  );

  // Border
  const [borderRadius, setBorderRadius] = useState(
    String(initialConfig.borderRadius || 8)
  );
  const [borderSize, setBorderSize] = useState(
    String(initialConfig.borderSize || 0)
  );
  const [borderColor, setBorderColor] = useState<ColorHSBA>(
    initialConfig.borderColor ? hexToHsb(initialConfig.borderColor) : { hue: 0, saturation: 0, brightness: 0.82, alpha: 1 }
  );
  const [borderColorPopover, setBorderColorPopover] = useState(false);
  const [borderColorText, setBorderColorText] = useState(
    initialConfig.borderColor || "#d1d5db"
  );

  // Spacing
  const [insideTop, setInsideTop] = useState(
    String(initialConfig.paddingTop || 30)
  );
  const [insideBottom, setInsideBottom] = useState(
    String(initialConfig.paddingBottom || 30)
  );
  const [outsideTop, setOutsideTop] = useState(
    String(initialConfig.marginTop || 0)
  );
  const [outsideBottom, setOutsideBottom] = useState(
    String(initialConfig.marginBottom || 0)
  );

  // Typography - Title
  const [titleSize, setTitleSize] = useState(
    String(initialConfig.titleSize || 28)
  );
  const [titleColor, setTitleColor] = useState<ColorHSBA>(
    initialConfig.titleColor ? hexToHsb(initialConfig.titleColor) : { hue: 0, saturation: 0, brightness: 0.13, alpha: 1 }
  );
  const [titleColorPopover, setTitleColorPopover] = useState(false);
  const [titleColorText, setTitleColorText] = useState(
    initialConfig.titleColor || "#212121"
  );

  // Typography - Subheading
  const [subheadingSize, setSubheadingSize] = useState(
    String(initialConfig.subheadingSize || 16)
  );
  const [subheadingColor, setSubheadingColor] = useState<ColorHSBA>(
    initialConfig.subheadingColor ? hexToHsb(initialConfig.subheadingColor) : { hue: 0, saturation: 0, brightness: 0.13, alpha: 1 }
  );
  const [subheadingColorPopover, setSubheadingColorPopover] = useState(false);
  const [subheadingColorText, setSubheadingColorText] = useState(
    initialConfig.subheadingColor || "#212121"
  );

  // Typography - Timer
  const [timerSize, setTimerSize] = useState(
    String(initialConfig.timerSize || 40)
  );
  const [timerColor, setTimerColor] = useState<ColorHSBA>(
    initialConfig.timerColor ? hexToHsb(initialConfig.timerColor) : { hue: 0, saturation: 0, brightness: 0.13, alpha: 1 }
  );
  const [timerColorPopover, setTimerColorPopover] = useState(false);
  const [timerColorText, setTimerColorText] = useState(
    initialConfig.timerColor || "#212121"
  );

  // Typography - Legend
  const [legendSize, setLegendSize] = useState(
    String(initialConfig.legendSize || 14)
  );
  const [legendColor, setLegendColor] = useState<ColorHSBA>(
    initialConfig.legendColor ? hexToHsb(initialConfig.legendColor) : { hue: 0, saturation: 0, brightness: 0.44, alpha: 1 }
  );
  const [legendColorPopover, setLegendColorPopover] = useState(false);
  const [legendColorText, setLegendColorText] = useState(
    initialConfig.legendColor || "#707070"
  );

  // Button (for CTA)
  const [buttonFontSize, setButtonFontSize] = useState(
    String(initialConfig.buttonFontSize || 16)
  );
  const [cornerRadius, setCornerRadius] = useState(
    String(initialConfig.buttonCornerRadius || 4)
  );
  const [buttonColor, setButtonColor] = useState<ColorHSBA>(
    initialConfig.buttonColor ? hexToHsb(initialConfig.buttonColor) : { hue: 0, saturation: 0, brightness: 1, alpha: 1 }
  );
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState<ColorHSBA>(
    initialConfig.buttonBackgroundColor ? hexToHsb(initialConfig.buttonBackgroundColor) : { hue: 225, saturation: 0.47, brightness: 0.77, alpha: 1 }
  );
  const [buttonColorPopover, setButtonColorPopover] = useState(false);
  const [buttonBgColorPopover, setButtonBgColorPopover] = useState(false);
  const [buttonColorText, setButtonColorText] = useState(
    initialConfig.buttonColor || "#ffffff"
  );
  const [buttonBgColorText, setButtonBgColorText] = useState(
    initialConfig.buttonBackgroundColor || "#5c6ac4"
  );

  // Update config whenever any value changes
  useEffect(() => {
    const newConfig: DesignConfig = {
      // Positioning
      positioning,
      // Background
      backgroundType,
      backgroundColor: hsbToHex(backgroundColor),
      // Border
      borderRadius: parseInt(borderRadius) || 8,
      borderSize: parseInt(borderSize) || 0,
      borderColor: hsbToHex(borderColor),
      // Spacing
      paddingTop: parseInt(insideTop) || 30,
      paddingBottom: parseInt(insideBottom) || 30,
      marginTop: parseInt(outsideTop) || 0,
      marginBottom: parseInt(outsideBottom) || 0,
      // Typography
      titleSize: parseInt(titleSize) || 28,
      titleColor: hsbToHex(titleColor),
      subheadingSize: parseInt(subheadingSize) || 16,
      subheadingColor: hsbToHex(subheadingColor),
      timerSize: parseInt(timerSize) || 40,
      timerColor: hsbToHex(timerColor),
      legendSize: parseInt(legendSize) || 14,
      legendColor: hsbToHex(legendColor),
      // Button
      buttonFontSize: parseInt(buttonFontSize) || 16,
      buttonCornerRadius: parseInt(cornerRadius) || 4,
      buttonColor: hsbToHex(buttonColor),
      buttonBackgroundColor: hsbToHex(buttonBackgroundColor),
    };

    onConfigChange?.(newConfig);
  }, [
    positioning,
    backgroundType,
    backgroundColor,
    borderRadius,
    borderSize,
    borderColor,
    insideTop,
    insideBottom,
    outsideTop,
    outsideBottom,
    titleSize,
    titleColor,
    subheadingSize,
    subheadingColor,
    timerSize,
    timerColor,
    legendSize,
    legendColor,
    buttonFontSize,
    cornerRadius,
    buttonColor,
    buttonBackgroundColor,
    onConfigChange,
  ]);

  // Helper to handle hex text input
  const handleHexChange = useCallback(
    (value: string, setter: (color: ColorHSBA) => void, textSetter: (text: string) => void) => {
      textSetter(value);

      if (!value.startsWith("#") && value.length > 0) {
        value = "#" + value;
      }

      const hexPattern = /^#([A-Fa-f0-9]{6})$/;
      const match = value.match(hexPattern);

      if (match) {
        const hsb = hexToHsb(value);
        setter(hsb);
      }
    },
    []
  );

  // Toggle popover functions
  const toggleBgColorPopover = useCallback(() => setBgColorPopover((prev) => !prev), []);
  const toggleBorderColorPopover = useCallback(() => setBorderColorPopover((prev) => !prev), []);
  const toggleTitleColorPopover = useCallback(() => setTitleColorPopover((prev) => !prev), []);
  const toggleSubheadingColorPopover = useCallback(() => setSubheadingColorPopover((prev) => !prev), []);
  const toggleTimerColorPopover = useCallback(() => setTimerColorPopover((prev) => !prev), []);
  const toggleLegendColorPopover = useCallback(() => setLegendColorPopover((prev) => !prev), []);
  const toggleButtonColorPopover = useCallback(() => setButtonColorPopover((prev) => !prev), []);
  const toggleButtonBgColorPopover = useCallback(() => setButtonBgColorPopover((prev) => !prev), []);

  // Handle color picker changes with text sync
  const handleBackgroundColorChange = useCallback((color: ColorHSBA) => {
    setBackgroundColor(color);
    setBgColorText(hsbToHex(color));
  }, []);

  const handleBorderColorChange = useCallback((color: ColorHSBA) => {
    setBorderColor(color);
    setBorderColorText(hsbToHex(color));
  }, []);

  const handleTitleColorChange = useCallback((color: ColorHSBA) => {
    setTitleColor(color);
    setTitleColorText(hsbToHex(color));
  }, []);

  const handleSubheadingColorChange = useCallback((color: ColorHSBA) => {
    setSubheadingColor(color);
    setSubheadingColorText(hsbToHex(color));
  }, []);

  const handleTimerColorChange = useCallback((color: ColorHSBA) => {
    setTimerColor(color);
    setTimerColorText(hsbToHex(color));
  }, []);

  const handleLegendColorChange = useCallback((color: ColorHSBA) => {
    setLegendColor(color);
    setLegendColorText(hsbToHex(color));
  }, []);

  const handleButtonColorChange = useCallback((color: ColorHSBA) => {
    setButtonColor(color);
    setButtonColorText(hsbToHex(color));
  }, []);

  const handleButtonBgColorChange = useCallback((color: ColorHSBA) => {
    setButtonBackgroundColor(color);
    setButtonBgColorText(hsbToHex(color));
  }, []);

  return {
    // Positioning
    positioning,
    setPositioning,

    // Background
    backgroundType,
    setBackgroundType,
    backgroundColor,
    setBackgroundColor: handleBackgroundColorChange,
    bgColorPopover,
    toggleBgColorPopover,
    bgColorText,
    setBgColorText,

    // Border
    borderRadius,
    setBorderRadius,
    borderSize,
    setBorderSize,
    borderColor,
    setBorderColor: handleBorderColorChange,
    borderColorPopover,
    toggleBorderColorPopover,
    borderColorText,
    setBorderColorText,

    // Spacing
    insideTop,
    setInsideTop,
    insideBottom,
    setInsideBottom,
    outsideTop,
    setOutsideTop,
    outsideBottom,
    setOutsideBottom,

    // Title
    titleSize,
    setTitleSize,
    titleColor,
    setTitleColor: handleTitleColorChange,
    titleColorPopover,
    toggleTitleColorPopover,
    titleColorText,
    setTitleColorText,

    // Subheading
    subheadingSize,
    setSubheadingSize,
    subheadingColor,
    setSubheadingColor: handleSubheadingColorChange,
    subheadingColorPopover,
    toggleSubheadingColorPopover,
    subheadingColorText,
    setSubheadingColorText,

    // Timer
    timerSize,
    setTimerSize,
    timerColor,
    setTimerColor: handleTimerColorChange,
    timerColorPopover,
    toggleTimerColorPopover,
    timerColorText,
    setTimerColorText,

    // Legend
    legendSize,
    setLegendSize,
    legendColor,
    setLegendColor: handleLegendColorChange,
    legendColorPopover,
    toggleLegendColorPopover,
    legendColorText,
    setLegendColorText,

    // Button
    buttonFontSize,
    setButtonFontSize,
    cornerRadius,
    setCornerRadius,
    buttonColor,
    setButtonColor: handleButtonColorChange,
    buttonBackgroundColor,
    setButtonBackgroundColor: handleButtonBgColorChange,
    buttonColorPopover,
    toggleButtonColorPopover,
    buttonBgColorPopover,
    toggleButtonBgColorPopover,
    buttonColorText,
    setButtonColorText,
    buttonBgColorText,
    setButtonBgColorText,

    // Utility
    handleHexChange,
  };
}
