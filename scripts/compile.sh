#!/usr/bin/env bash
solc --bin --abi --overwrite -o ./build/contracts contracts/Counter.sol && cp build/contracts/Counter.abi src/contracts/Counter.abi.json