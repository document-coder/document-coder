import React, { Component } from "react";
import Heading from "src/components/widgets/Heading";

export default class Loading extends Component {
  render() {
    return (
      <div id="loading-page" className="page-root">
        <Heading title="loading..." />
        {document.readyState == "complete" ? "No data loaded! There may have been an error." : "Loading..."}
      </div>
    );
  }
}
