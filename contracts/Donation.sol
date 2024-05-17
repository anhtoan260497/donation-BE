// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

error Donation__CannotDonateWithZeroToken();
error Donation__CannotDonateThisToken();
error Donation__NoBalanceToWidthdraw();
error Donation__WidthdrawFailed();
error Donation__OnlyOwnerCanSeeThis();

contract Donation is Ownable {
    event Donated(address donator, uint256 value);
    event Widthdrawed(uint256 value);
    event OwnerChanged(address oldOwner, address newOwner);

    using SafeERC20 for IERC20;

    mapping(address => uint256) private s_donations;

    uint256 private s_balances;

    constructor(address _owner) Ownable(_owner) {}

    function _donate() external payable {
        if (msg.value == 0) revert Donation__CannotDonateWithZeroToken();
        s_donations[msg.sender] += msg.value;
        s_balances += msg.value;
        emit Donated(msg.sender, msg.value);
    }

    function _widthdraw() external onlyOwner {
        if (address(this).balance <= 0) revert Donation__NoBalanceToWidthdraw();
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        if (!success) revert Donation__WidthdrawFailed();
        s_balances = 0;
        emit Widthdrawed(address(this).balance);
    }

    function getBalances() external view returns (uint256) {
        if(owner() != msg.sender) revert Donation__OnlyOwnerCanSeeThis();
        return s_balances;
    }

    function getBalanceWithFnc() external view returns (uint256) {
        return address(this).balance;
    }

    function changeOwner(address _newOwner) external onlyOwner {
        address oldOwner = owner();
        transferOwnership(_newOwner);
        emit OwnerChanged(oldOwner, _newOwner);
    }

    fallback() external payable {}
    receive() external payable {}
}
