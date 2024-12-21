import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import { CURRENT_USER } from "src/constants";

import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import SortableTable from "src/components/widgets/SortableTable";

function get_all_answers(coding, coding_instances) {
  return {};
}

class PolicyApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetPolicies();
  }
  render() {
    return (
      <div id="data-explorer" className="page-root">
        <Heading title={`Data Explorer`} />
        <div id="main-menu">
          <div className="menu-block">
            (This part of the app is being rebuilt to be more usable. Please check back soon.)
          </div>
        </div>
      </div>
    )
  }
}
export default withParams(connect(mapStateToProps, mapDispatchToProps)(PolicyApp));
