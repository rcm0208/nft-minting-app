// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GaslessERC721A is ERC721A, Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    string private baseURI;
    uint256 public maxSupply;
    uint256 public maxMintPerAddress;
    bool public paused;
    uint256 public signatureValidityPeriod = 1 hours;

    mapping(address => uint256) public mintedAmount;
    mapping(address => uint256) public nonces;
    mapping(address => uint256) public temporaryMintLimit;
    mapping(address => bool) public isRelayer;

    event Minted(address indexed to, uint256 quantity);
    event BaseURIUpdated(string newBaseURI);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event MaxMintPerAddressUpdated(uint256 newMaxMintPerAddress);
    event SignatureValidityPeriodUpdated(uint256 newSignatureValidityPeriod);
    event PausedStatusUpdated(bool isPaused);
    event TemporaryMintLimitSet(address indexed wallet, uint256 limit);
    event RelayerStatusUpdated(address indexed relayer, bool status);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initialBaseURI,
        uint256 _maxSupply,
        uint256 _maxMintPerAddress,
        address _initialRelayer
    ) ERC721A(_name, _symbol) Ownable(_msgSender()) {
        baseURI = _initialBaseURI;
        maxSupply = _maxSupply;
        maxMintPerAddress = _maxMintPerAddress;
        isRelayer[_initialRelayer] = true;

        emit RelayerStatusUpdated(_initialRelayer, true);
        emit BaseURIUpdated(_initialBaseURI);
    }

    function gaslessMint(
        address signer,
        uint256 quantity,
        uint256 nonce,
        uint256 expiry,
        bytes memory signature
    ) external nonReentrant {
        require(isRelayer[msg.sender], "Not authorized relayer");
        require(!paused, "Minting is paused");
        require(nonce == nonces[signer], "Invalid nonce");
        require(block.timestamp <= expiry, "Signature expired");
        require(quantity > 0, "Quantity must be greater than 0");
        require(quantity <= remainingTotalSupply(), "Exceeds remaining supply");
        require(
            mintedAmount[signer] + quantity <= getCurrentMintLimit(signer),
            "Exceeds max mint per address"
        );
        require(
            verifySignature(signer, quantity, nonce, expiry, signature),
            "Invalid signature"
        );

        nonces[signer]++;
        mintedAmount[signer] += quantity;
        _safeMint(signer, quantity);

        emit Minted(signer, quantity);
    }

    function verifySignature(
        address signer,
        uint256 quantity,
        uint256 nonce,
        uint256 expiry,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(signer, quantity, nonce, expiry, address(this))
        );
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(
            messageHash
        );
        return ethSignedMessageHash.recover(signature) == signer;
    }

    function setRelayerStatus(address relayer, bool status) external onlyOwner {
        isRelayer[relayer] = status;
        emit RelayerStatusUpdated(relayer, status);
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

    function setSignatureValidityPeriod(
        uint256 _newSignatureValidityPeriod
    ) external onlyOwner {
        signatureValidityPeriod = _newSignatureValidityPeriod;
        emit SignatureValidityPeriodUpdated(_newSignatureValidityPeriod);
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

    function getNonce(address signer) public view returns (uint256) {
        return nonces[signer];
    }
}
