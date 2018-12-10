import Web3 from 'web3';

let web3;

export function getWeb3() {
  if (!web3) {
    web3 = new Web3(process.env.REACT_APP_PROVIDER_URL || Web3.givenProvider);
  }
  return web3;
}

export function hasProvider() {
  return !!Web3.givenProvider;
}

export async function getAccount() {
  const web3 = getWeb3();
  return (await web3.eth.getAccounts())[0];
}