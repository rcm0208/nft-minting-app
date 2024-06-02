import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { StandardERC721A } from "../../typechain-types";
import { ERC721A_PARAMS } from "../../ignition/modules/erc721a/deploy";

const ERC721_INTERFACE_ID = "0x80ac58cd";
const {
  CONTRACT_NAME,
  CONTRACT_SYMBOL,
  INITIAL_BASE_URI,
  MAX_SUPPLY,
  MAX_MINT_AMOUNT,
} = ERC721A_PARAMS;

describe("Standard ERC721A", function () {
  let contract: StandardERC721A;
  let owner1: SignerWithAddress;
  let owner2: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner1, owner2, addr1, addr2] = await ethers.getSigners();

    const StandardERC721AFactory = await ethers.getContractFactory(
      "StandardERC721A"
    );
    contract = await StandardERC721AFactory.deploy(
      CONTRACT_NAME,
      CONTRACT_SYMBOL,
      INITIAL_BASE_URI,
      MAX_SUPPLY,
      MAX_MINT_AMOUNT
    );
  });

  describe("Check Deployment", function () {
    it("check supportsInterface", async function () {
      expect(await contract.supportsInterface(ERC721_INTERFACE_ID)).to.equal(
        true
      );
    });

    it("check token name", async function () {
      expect(await contract.name()).to.equal(CONTRACT_NAME);
    });

    it("check token symbol", async function () {
      expect(await contract.symbol()).to.equal(CONTRACT_SYMBOL);
    });
  });

  describe("Check Owner", function () {
    it("should be the contract owner by default", async function () {
      expect(await contract.owner()).to.equal(owner1.address);
    });

    it("should allow the contract owner to change the owner", async function () {
      await contract.connect(owner1).transferOwnership(owner2.address);
      expect(await contract.owner()).to.equal(owner2.address);
    });

    it("should not allow the non-owner to change the owner", async function () {
      await expect(contract.connect(addr1).transferOwnership(addr2.address)).to
        .be.reverted;
    });
  });

  describe("Check Base URI", function () {
    it("should have an empty base URI by default", async function () {
      expect(await contract.tokenURI(1)).to.equal(INITIAL_BASE_URI + "1.json");
    });

    it("should set the correct base URI ", async function () {
      await contract.connect(owner1).setBaseURI("https://test.com/");
      expect(await contract.tokenURI(1)).to.equal("https://test.com/1.json");
    });

    it("should allow the contract owner to change the base URI", async function () {
      await contract.connect(owner1).setBaseURI("https://newtest.com/");
      expect(await contract.tokenURI(1)).to.equal("https://newtest.com/1.json");
    });

    it("should not allow a non-owner to change the base URI", async function () {
      await expect(contract.connect(addr1).setBaseURI("https://newtest.com/"))
        .to.be.reverted;
    });
  });

  describe("Check Token ID", function () {
    it("should start token IDs from 1", async function () {
      await contract.connect(addr1).mint(1);
      expect(await contract.ownerOf(1)).to.equal(addr1.address);
    });

    it("should not be able to query non-existent token ID 0", async function () {
      await expect(contract.ownerOf(0)).to.be.reverted;
    });
  });

  describe("Check Paused", function () {
    it("should be paused by default", async function () {
      expect(await contract.paused()).to.equal(false);
    });

    it("should allow the contract owner to toggle paused", async function () {
      await contract.connect(owner1).setPaused(true);
      expect(await contract.paused()).to.equal(true);

      await contract.connect(owner1).setPaused(false);
      expect(await contract.paused()).to.equal(false);
    });

    it("should not allow the non-owner to toggle paused", async function () {
      await expect(contract.connect(addr1).setPaused(true)).to.be.reverted;
    });
  });

  describe("Check Max Supply", function () {
    it("should be 10 by default", async function () {
      expect(await contract.maxSupply()).to.equal(MAX_SUPPLY);
    });

    it("should allow the contract owner to change the max supply", async function () {
      await contract.connect(owner1).setMaxSupply(20);
      expect(await contract.maxSupply()).to.equal(20);
    });

    it("should not allow the non-owner to change the max supply", async function () {
      await expect(contract.connect(addr1).setMaxSupply(20)).to.be.reverted;
    });
  });

  describe("Check Max Mint Amount", function () {
    it("should be 5 by default", async function () {
      expect(await contract.maxMintAmount()).to.equal(MAX_MINT_AMOUNT);
    });

    it("should allow the contract owner to change the max mint amount", async function () {
      await contract.connect(owner1).setMaxMintAmount(10);
      expect(await contract.maxMintAmount()).to.equal(10);
    });

    it("should not allow the non-owner to change the max mint amount", async function () {
      await expect(contract.connect(addr1).setMaxMintAmount(10)).to.be.reverted;
    });
  });

  describe("Check Minting", function () {
    it("should mint token", async function () {
      await contract.connect(addr1).mint(1);
      expect(await contract.totalSupply()).to.equal(1);
    });

    it("should mint multiple tokens", async function () {
      await contract.connect(addr1).mint(2);
      await contract.connect(addr1).mint(3);
      expect(await contract.totalSupply()).to.equal(5);
    });

    it("should mint maxMintAmount tokens", async function () {
      await contract.connect(addr1).mint(MAX_MINT_AMOUNT);
      expect(await contract.totalSupply()).to.equal(MAX_MINT_AMOUNT);
    });

    it("should not mint zero tokens", async function () {
      await expect(contract.connect(addr1).mint(0)).to.be.reverted;
    });

    it("should not mint more than initial max supply", async function () {
      for (let i = 0; i < MAX_SUPPLY; i++) {
        await contract.connect(addr1).mint(1);
      }
      await expect(contract.connect(addr1).mint(1)).to.be.reverted;
    });

    it("should not mint more than max mint amount", async function () {
      await expect(contract.connect(addr1).mint(MAX_MINT_AMOUNT + 1)).to.be
        .reverted;
    });

    it("should not mint when paused", async function () {
      await contract.connect(owner1).setPaused(true);
      await expect(contract.connect(addr1).mint(1)).to.be.reverted;
    });
  });
});
