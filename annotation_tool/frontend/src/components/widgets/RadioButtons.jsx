import { React, useState } from "react";

const RadioButtons = ({ options, selected, callback }) => {
  return (
    <div className="radio-buttons">
      {options.map((option) => (
        <label key={option.value} className={selected === option.value ? "checked" : "unchecked"}>
          <input
            type="radio"
            value={option.value}
            checked={selected === option.value}
            onChange={(e) => callback(e.target.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

export default RadioButtons;