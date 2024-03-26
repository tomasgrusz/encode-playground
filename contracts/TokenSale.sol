// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MyToken} from "./MyToken.sol";
import {MyNFT} from "./MyNFT.sol";

contract TokenSale {
    uint256 public ratio;
    uint256 public price;
    MyToken public paymentToken;
    MyNFT public nftCollection;

    constructor(
        uint256 _ratio,
        uint256 _price,
        MyToken _paymentToken,
        MyNFT _nftCollection
    ) {
        ratio = _ratio;
        price = _price;
        paymentToken = _paymentToken;
        nftCollection = _nftCollection;
    }
}
