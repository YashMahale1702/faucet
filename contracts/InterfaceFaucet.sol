// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// Interface
// Cannot have state/storage variables
// Cannot have constructor
// Always declare external
// Similar to Abstarct contract but cannot inherit from other smart contracts

interface InterfaceFaucet {
    function addFunds() external payable;

    function withdraw(uint256 withdrawAmount) external;
}
