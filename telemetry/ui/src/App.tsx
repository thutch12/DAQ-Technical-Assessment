import { useState, useEffect, createContext, useContext } from "react";
import LiveValue from "./live_value";
import RedbackLogo from "./redback_logo.jpg";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://localhost:8080";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

// for dark and light mode
const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

function App() {
  const [temperature, setTemperature] = useState<number>(0);
  const {
    lastJsonMessage,
    readyState,
  }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } =
    useWebSocket(WS_URL, {
      share: false,
      shouldReconnect: () => true,
    });

  const { theme, toggleTheme } = useTheme();

  // Apply theme to body class
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service");
        break;
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service");
        break;
      default:
        break;
    }
  }, [readyState]);

  useEffect(() => {
    console.log("Received: ", lastJsonMessage);
    if (lastJsonMessage === null) {
      return;
    }
    setTemperature(lastJsonMessage["battery_temperature"]);
  }, [lastJsonMessage]);

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={RedbackLogo}
          className="redback-logo"
          alt="Redback Racing Logo"
        />
        <p className="value-title">Live Battery Temperature</p>
        <LiveValue temp={temperature} />
        <button onClick={toggleTheme}>
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </header>
    </div>
  );
}

export default App;
export { ThemeProvider }
