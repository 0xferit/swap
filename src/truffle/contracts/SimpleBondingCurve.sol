// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleBondingCurve {
    address public admin = msg.sender;
    ERC20 public token;
    uint public tokenReserve;
    uint public etherReserve;
    uint public reserveConstant;

    enum SwapType {Mint, Redeem}

    event Swap(address caller, SwapType swapType, uint input, uint output);

    constructor(ERC20 _token) public payable {
        token = _token;
    }

    function initialize(uint _amount) public payable{
      require(msg.sender == admin, 'Requires admin privilege.');
      require(msg.value > 0, 'No ether deposited.');
      require(_amount > 0, 'No token deposited.');
      require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed.");

      tokenReserve = _amount;
      etherReserve = msg.value;
      reserveConstant = tokenReserve * etherReserve;
    }

    function mint() public payable {
        require(reserveConstant > 0, 'Curve not initialized.');
        uint newEtherReserve = etherReserve + msg.value;
        uint newTokenReserve = reserveConstant/newEtherReserve;
        uint mintAmount = tokenReserve - newTokenReserve;

        tokenReserve = newTokenReserve;
        etherReserve = newEtherReserve;

        token.transfer(msg.sender, mintAmount);

        emit Swap(msg.sender, SwapType.Mint, msg.value, mintAmount);
    }

    function redeem(uint _tokenAmount) public {
        require(reserveConstant > 0, 'Curve not initialized.');
        uint newTokenReserve = tokenReserve + _tokenAmount;
        uint newEtherReserve = reserveConstant/newTokenReserve;
        uint withdrawAmount = etherReserve - newEtherReserve;

        tokenReserve = newTokenReserve;
        etherReserve = newEtherReserve;

        require(token.transferFrom(msg.sender, address(this), _tokenAmount), "Token transfer failed.");
        msg.sender.transfer(withdrawAmount);

        emit Swap(msg.sender, SwapType.Redeem, _tokenAmount, withdrawAmount);
    }

}
