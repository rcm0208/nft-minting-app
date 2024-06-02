// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StandardERC721A is ERC721A, Ownable {
    string baseURI;
    uint public maxSupply;
    uint public maxMintAmount;
    bool public paused = false;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initialBaseURI,
        uint _maxSupply,
        uint _maxMintAmount
    ) ERC721A(_name, _symbol) Ownable(_msgSender()) {
        setBaseURI(_initialBaseURI);
        maxSupply = _maxSupply;
        maxMintAmount = _maxMintAmount;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        return
            string(abi.encodePacked(_baseURI(), _toString(_tokenId), ".json"));
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function _startTokenId() internal view virtual override returns (uint) {
        return 1;
    }

    function setPaused(bool _paused) public onlyOwner {
        paused = _paused;
    }

    function setMaxSupply(uint256 _newMaxSupply) public onlyOwner {
        maxSupply = _newMaxSupply;
    }

    function setMaxMintAmount(uint256 _newMaxMintAmount) public onlyOwner {
        maxMintAmount = _newMaxMintAmount;
    }

    function mint(uint256 _quantity) public {
        uint256 supply = totalSupply();

        require(!paused, "the minting is paused");
        require(_quantity > 0, "the quantity must be greater than 0");
        require(
            supply + _quantity <= maxSupply,
            "the quantity is greater than the max supply"
        );
        require(
            _quantity <= maxMintAmount,
            "the quantity is greater than the max mint amount"
        );
        _safeMint(msg.sender, _quantity);
    }
}
