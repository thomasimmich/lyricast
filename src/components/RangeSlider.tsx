import React from "react";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  formatValue?: (value: number) => string;
}

const RangeSlider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  formatValue,
  ...rest
}) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const formattedValue = formatValue
    ? formatValue(Number(numericValue))
    : numericValue;

  return (
    <div style={{ position: "relative", width: "100%", padding: "20px 0" }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        {...rest}
        style={{
          width: "100%",
          appearance: "none",
          background: "transparent",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${(
            ((Number(numericValue) - Number(min)) /
              (Number(max) - Number(min))) *
            100
          ).toFixed(2)}%`,
          transform: "translateX(-50%)",
          marginTop: "-30px",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {formattedValue}
      </div>
    </div>
  );
};

export default RangeSlider;
