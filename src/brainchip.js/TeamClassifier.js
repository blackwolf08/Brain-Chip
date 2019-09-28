import { range } from 'ramda';
import React, { Component } from 'react';

class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class TeamClassifier {
  high = 300;
  low = 0;

  randomPoints = range(0, 100).map(_ => {
    let x = Math.random() * (this.high - this.low) + this.low;
    let y = Math.random() * (this.high - this.low) + this.low;
    return new Circle(x, y);
  });

  weights = {
    x: Math.random(),
    y: Math.random() * -1
  };

  error = null;

  actual_team = point => {
    return point.x > point.y ? 1 : -1;
  };

  newPoints = () => {
    this.randomPoints = range(0, 100).map(_ => {
      let x = Math.random() * (this.high - this.low) + this.low;
      let y = Math.random() * (this.high - this.low) + this.low;
      return new Circle(x, y);
    });
  };

  train = () => {
    this.randomPoints.map(point => {
      const guessResult = this.guess(point);
      const error = this.actual_team(point) - guessResult;

      this.error = error;

      this.weights = {
        x: this.weights.x + point.x * error,
        y: this.weights.y + point.y * error
      };
    });
  };

  sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {}
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  trainSlow = update => {
    this.randomPoints.map(async point => {
      await this.sleep(500);
      const guessResult = this.guess(point);
      const error = this.actual_team(point) - guessResult;

      this.error = error;

      this.weights = {
        x: this.weights.x + point.x * error,
        y: this.weights.y + point.y * error
      };
      update();
    });
  };

  guess = point => {
    if (!point) {
      point = {
        x: 220,
        y: 300
      };
    }
    const weights = {
      x: this.weights.x,
      y: this.weights.y
    };
    const sum = point.x * weights.x + point.y * weights.y;
    const team = sum > 0 ? 1 : -1;
    return team;
  };
}

export default class TeamClassifierView extends Component {
  tc = new TeamClassifier();
  X_MAX = 300;
  Y_MAX = 300;

  state = {
    change: null
  };

  handleTrain = event => {
    this.tc.train();
    this.forceUpdate();
  };
  handleTrainSlow = event => {
    const update = () => {
      this.setState({
        change: 'change'
      });
      setInterval(() => {
        this.setState({
          change: null
        });
      }, 490);
    };
    this.tc.trainSlow(update);
  };

  handleNewPoints = event => {
    this.tc.newPoints();
    this.forceUpdate();
  };

  render() {
    return (
      <div className='tc-root'>
        <svg className='tc-svg' height={this.X_MAX} width={this.Y_MAX}>
          {this.tc.randomPoints.map((point, idx) => (
            <circle
              key={idx}
              cx={point.x}
              cy={point.y}
              r='3'
              fill={this.tc.guess(point) === 1 ? 'red' : 'blue'}
            />
          ))}
          <line x1='0' x2='300' y1='0' y2='300' stroke='#999' />
        </svg>
        <p>NOTE: Train till weights become almost like X == Y</p>
        <button className='tc-button' onClick={this.handleTrain}>
          Train
        </button>
        <button className='tc-button' onClick={this.handleNewPoints}>
          Random points with current weights
        </button>
        <button className='tc-button' onClick={this.handleTrainSlow}>
          See visual training of weights
        </button>
        <div>
          <h4>Weights</h4>
          <p className={this.state.change}>X : {this.tc.weights.x}</p>
          <p className={this.state.change}>Y : {this.tc.weights.y}</p>
          <p>Last Error : {this.tc.error}</p>
        </div>
      </div>
    );
  }
}
