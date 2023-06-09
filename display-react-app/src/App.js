import React, { useState, useEffect } from "react";
import "./App.css";

const CONVERSION_FACTOR = 53421;

function App() {
  const [weight, setWeight] = useState(null);
  const [tareOffset, setTareOffset] = useState(1076100);
  const [convertedWeight, setConvertedWeight] = useState({
    pounds: 0,
    ounces: 0,
  });
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const weightInPounds = (weight - tareOffset) / CONVERSION_FACTOR;
    const wholePounds = Math.floor(weightInPounds);
    const ounces = Math.round((weightInPounds - wholePounds) * 16);

    setConvertedWeight({
      pounds: wholePounds,
      ounces: ounces,
    });
  }, [weight, tareOffset]);

  useEffect(() => {
    const websocket = new WebSocket("ws://192.168.1.21:8080");

    websocket.onopen = () => {
      console.log("Secure WebSocket Client Connected");
    };

    websocket.onmessage = (message) => {
      console.log("Received: " + message.data);
      setWeight(message.data);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  function handleTareScale(e) {
    setTareOffset(weight);
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Kidcal</h1>
      <div className="weight-display">
        {weight ? (
          <p>
            <span className="weight-value">
              {convertedWeight.pounds} lbs {convertedWeight.ounces} oz
            </span>
          </p>
        ) : (
          <p>No data yet...</p>
        )}
      </div>
      <button className="tare-button" onClick={handleTareScale}>
        Tare
      </button>
    </div>
  );
}

export default App;
