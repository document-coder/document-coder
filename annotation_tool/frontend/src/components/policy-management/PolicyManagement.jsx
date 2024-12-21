import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import PolicyList from "src/components/policy-management/PolicyList";

/////// MAIN APP
class PolicyManagementApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetPolicies();
    this.props.apiGetPolicyInstancesMeta();

    this.handleCreatePolicy = this.handleCreatePolicy.bind(this);
    this.handleCreatePolicyInstance = this.handleCreatePolicyInstance.bind(this);
    this.handleUploadDocument = this.handleUploadDocument.bind(this);
  }

  async handleCreatePolicy(policyData) {
    try {
      await this.props.apiPostPolicy(policyData);
      await this.props.apiGetPolicies();
    } catch (error) {
      console.error("Failed to create policy:", error);
      throw error;
    }
  }

  async handleCreatePolicyInstance(policyId, scan_dt) {
    try {
      await this.props.apiPostPolicyInstance({ policy_id: policyId, scan_dt });
      await this.props.apiGetPolicyAssociatedData(policyId);
    } catch (error) {
      console.error("Failed to create policy instance:", error);
      throw error;
    }
  }

  async handleUploadDocument(policyInstanceId, title, doc_content) {
    try {
      const newDocument = {
        title,
        content: doc_content,
      };
      const policy_instance = this.props.model.policy_instances[policyInstanceId];
      const content = policy_instance.content || [];
      // ordinal is next letter in alphabet or 'A' if no documents
      const cur_max_ordinal = content.reduce((max, doc) => {
        const ord = doc.ordinal.charCodeAt(0);
        return ord > max ? ord : max;
      }, "A".charCodeAt(0));
      newDocument.ordinal = String.fromCharCode(cur_max_ordinal + 1);
      content.push(newDocument);
      await this.props.apiPostPolicyInstance({
        id: policyInstanceId,
        content
      });
      await this.props.apiGetPolicyInstance(policyInstanceId);
    } catch (error) {
      console.error("Failed to upload document:", error);
      throw error;
    }
  }

  async handleModifyDocument(document_index, policyInstanceId, ordinal, title, doc_content) {
    try {
      const newDocument = {
        title,
        content: doc_content,
        ordinal
      };
      const policy_instance = this.props.model.policy_instances[policyInstanceId];
      const content = policy_instance.content || [];
      content[document_index] = newDocument;
      await this.props.apiPostPolicyInstance({
        id: policyInstanceId,
        content
      });
      await this.props.apiGetPolicyInstance(policyInstanceId);
    } catch (error) {
      console.error("Failed to modify document:", error);
      throw error;
    }
  }

  render() {
    const { model: {
      policies,
      policy_instances
    } } = this.props;

    if (policies._unloaded) {
      return <Loading />;
    }

    return (
      <div id="policy-management" className="policy-management page-root card-app-root">
        <Heading title="Document Management" />
        <div className="card-app-content">
          <PolicyList
            policies={policies}
            policy_instances={policy_instances}
            onCreatePolicy={this.handleCreatePolicy}
            onCreateInstance={this.handleCreatePolicyInstance}
            onUploadDocument={this.handleUploadDocument}
          />
        </div>
      </div>
    );
  }
}

export default withParams(
  connect(mapStateToProps, mapDispatchToProps)(PolicyManagementApp)
);
