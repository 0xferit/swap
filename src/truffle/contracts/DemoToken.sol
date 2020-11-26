// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DemoToken is ERC20 {

    constructor(uint _initialSupply) public ERC20("Demo", "DEMO") {
        _mint(msg.sender, _initialSupply);
    }

}
