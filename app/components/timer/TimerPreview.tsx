import type { DesignConfig } from "../../types/timer";
import { cn } from "../../utils/cn";

interface TimerPreviewProps {
  title: string;
  subheading: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  designConfig?: DesignConfig;
  timerType?: "product" | "top-bottom-bar";
  buttonText?: string;
}

export default function TimerPreview({
  title,
  subheading,
  daysLabel = "Days",
  hoursLabel = "Hrs",
  minutesLabel = "Mins",
  secondsLabel = "Secs",
  designConfig = {},
  timerType = "product",
  buttonText = "Shop now!",
}: TimerPreviewProps) {
  // Extract design config values with defaults
  const {
    backgroundColor = "#ffffff",
    borderRadius = 8,
    borderSize = 0,
    borderColor = "#d1d5db",
    paddingTop = 30,
    paddingBottom = 30,
    titleSize = timerType === "top-bottom-bar" ? 18 : 28,
    titleColor = "#212121",
    subheadingSize = timerType === "top-bottom-bar" ? 14 : 16,
    subheadingColor = "#212121",
    timerSize = timerType === "top-bottom-bar" ? 22 : 40,
    timerColor = "#212121",
    legendSize = timerType === "top-bottom-bar" ? 10 : 14,
    legendColor = "#707070",
    buttonFontSize = 16,
    buttonCornerRadius = 4,
    buttonColor = "#ffffff",
    buttonBackgroundColor = "#202223",
  } = designConfig;

  // Simple CSS (inline) for primary styling
  const cardStyle: React.CSSProperties = {
    backgroundColor,
    borderRadius: `${borderRadius}px`,
    border: borderSize > 0 ? `${borderSize}px solid ${borderColor}` : "none",
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: `${titleSize}px`,
    color: titleColor,
    fontWeight: 600,
    lineHeight: 1.2,
  };

  const subheadingStyle: React.CSSProperties = {
    fontSize: `${subheadingSize}px`,
    color: subheadingColor,
    lineHeight: 1.4,
  };

  const timerDigitStyle: React.CSSProperties = {
    fontSize: `${timerSize}px`,
    color: timerColor,
    fontWeight: 700,
    lineHeight: 1,
  };

  const legendStyle: React.CSSProperties = {
    fontSize: `${legendSize}px`,
    color: legendColor,
    lineHeight: 1.2,
  };

  const buttonStyle: React.CSSProperties = {
    fontSize: `${buttonFontSize}px`,
    color: buttonColor,
    backgroundColor: buttonBackgroundColor,
    borderRadius: `${buttonCornerRadius}px`,
    padding: "12px 24px",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    display: "inline-block",
  };

  if (timerType === "top-bottom-bar") {
    const barTitleStyle: React.CSSProperties = {
      fontSize: `${Math.min(titleSize, 18)}px`,
      color: titleColor,
      fontWeight: 600,
      lineHeight: 1.2,
    };

    return (
      <div
        style={{
          ...cardStyle,
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: `${Math.min(paddingTop, 16)}px`,
          paddingBottom: `${Math.min(paddingBottom, 16)}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
        className="select-none"
      >
        {/* Left side: Title and subheading in one line */}
        <div style={{ ...barTitleStyle, whiteSpace: "nowrap" }}>
          {title || "Hurry up!"} {subheading || "Sale ends in:"}
        </div>

        {/* Right side: Timer and button */}
        <div className={cn("flex items-center gap-3 shrink-0")}>
          {/* Timer - Horizontal layout with colons */}
          <div className={cn("flex items-start gap-1 shrink-0")}>
            <div style={{ textAlign: "center" }}>
              <div style={timerDigitStyle}>00</div>
              <div style={{ ...legendStyle, marginTop: "2px" }}>
                {daysLabel}
              </div>
            </div>
            <div style={{ ...timerDigitStyle, lineHeight: `${timerSize}px` }}>
              :
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={timerDigitStyle}>23</div>
              <div style={{ ...legendStyle, marginTop: "2px" }}>
                {hoursLabel}
              </div>
            </div>
            <div style={{ ...timerDigitStyle, lineHeight: `${timerSize}px` }}>
              :
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={timerDigitStyle}>59</div>
              <div style={{ ...legendStyle, marginTop: "2px" }}>
                {minutesLabel}
              </div>
            </div>
            <div style={{ ...timerDigitStyle, lineHeight: `${timerSize}px` }}>
              :
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={timerDigitStyle}>13</div>
              <div style={{ ...legendStyle, marginTop: "2px" }}>
                {secondsLabel}
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            style={{
              ...buttonStyle,
              padding: "8px 16px",
              fontSize: `${Math.min(buttonFontSize, 14)}px`,
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle} className={cn("sticky select-none")}>
      <div className="flex items-center flex-col gap-0.5">
        <div style={{ ...titleStyle, textAlign: "center" }}>
          {title || "Hurry up!"}
        </div>
        <div style={{ ...subheadingStyle, textAlign: "center" }}>
          {subheading || "Sale ends in:"}
        </div>
        <div className={cn("flex items-center gap-1 justify-center")}>
          <div style={{ textAlign: "center" }}>
            <div style={timerDigitStyle}>00</div>
            <div style={{ ...legendStyle, marginTop: "4px" }}>{daysLabel}</div>
          </div>
          <div style={timerDigitStyle} className={cn("-translate-y-3.5")}>
            :
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={timerDigitStyle}>23</div>
            <div style={{ ...legendStyle, marginTop: "4px" }}>{hoursLabel}</div>
          </div>
          <div style={timerDigitStyle} className={cn("-translate-y-3.5")}>
            :
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={timerDigitStyle}>59</div>
            <div style={{ ...legendStyle, marginTop: "4px" }}>
              {minutesLabel}
            </div>
          </div>
          <div style={timerDigitStyle} className={cn("-translate-y-3.5")}>
            :
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={timerDigitStyle}>53</div>
            <div style={{ ...legendStyle, marginTop: "4px" }}>
              {secondsLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
