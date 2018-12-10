import abi from './Counter.abi.json';
import { getWeb3, getAccount } from '../eth/network.js';

export default function Counter(web3, address = null, options = {}) {
  return new web3.eth.Contract(abi, address, options);
}

export async function getDeployed() {
  const web3 = getWeb3();
  const from = await getAccount();
  const address = process.env.REACT_APP_COUNTER_ADDRESS;
  return Counter(web3, address, { from });
}