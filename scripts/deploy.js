const Web3 = require('web3');
const fs = require('fs');

function getWeb3() {
  const providerURL = process.env.PROVIDER_URL || 'http://localhost:8545';
  return new Web3(providerURL);
}

async function getSender(web3) {
  return process.env.FROM || (await web3.eth.getAccounts())[0];
}

function getCounterContract(web3) {
  const abi = JSON.parse(fs.readFileSync('./build/contracts/Counter.abi'));
  const data = '0x' + fs.readFileSync('./build/contracts/Counter.bin');
  return new web3.eth.Contract(abi, null, { data });
}

function saveAddress(address) {
  fs.appendFileSync('.env', `\nREACT_APP_COUNTER_ADDRESS=${address}\n`);
}

async function main() {
  const web3 = getWeb3();
  const from = await getSender(web3);
  const Counter = getCounterContract(web3);
  const counter = await Counter.deploy().send({ from, gas: 1000000 });
  const address = counter.options.address;
  console.log(`Counter contract deployed at ${address}`);
  saveAddress(address);
}

main();