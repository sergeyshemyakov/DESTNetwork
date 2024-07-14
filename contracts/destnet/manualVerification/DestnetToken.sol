// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DestnetToken is ERC20 {
    constructor(uint256 _initialSupply, address a1, address a2, address a3, address a4, address a5)
        ERC20("DESTnet test token", "DSTNT")
    {
        _mint(a1, _initialSupply / 5);
        _mint(a2, _initialSupply / 5);
        _mint(a3, _initialSupply / 5);
        _mint(a4, _initialSupply / 5);
        _mint(a5, _initialSupply / 5);
    }
}
