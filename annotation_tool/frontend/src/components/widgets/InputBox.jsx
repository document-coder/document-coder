import React from "react";

/**
 *
 * @param {Object} params
 * @param {?string} params.label
 * @param {?string} params.placeholder
 * @param {?string} params.value
 * @param {(string)=>any} params.callback - will be called anytime the value changes
 * @returns
 */
export default function InputBox({
  area = false,
  label,
  placeholder = "",
  value = "",
  callback = (value) => {},
  className = "",
}) {
  const input = area ? (
    <textarea value={value} placeholder={placeholder} onChange={(event) => callback(event.target.value)}></textarea>
  ) : (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => callback(event.target.value)}
    ></input>
  );
  if (label)
    return (
      <div className={`input-box ${className}`}>
        <div className="input-label">{label}</div>
        {input}
      </div>
    );
  else return <div className={`input-box ${className}`}>{input}</div>;
}
