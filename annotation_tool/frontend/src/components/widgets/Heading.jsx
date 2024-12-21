import React from "react";
import { PROJECT_NAME } from "src/constants";
export default function Heading({ coder_email, title }) {
  const home_url = document.location.pathname.startsWith("/c/") ? `/c/${PROJECT_NAME}/` : '/';
  return (
    <div id="title">
      <div>
        <h1> {title} </h1>
      </div>
      <div>
        <a href="..">back</a>
        <a href={`${home_url}`}>home</a>
        <a href="/accounts/logout">logout</a>
      </div>
    </div>
  );
}
