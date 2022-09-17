// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./InterfaceFaucet.sol";

contract Faucet is Owned, InterfaceFaucet {
    // Storage variables
    mapping(address => bool) public funders; // map
    address[] public funders_arr; // Array

    uint256 public noOfunders; // int, uint of any bits

    // Modifier, to aviod repeatation of statements
    modifier limitWithdraw(uint256 withdrawAmount) {
        require(withdrawAmount <= 100000000000000000, "Cannot exceed 0.1 eth");
        _;
    }

    // Make Tx receive available using paybale
    receive() external payable {}

    // Only payable functions can have "Value" prop
    function addFunds() external payable override {
        address funder = msg.sender;

        if (!funders[funder]) {
            noOfunders++;
            funders[funder] = true;
            funders_arr.push(funder);
        }
    }

    // Difference between   external and public
    // Difference between   pure and view
    function withdraw(uint256 withdrawAmount)
        external
        override
        limitWithdraw(withdrawAmount)
    {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns (address[] memory) {
        return funders_arr;
    }

    function getNoOfFunders() public view returns (uint256) {
        return noOfunders;
    }

    function getFunderAtIndex(uint256 index) external view returns (address) {
        return funders_arr[index];
    }
}

// const instance = await Faucet.deployed()
// instance.addFunds({from:accounts[1], value:"20000000000"})
// instance.addFunds({from:accounts[3], value:"20000000000"})

// instance.withdraw("100000000000000000",{to:accounts[0]})
