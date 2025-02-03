import React, { Component } from "react";
import Heading from "src/components/widgets/Heading";
import { connect } from "react-redux";
import mapStateToProps from "src/components/utils/mapStateToProps";

const ErrorItem = ({ err }) => {
  const url = err.error?.response?.config?.url;
  const data = err.error?.response?.config?.data;
  const message = err.error?.message;
  const statusText = err.error?.response?.statusText;
  const statusCode = err.error?.status;
  return <div className='error-item'>
    <div className='error-item-overview'>
      <div className='error-field'>{err.actionType}</div>
      {(statusCode || statusText) && <div className='error-field'>{statusCode} {statusText}</div>}
    </div>
    <div className='error-item-details'>
      <div className='error-field'>
        {url && <div>{url}</div>}
        {message && <div>{message}</div>}
        {<div><pre>data: {JSON.stringify(data || {}, null, 2)}</pre></div>}
      </div>
    </div>
  </div>
}

class Loading extends Component {
  render() {
    const { errors: { active_call_ids = {}, errors = [] } } = this.props;
    if (!document.readyState == "complete") {
      return (
        <div id="loading-page" className="page-root">
          <Heading title="loading..." />
          <div id="loading-spinner">loading...</div>
        </div>
      );
    }
    if (Object.keys(active_call_ids).length > 0) {
      return (
        <div id="loading-page" className="page-root">
          <Heading title="loading..." />
          <div id="loading-spinner">
            <h1>loading...</h1>
            <div> <ul>
              {Object.keys(active_call_ids).map((call_id, i) => {
                const active_call = active_call_ids[call_id];
                const time_elapsed = ((active_call.end_time || new Date().getTime()) - active_call.start_time) / 1000;
                const status = active_call.status;
                return <li key={i}>{active_call.task_name} [{status}]</li>
              })}
            </ul>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div id="error-page" className="page-root card-app-root">
        <Heading title="(error)" />
        <div className="card-app-content">
          <div id="error-headline">No data loaded.</div>
          <div id="error-list">
            <div>Review Recent Errors:</div>
            {errors && errors?.map((err, i) => (
              <ErrorItem key={i} err={err} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}


export default connect(mapStateToProps)(Loading);
