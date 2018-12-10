import React from 'react';
import Web3 from 'web3';
import fs from 'fs';
import { expect } from 'chai';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Counter from './Counter';
import CounterContract from '../contracts/Counter';

configure({ adapter: new Adapter() });

describe('<Counter />', function() {
  let klazz,
      contract,
      wrapper;

  beforeAll(async function() {
    const web3 = new Web3('ws://localhost:9545');
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
    const data = '0x' + fs.readFileSync('./build/contracts/Counter.bin');
    klazz = CounterContract(web3, null, { from, data });
  });

  beforeEach(async function() {
    contract = await klazz.deploy().send({ gas: 1000000 });
    await contract.methods.increase().send();
  });

  beforeEach(async function() {
    wrapper = await mount(<Counter contract={contract} />);
  })

  it('renders a loading indicator', async function() {
    expect(wrapper.text()).to.include("Loading");
  });

  it('renders initial value', async function() {
    await wrapper.instance().componentDidMount();
    expect(wrapper.text()).to.include("Value: 1");
  });

  it('renders externally updated value', async function() {
    await wrapper.instance().componentDidMount();
    await contract.methods.increase().send();
    expect(wrapper.text()).to.include("Value: 2");
  });

  it('disables button when sending tx', async function() {
    await wrapper.instance().componentDidMount();
    wrapper.update();
    wrapper.find('button').first().simulate('click');
    wrapper.update();
    expect(wrapper.find('button').prop('disabled')).to.be.true;
  });

  it('sends a tx to the contract', async function() {
    await wrapper.instance().componentDidMount();
    await wrapper.instance().increaseCounter();
    const value = await contract.methods.value().call();
    expect(value.toString()).to.eq("2");
  });
});