// src/components/Calculator.jsx
import { useState } from "react";
import "./Calculator.css";

export default function Calculator() {
  const [display, setDisplay] = useState("0");

  const append = (val) => {
    setDisplay((prev) =>
      prev === "0" && val !== "." ? String(val) : prev + String(val)
    );
  };

  const clear = () => setDisplay("0");

  const backspace = () =>
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));

  const calculate = () => {
    try {
      /* eval は簡単ですが本番では数式パーサを推奨 */
      // eslint-disable-next-line no-eval
      const result = eval(display);
      setDisplay(String(result));
    } catch {
      setDisplay("Error");
    }
  };

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
  ];

  return (
    <div className="calc">
      <input className="calc-screen" value={display} readOnly />
      <div className="calc-buttons">
        <button onClick={clear} className="span-2 danger">
          AC
        </button>
        <button onClick={backspace}>⌫</button>
        {buttons.map((b) =>
          b === "=" ? (
            <button key={b} onClick={calculate} className="primary">
              {b}
            </button>
          ) : (
            <button key={b} onClick={() => append(b)}>
              {b}
            </button>
          )
        )}
      </div>
    </div>
  );
}
