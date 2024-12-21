import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapStateToProps from "src/components/utils/mapStateToProps";
import SortableTable from "src/components/widgets/SortableTable";

/**
 * @param {object} params
 * @param {Policy[]} params.policies
 * @returns
 */
class PolicyList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      policies,
      model: { project_settings },
      project_prefix,
    } = this.props;
    const _COLUMNS = [
      {
        name: "view details",
        display_fn: (policy) => <a href={`/c/${project_prefix}/policy/${policy.id}`}>link</a>,
        sort_fn: (policy) => policy.id,
      },
      {
        name: "name",
        display_fn: (policy) => `${policy.company_name}`,
        sort_fn: (policy) => policy.company_name,
      },
      {
        name: "short name",
        display_fn: (policy) => `${policy.name}`,
        sort_fn: (policy) => policy.name,
      },
      {
        name: "policy snapshot taken",
        display_fn: (policy) => `TODO`,
        sort_fn: (policy) => 1,
      },
      {
        name: "coding progress",
        display_fn: (policy) => `TODO`,
        sort_fn: (policy) => 1,
      },
      {
        name: "review progress",
        display_fn: (policy) => `TODO`,
        sort_fn: (policy) => 1,
      },
    ];

    return (
      <div id="policies-table-container">
        <h1> Document List </h1>
        <div id="policies-table-subcontainer">
          <SortableTable id="policies-list-table" items={_.values(policies)} columns={_COLUMNS} />
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, {})(PolicyList);
