// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SoulboundERC721A is ERC721A, Ownable, ReentrancyGuard {
    string private baseURI;
    uint256 public maxSupply;
    uint256 public maxMintPerAddress;
    bool public paused;
    bool public burnEnabled;

    mapping(address => uint256) public mintedAmount;
    mapping(address => uint256) public temporaryMintLimit;

    event Minted(address indexed to, uint256 quantity);
    event Burned(address indexed from, uint256 tokenId);
    event BaseURIUpdated(string newBaseURI);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event MaxMintPerAddressUpdated(uint256 newMaxMintPerAddress);
    event PausedStatusUpdated(bool isPaused);
    event TemporaryMintLimitSet(address indexed wallet, uint256 limit);
    event BurnEnabledUpdated(bool isBurnEnabled);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initialBaseURI,
        uint256 _maxSupply,
        uint256 _maxMintPerAddress
    ) ERC721A(_name, _symbol) Ownable(_msgSender()) {
        baseURI = _initialBaseURI;
        maxSupply = _maxSupply;
        maxMintPerAddress = _maxMintPerAddress;
        burnEnabled = true;

        emit BaseURIUpdated(_initialBaseURI);
        emit BurnEnabledUpdated(true);
    }

    function mint(uint256 quantity) external nonReentrant {
        require(!paused, "Minting is paused");
        require(quantity > 0, "Quantity must be greater than 0");
        require(quantity <= remainingTotalSupply(), "Exceeds remaining supply");
        require(
            mintedAmount[msg.sender] + quantity <=
                getCurrentMintLimit(msg.sender),
            "Exceeds max mint per address"
        );

        mintedAmount[msg.sender] += quantity;
        _safeMint(msg.sender, quantity);

        emit Minted(msg.sender, quantity);
    }

    function burn(uint256 tokenId) external {
        require(burnEnabled, "Burn functionality is disabled");
        require(
            ownerOf(tokenId) == msg.sender,
            "Caller is not the token owner"
        );
        _burn(tokenId);
        emit Burned(msg.sender, tokenId);
    }

    function burnByOwner(uint256 tokenId) external onlyOwner {
        address tokenOwner = ownerOf(tokenId);
        require(tokenOwner != address(0), "SBT: token does not exist");
        _burn(tokenId);
        emit Burned(tokenOwner, tokenId);
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
        emit BaseURIUpdated(_newBaseURI);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function _startTokenId() internal view virtual override returns (uint) {
        return 1;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return
            string(abi.encodePacked(_baseURI(), _toString(_tokenId), ".json"));
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit PausedStatusUpdated(_paused);
    }

    function setMaxSupply(uint256 _newMaxSupply) external onlyOwner {
        maxSupply = _newMaxSupply;
        emit MaxSupplyUpdated(_newMaxSupply);
    }

    function setMaxMintPerAddress(
        uint256 _newMaxMintPerAddress
    ) external onlyOwner {
        maxMintPerAddress = _newMaxMintPerAddress;
        emit MaxMintPerAddressUpdated(_newMaxMintPerAddress);
    }

    function setBurnEnabled(bool _burnEnabled) external onlyOwner {
        burnEnabled = _burnEnabled;
        emit BurnEnabledUpdated(_burnEnabled);
    }

    function remainingTotalSupply() public view returns (uint256) {
        return maxSupply - _totalMinted();
    }

    function remainingMintAmount(address wallet) public view returns (uint256) {
        uint256 remainingForWallet = getCurrentMintLimit(wallet) -
            mintedAmount[wallet];
        return
            remainingForWallet < remainingTotalSupply()
                ? remainingForWallet
                : remainingTotalSupply();
    }

    function setTemporaryMintLimit(
        address wallet,
        uint256 limit
    ) external onlyOwner {
        temporaryMintLimit[wallet] = limit;
        emit TemporaryMintLimitSet(wallet, limit);
    }

    function getCurrentMintLimit(address wallet) public view returns (uint256) {
        return
            temporaryMintLimit[wallet] != 0
                ? temporaryMintLimit[wallet]
                : maxMintPerAddress;
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public payable virtual override {
        revert("SBT: transfer is not allowed");
    }

    function safeTransferFrom(
        address,
        address,
        uint256
    ) public payable virtual override {
        revert("SBT: transfer is not allowed");
    }

    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public payable virtual override {
        revert("SBT: transfer is not allowed");
    }

    function approve(address, uint256) public payable virtual override {
        revert("SBT: approval is not allowed");
    }

    function setApprovalForAll(address, bool) public virtual override {
        revert("SBT: approval for all is not allowed");
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 startTokenId,
        uint256 quantity
    ) internal virtual override {
        super._beforeTokenTransfers(from, to, startTokenId, quantity);
        require(
            from == address(0) || to == address(0),
            "SBT: token transfer is not allowed"
        );
    }
}
