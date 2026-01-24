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
    titleSize = 28,
    titleColor = "#212121",
    subheadingSize = 16,
    subheadingColor = "#212121",
    timerSize = 40,
    timerColor = "#212121",
    legendSize = 14,
    legendColor = "#707070",
    buttonFontSize = 16,
    buttonCornerRadius = 4,
    buttonColor = "#ffffff",
    buttonBackgroundColor = "#5c6ac4",
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
    return (
      <div
        style={{
          ...cardStyle,
          // Use inline CSS for spacing/box
          paddingLeft: "24px",
          paddingRight: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
        className="select-none"
      >
        <div style={{ flex: 1 }}>
          <div style={titleStyle}>{title || "Hurry up!"}</div>
          <div style={{ ...subheadingStyle, marginTop: "4px" }}>
            {subheading || "Sale ends in:"}
          </div>
        </div>
        <div
          className={cn("flex items-center gap-2 shrink-0")}
          // layout by Tailwind, content styles inline
        >
          <div style={{ textAlign: "center" }}>
            <div style={timerDigitStyle}>00</div>
            <div style={{ ...legendStyle, marginTop: "2px" }}>{daysLabel}</div>
          </div>
          <div style={timerDigitStyle} className={cn("-translate-y-3.5")}>
            :
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={timerDigitStyle}>23</div>
            <div style={{ ...legendStyle, marginTop: "2px" }}>{hoursLabel}</div>
          </div>
          <div style={timerDigitStyle} className={cn("-translate-y-3.5")}>
            :
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={timerDigitStyle}>59</div>
            <div style={{ ...legendStyle, marginTop: "2px" }}>
              {minutesLabel}
            </div>
          </div>
          <div style={timerDigitStyle} className={cn("-translate-y-3.5")}>
            :
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={timerDigitStyle}>53</div>
            <div style={{ ...legendStyle, marginTop: "2px" }}>
              {secondsLabel}
            </div>
          </div>
        </div>
        <button style={buttonStyle}>{buttonText}</button>
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
