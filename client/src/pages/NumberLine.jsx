// src/pages/NumberLinePage.jsx
import React, { useState } from "react";

function NumberLinePage() {
  const [value, setValue] = useState(0);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Number Line Feature</h1>
      <p>Current value: {value}</p>

      {/* Simple number input */}
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ padding: "0.5rem", fontSize: "1rem", width: "5rem" }}
      />
      
      <div style={{ marginTop: "2rem" }}>
        {/* Example number line */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
          {[...Array(11).keys()].map((num) => (
            <div
              key={num}
              style={{
                width: 30,
                height: 30,
                lineHeight: "30px",
                borderRadius: "50%",
                backgroundColor: num === value ? "dodgerblue" : "lightgray",
                color: num === value ? "white" : "black",
                cursor: "pointer",
              }}
              onClick={() => setValue(num)}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NumberLinePage;
