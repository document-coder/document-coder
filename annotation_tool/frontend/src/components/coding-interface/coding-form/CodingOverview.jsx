import React, { Component } from "react";
import { connect } from "react-redux";
import mapStateToProps from "src/components/utils/mapStateToProps";
import { CURRENT_USER } from "src/constants";

export default connect(
  mapStateToProps,
  {}
)(
  class CodingOverview extends Component {
    render() {
      if (!true) {
        return <div />;
      }
      return (
        <div className="coding-form-overview">
          <h1> Coding </h1>
          <div>
            Coding will be attributed to <b>{CURRENT_USER}</b>
          </div>
          <div>
            This form will auto-save. You can also press <code>ctrl+s</code> (windows),
            <code>⌘+s</code>
            (mac), or hit the "save" button at the bottom of this form.
          </div>
        </div>
      );
    }
  }
);
