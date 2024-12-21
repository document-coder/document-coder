import React from "react";
import { randomColor } from "src/components/utils/displayUtils";

export default function PartBar({ category_pairs }) {
  return (
    <div className="part-bar">
      {_.sortBy(category_pairs, ([k, v]) => -parseFloat(v)).map(([label, percentage]) => {
        return (
          <div
            key={label}
            className={`part-bar-item`}
            style={{ width: percentage, backgroundColor: randomColor(label, 40, 50) }}
          >
            <div className="part-bar-label">{label}</div>
            <div
              className="part-bar-hover"
              style={{
                color: randomColor(label, 50, 30),
                backgroundColor: randomColor(label, 50, 80),
              }}
            >
              {label}: {percentage}
            </div>
          </div>
        );
      })}
    </div>
  );
}
