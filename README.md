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

1. Truffle directory under `src/truffle/`. `yarn && yarn test` command compiles and tests contracts.

2. Root directory contains the react app. `yarn && yarn start` starts it. Switch over to kovan network to use it.

Or a one liner: `cd src/truffle/ && yarn && yarn compile && cd ../../ && yarn && yarn start`

