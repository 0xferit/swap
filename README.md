# Swap

A minimal automated market maker, using the simplest possible implementation of bonding curve with no fees. It has two main functions: `mint` and `redeem`.

This repo contains the smart contracts and a react web applications to demonstrate the functionality.

## Tools
- Truffle Suite
- Create React App
- Bootstrap
- Web3.js
- Mocha 

## How to run

Root directory contains the react app. `yarn start` starts it. Switch over to kovan network to use it.

Truffle directory under `src/truffle/`. `cd src/truffle && yarn test` command compiles and tests contracts.
