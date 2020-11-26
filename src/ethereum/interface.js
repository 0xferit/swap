import web3 from "./web3";

import DemoToken from "../truffle/build/contracts/DemoToken.json";
import SimpleBondingCurve from "../truffle/build/contracts/SimpleBondingCurve.json";

const tokenAddress = "0x38EfCFb8d84B9970d344fdB4023F2E94941e3026";
const address = "0xa3f27ae78A327C2608045C7e5b84703de1a8cE99";

const imports = {
  DemoToken,
  SimpleBondingCurve
};

const addresses = {
  DemoToken: "0x38EfCFb8d84B9970d344fdB4023F2E94941e3026",
  SimpleBondingCurve: "0xa3f27ae78A327C2608045C7e5b84703de1a8cE99"
};

export const etherBalance = wallet => web3.eth.getBalance(wallet);

export const contractInstance = interfaceName =>
  new web3.eth.Contract(imports[interfaceName].abi, addresses[interfaceName]);

export const call = (interfaceName, method, ...args) =>
  contractInstance(interfaceName)
    .methods[method](...args)
    .call();

export const send = (interfaceName, from, value, method, ...args) =>
  contractInstance(interfaceName)
    .methods[method](...args)
    .send({ from, value });
