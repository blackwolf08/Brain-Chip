import React, { Component } from 'react';
import Matrix from './brainchip.js/Matrix';
import TeamClassifier from './brainchip.js/TeamClassifier';

export default class App extends Component {
  componentDidMount() {
    let m = new Matrix(3, 2);
    console.table(m.matrix);
  }

  render() {
    return (
      <div>
        <TeamClassifier />
      </div>
    );
  }
}
