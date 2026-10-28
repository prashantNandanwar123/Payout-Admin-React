import { useEffect } from "react";
import "../assets/css/ToggleSwitch.css";

const ToggleSwitch = ({ status, setChecked, handleToggle, checked }) => {

  return (
    <div
      className={`toggle-btn ${checked ? "active" : ""}`}
      onClick={handleToggle}
    >
      <input
        type="checkbox"
        className="cb-value"
        checked={checked}
        onChange={() => {}}
      />
      <span className="round-btn"></span>
    </div>
  );
};

export default ToggleSwitch;
