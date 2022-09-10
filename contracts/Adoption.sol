// SPDX-License-Identifier: GPL-3.0-or-later
/// @author Vũ Đắc Hoàng Ân
pragma solidity ^0.8.0;

contract Adoption {
    address[16] private _adopters;

    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15, "Adoption: out of space");

        _adopters[petId] = msg.sender;
        return petId;
    }

    function getAdopters() public view returns (address[16] memory) {
        return _adopters;
    }
}
