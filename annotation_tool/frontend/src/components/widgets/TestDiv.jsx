import React, { Component } from 'react';

export default class extends Component {
  render() {
    return (
      <div> test div content:
        <pre>{this.props.children}</pre>
      </div>
    );
  }
}
