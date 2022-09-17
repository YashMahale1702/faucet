// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner can call this function");
        _;
    }

    // Test functions for owner
    function test1Owner() external onlyOwner {
        // Only owner can access
    }

    function changeOwner(address newOwner) external {
        owner = newOwner;
    }
}
