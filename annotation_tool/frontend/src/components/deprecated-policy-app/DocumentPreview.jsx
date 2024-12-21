import React, { useState } from "react";
import Logger from "src/Logger";
const log = Logger("policy-admin", "blue");

function PreviewSentence(content, i = 0) {
  const out = [];
  let plain,
    bold,
    cur = content;
  while (true) {
    [plain, bold, cur] = cur.split(/__(.+?)__/);
    if (plain != "") out.push(plain);
    if (!cur) break;
    out.push(<b>{bold}</b>);
  }
  return out.map((s, j) => (
    <span key={`${i}-${j}`} className="sentence">
      {s}{" "}
    </span>
  ));
}

function ParagraphPreview({ content, level, type }, sectionCounter) {
  switch (type) {
    case "section":
      if (!sectionCounter[level]) sectionCounter[level] = 0;
      for (let _i = level + 1; _i < sectionCounter.length; _i++) sectionCounter[_i] = 0;
      sectionCounter[level] += 1;
      return (
        <div className="preview-section">
          {`§${sectionCounter.slice(1, level + 1).join(".")}`} {content.map(PreviewSentence)}
        </div>
      );
    case "text":
      return <div className="preview-text">{content.map(PreviewSentence)}</div>;
    case "list":
      return (
        <div className="preview-list">
          {content.map(({ bullet, content, depth }, i) => (
            <div key={i} className="preview-list-item">
              <div
                className="bullet"
                style={{ maxWidth: `${depth + 1}em`, minWidth: `${depth + 1}em` }}
              >
                {bullet}
              </div>
              <div className="content">{content.map(PreviewSentence)}</div>
            </div>
          ))}
        </div>
      );
    default:
      return <div> ERROR </div>
      break;
  }
}

export default function DocumentPreview({ title, ordinal, content }) {
  const [expanded, setExpanded] = useState(false);
  const sectionCounter = [];
  return (
    <div className="policy-doc-preview">
      <h3 className="doc-preview-title" onClick={() => setExpanded(!expanded)}>
        {title}
      </h3>
      {expanded ? (
        <div className="policy-doc-preview-content">
          {content.map((p, i) => (
            <div className="doc-preview-paragraph" key={i}>
              <div className="paragraph-num">{i + 1}</div>
              {ParagraphPreview(p, sectionCounter)}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
