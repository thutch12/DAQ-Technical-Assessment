import "./App.css";

interface TemperatureProps {
  temp: number;
}

function LiveValue({ temp }: TemperatureProps) {
  let valueColour = "white";

  if (temp >= 20 && temp <= 80) {
    valueColour = "green";
  }
  if ((temp >= 75 && temp <= 80) || (temp >= 20 && temp <= 25)) {
    valueColour = "yellow";
  }
  if (temp > 80 || temp < 20) {
    valueColour = "red";
  }

  return (
    <header className="live-value" style={{ color: valueColour }}>
      {`${temp.toPrecision(3)}°C`}
    </header>
  );
}

export default LiveValue;
