import React from "react";

function add_b(text) {
  return text
    .split(/__(.+?)__/)
    .map((s, key) => (key % 2 ? <b key={key}>{add_u(s)}</b> : add_u(s)));
}
function add_u(text) {
  return text
    .split(/\[(.+?)\]/)
    .map((s, key) =>
      key % 2 ? (key + 3) % 4 ? `[${add_i(s)}]` : <u key={key}>{add_i(s)}</u> : add_i(s)
    );
}
function add_i(text) {
  return text.split(/_(.+?)_/).map((s, key) => (key % 2 ? <i key={key}>{s}</i> : s));
}
export default function MarkdownedText({ text }) {
  return add_b(text);
}
