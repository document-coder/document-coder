import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";

class PersonalProgress extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetCodingProgress();
  }

  render() {
    if (!this.props.codingProgress) return <div>loading....</div>;
    const coder_email = CURRENT_USER;
    return (
      <div className="container">
        <div className="home-progress-view">
          <h1> Recent Coding </h1>
          <div id="home-progress-view-table">
            <table>
              <thead>
                <tr>
                  <th> Policy (link) </th>
                  <th> questions answered </th>
                </tr>
              </thead>
              <tbody>
                {_.map(this.props.codingProgress, (e, i) => {
                  if (_.sumBy(e.coding_instances, (ci) => coder_email == ci.email)) {
                    return (
                      <tr key={i}>
                        <td>
                          <a href={`/code-policy/${e.policy_instance_id}`}>{e.company_name}</a>
                        </td>
                        <td>
                          {_.map(e.coding_instances, (ci, i) => (
                            <div className="home-progress-view-coding-instance" key={i}>
                              <div className="home-progress-view-coder-email">
                                {ci.name} ({ci.email})
                              </div>
                              <div className="home-progress-view-coder-count">
                                {" "}
                                {ci.response_count} / {ci.target_count}
                              </div>
                              <div className="home-progress-view-coder-date">
                                started {ci.created.substr(5, 5)}
                              </div>
                              {ci.target_count - ci.response_count > 0 &&
                              ci.email == CURRENT_USER ? (
                                <div style={{ color: "red" }}>
                                  <b>{ci.target_count - ci.response_count}</b> UNANSWERED QUESTION
                                  {ci.target_count - ci.response_count > 1 ? "S" : ""}!
                                </div>
                              ) : (
                                <span> </span>
                              )}
                            </div>
                          ))}
                        </td>
                      </tr>
                    );
                  } else {
                    return;
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalProgress);
