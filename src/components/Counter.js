import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      value: null, 
      subscription: null,
      increasing: false
    };

    this.increaseCounter = this.increaseCounter.bind(this);
    this.connectCounter = this.connectCounter.bind(this);
  }

  async connectCounter() {
    const counter = this.props.contract;
      
    const initialValue = await counter.methods.value().call();
    this.setState({ value: initialValue });

    const increasedEvent = counter.events.Increased();
    const subscription = increasedEvent
      .on('data', (event) => {
        const value = event.returnValues.newValue;
        this.setState({ value });
      })
    this.setState({ subscription });
  }

  increaseCounter() {
    const counter  = this.props.contract;
    this.setState({ increasing: true, error: null });
    counter.methods.increase().send()
      .on('receipt', () => this.setState({ increasing: false }))
      .on('error', (error) => this.setState({ increasing: false, error }));
  }

  componentDidMount() {
    this.connectCounter();
  }

  componentWillUnmount() {
    const { subscription } = this.state;
    if (subscription) subscription.unsubscribe();
  }

  render() {
    const { value, increasing, error } = this.state;
    if (!value) return "Loading";

    return (
      <div>
        <div>Value: { value.toString() }</div>
        <button disabled={!!increasing} onClick={this.increaseCounter}>Increase</button>
        <div>{ error }</div>
      </div>
    );
  }
}

export default Counter;