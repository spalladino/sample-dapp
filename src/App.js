import React, { Component } from 'react';
import './App.css';
import Counter from './components/Counter';
import { getDeployed } from './contracts/Counter';

class App extends Component {
  state = {
    counter: null
  }

  componentDidMount() {
    getDeployed().then(counter => this.setState({ counter }));
  }

  render() {
    const { counter } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          { counter && 
            <Counter contract={counter} />
          }
        </header>
      </div>
    );
  }
}

export default App;
