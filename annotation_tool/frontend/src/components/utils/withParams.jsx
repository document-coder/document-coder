import React, { Component } from "react";
import { useParams } from "react-router-dom";

export default function withParams(MyElement) {
  return (props) => {
    const match = {
      params: useParams(),
    }
    if (props.mode) {
      match.params.mode = props.mode;
    }
    if (match.params._policy_instance_info) {
      if (match.params._policy_instance_info.startsWith('policy-')) {
        match.params.policy_instance_id = match.params._policy_instance_info.slice(6)
      } else {
        const [policy_instance_id, policy_name] = match.params._policy_instance_info.split('-')
        match.params.policy_instance_id = policy_instance_id
        match.params.policy_name = policy_name
      }
    }
    if (match.params._coding_info) {
      if (match.params._coding_info.startsWith('coding-')) {
        match.params.coding_id = match.params._coding_info.slice(6);
      } else {
        match.params.coding_id = match.params._coding_info.split('-')[0];
      }
    }
    return <MyElement match={match} {...props} />
  }
}
