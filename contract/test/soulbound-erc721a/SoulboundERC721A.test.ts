import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Soulbound_ERC721A_PARAMS } from "../../ignition/modules/soulbound-erc721a/deploy";
import type { SoulboundERC721A } from "../../typechain-types";

const ERC721_INTERFACE_ID = "0x80ac58cd";
const {
	CONTRACT_NAME,
	CONTRACT_SYMBOL,
	INITIAL_BASE_URI,
	MAX_SUPPLY,
	MAX_MINT_PER_ADDRESS,
} = Soulbound_ERC721A_PARAMS;

describe("Soulbound ERC721A", () => {
	let contract: SoulboundERC721A;
	let owner1: SignerWithAddress;
	let owner2: SignerWithAddress;
	let addr1: SignerWithAddress;
	let addr2: SignerWithAddress;

	beforeEach(async () => {
		[owner1, owner2, addr1, addr2] = await ethers.getSigners();

		const SoulboundERC721AFactory =
			await ethers.getContractFactory("SoulboundERC721A");
		contract = await SoulboundERC721AFactory.deploy(
			CONTRACT_NAME,
			CONTRACT_SYMBOL,
			INITIAL_BASE_URI,
			MAX_SUPPLY,
			MAX_MINT_PER_ADDRESS,
		);
	});

	describe("Check Deployment", () => {
		it("check supportsInterface", async () => {
			expect(await contract.supportsInterface(ERC721_INTERFACE_ID)).to.equal(
				true,
			);
		});

		it("check token name", async () => {
			expect(await contract.name()).to.equal(CONTRACT_NAME);
		});

		it("check token symbol", async () => {
			expect(await contract.symbol()).to.equal(CONTRACT_SYMBOL);
		});
	});

	describe("Check Owner", () => {
		it("should be the contract owner by default", async () => {
			expect(await contract.owner()).to.equal(owner1.address);
		});

		it("should allow the contract owner to change the owner", async () => {
			await contract.connect(owner1).transferOwnership(owner2.address);
			expect(await contract.owner()).to.equal(owner2.address);
		});

		it("should not allow the non-owner to change the owner", async () => {
			await expect(contract.connect(addr1).transferOwnership(addr2.address)).to
				.be.reverted;
		});
	});

	describe("Check Base URI", () => {
		it("should have an empty base URI by default", async () => {
			expect(await contract.tokenURI(1)).to.equal(`${INITIAL_BASE_URI}1.json`);
		});

		it("should set the correct base URI ", async () => {
			await contract.connect(owner1).setBaseURI("https://test.com/");
			expect(await contract.tokenURI(1)).to.equal("https://test.com/1.json");
		});

		it("should allow the contract owner to change the base URI", async () => {
			await contract.connect(owner1).setBaseURI("https://newtest.com/");
			expect(await contract.tokenURI(1)).to.equal("https://newtest.com/1.json");
		});

		it("should not allow a non-owner to change the base URI", async () => {
			await expect(contract.connect(addr1).setBaseURI("https://newtest.com/"))
				.to.be.reverted;
		});
	});

	describe("Check Token ID", () => {
		it("should start token IDs from 1", async () => {
			await contract.connect(addr1).mint(1);
			expect(await contract.ownerOf(1)).to.equal(addr1.address);
		});

		it("should not be able to query non-existent token ID 0", async () => {
			await expect(contract.ownerOf(0)).to.be.reverted;
		});
	});

	describe("Check Paused", () => {
		it("should be paused by default", async () => {
			expect(await contract.paused()).to.equal(false);
		});

		it("should allow the contract owner to toggle paused", async () => {
			await contract.connect(owner1).setPaused(true);
			expect(await contract.paused()).to.equal(true);

			await contract.connect(owner1).setPaused(false);
			expect(await contract.paused()).to.equal(false);
		});

		it("should not allow the non-owner to toggle paused", async () => {
			await expect(contract.connect(addr1).setPaused(true)).to.be.reverted;
		});
	});

	describe("Check Max Supply", () => {
		it("should be 10 by default", async () => {
			expect(await contract.maxSupply()).to.equal(MAX_SUPPLY);
		});

		it("should allow the contract owner to change the max supply", async () => {
			await contract.connect(owner1).setMaxSupply(20);
			expect(await contract.maxSupply()).to.equal(20);
		});

		it("should not allow the non-owner to change the max supply", async () => {
			await expect(contract.connect(addr1).setMaxSupply(20)).to.be.reverted;
		});
	});

	describe("Check Max Mint Per Address", () => {
		it("should be 3 by default", async () => {
			expect(await contract.maxMintPerAddress()).to.equal(MAX_MINT_PER_ADDRESS);
			expect(await contract.getCurrentMintLimit(addr1)).to.equal(
				MAX_MINT_PER_ADDRESS,
			);
		});

		it("should allow the contract owner to change the max mint per address", async () => {
			await contract.connect(owner1).setMaxMintPerAddress(5);
			expect(await contract.maxMintPerAddress()).to.equal(5);
			expect(await contract.getCurrentMintLimit(addr1)).to.equal(5);
			expect(await contract.getCurrentMintLimit(addr2)).to.equal(5);
		});

		it("should not allow the non-owner to change the max mint per address", async () => {
			await expect(contract.connect(addr1).setMaxMintPerAddress(5)).to.be
				.reverted;
		});
	});

	describe("Check Temporary Mint Limit", () => {
		it("should allow owner to set temporary mint limit", async () => {
			await contract.connect(owner1).setTemporaryMintLimit(addr1.address, 5);
			expect(await contract.getCurrentMintLimit(addr1.address)).to.equal(5);
			expect(await contract.getCurrentMintLimit(addr2.address)).to.equal(
				MAX_MINT_PER_ADDRESS,
			);
		});

		it("should not allow non-owner to set temporary mint limit", async () => {
			await expect(
				contract.connect(addr1).setTemporaryMintLimit(addr2.address, 5),
			).to.be.reverted;
		});
	});

	describe("Check Remaining Total Supply", () => {
		it("should return correct remaining total supply", async () => {
			expect(await contract.remainingTotalSupply()).to.equal(MAX_SUPPLY);
			await contract.connect(addr1).mint(1);
			expect(await contract.remainingTotalSupply()).to.equal(MAX_SUPPLY - 1);
		});
	});

	describe("Check Remaining Mints", () => {
		it("should return correct remaining mints for a wallet", async () => {
			expect(await contract.remainingMintAmount(addr1.address)).to.equal(
				MAX_MINT_PER_ADDRESS,
			);
			await contract.connect(addr1).mint(1);
			expect(await contract.remainingMintAmount(addr1.address)).to.equal(
				MAX_MINT_PER_ADDRESS - 1,
			);
		});

		it("should consider temporary mint limit for remaining mints", async () => {
			await contract.connect(owner1).setTemporaryMintLimit(addr1.address, 5);
			expect(await contract.remainingMintAmount(addr1.address)).to.equal(5);
		});
	});

	describe("Check Minting", () => {
		it("should allow minting token", async () => {
			await contract.connect(addr1).mint(1);
			expect(await contract.totalSupply()).to.equal(1);
		});

		it("should allow minting multiple tokens", async () => {
			await contract.connect(addr1).mint(1);
			await contract.connect(addr1).mint(2);
			expect(await contract.totalSupply()).to.equal(3);
		});

		it("should allow minting maxMintPerAddress tokens", async () => {
			await contract.connect(addr1).mint(MAX_MINT_PER_ADDRESS);
			expect(await contract.totalSupply()).to.equal(MAX_MINT_PER_ADDRESS);
		});

		it("should not allow minting zero tokens", async () => {
			await expect(contract.connect(addr1).mint(0)).to.be.revertedWith(
				"Quantity must be greater than 0",
			);
		});

		it("should not allow minting more than initial max supply", async () => {
			await contract.connect(owner1).setMaxSupply(1);
			expect(await contract.maxSupply()).to.equal(1);

			await contract.connect(addr1).mint(1);
			await expect(contract.connect(addr1).mint(1)).to.be.revertedWith(
				"Exceeds remaining supply",
			);
		});

		it("should not allow minting more than MAX_MINT_PER_ADDRESS", async () => {
			await expect(
				contract.connect(addr1).mint(MAX_MINT_PER_ADDRESS + 1),
			).to.be.revertedWith("Exceeds max mint per address");
		});

		it("should not allow minting when paused", async () => {
			await contract.connect(owner1).setPaused(true);
			await expect(contract.connect(addr1).mint(1)).to.be.revertedWith(
				"Minting is paused",
			);
		});
	});

	describe("Check Burn", () => {
		it("should allow token owner to burn their token", async () => {
			await contract.connect(addr1).mint(1);
			await contract.connect(addr1).burn(1);
			expect(await contract.balanceOf(addr1.address)).to.equal(0);
			await expect(contract.ownerOf(1)).to.be.reverted;
		});

		it("should allow contract owner to burn any token", async () => {
			await contract.connect(addr1).mint(1);
			await contract.connect(owner1).burnByOwner(1);
			expect(await contract.balanceOf(addr1.address)).to.equal(0);
			await expect(contract.ownerOf(1)).to.be.revertedWithCustomError(
				contract,
				"OwnerQueryForNonexistentToken",
			);
		});

		it("should not allow non-owner to burn token", async () => {
			await contract.connect(addr1).mint(1);
			await expect(contract.connect(addr2).burn(1)).to.be.revertedWith(
				"Caller is not the token owner",
			);
		});

		it("should not allow non-contract owner to use burnByOwner", async () => {
			await contract.connect(addr1).mint(1);
			await expect(contract.connect(addr2).burnByOwner(1)).to.be.reverted;
		});

		it("should not allow burning of non-existent token", async () => {
			await expect(contract.connect(addr1).burn(1)).to.be.reverted;
		});
	});

	describe("Check SBT Characteristics", () => {
		it("should not allow safeTransferFrom", async () => {
			await contract.connect(addr1).mint(1);
			await expect(
				contract
					.connect(addr1)
					["safeTransferFrom(address,address,uint256)"](
						addr1.address,
						addr2.address,
						1,
					),
			).to.be.revertedWith("SBT: transfer is not allowed");
		});

		it("should not allow safeTransferFrom with data", async () => {
			await contract.connect(addr1).mint(1);
			await expect(
				contract
					.connect(addr1)
					["safeTransferFrom(address,address,uint256,bytes)"](
						addr1.address,
						addr2.address,
						1,
						"0x",
					),
			).to.be.revertedWith("SBT: transfer is not allowed");
		});

		it("should not allow approve", async () => {
			await contract.connect(addr1).mint(1);
			await expect(
				contract.connect(addr1).approve(addr2.address, 1),
			).to.be.revertedWith("SBT: approval is not allowed");
		});

		it("should not allow setApprovalForAll", async () => {
			await expect(
				contract.connect(addr1).setApprovalForAll(addr2.address, true),
			).to.be.revertedWith("SBT: approval for all is not allowed");
		});

		it("should allow minting", async () => {
			await expect(contract.connect(addr1).mint(1))
				.to.emit(contract, "Transfer")
				.withArgs(ethers.ZeroAddress, addr1.address, 1);
			expect(await contract.balanceOf(addr1.address)).to.equal(1);
		});

		it("should maintain correct ownership after mint", async () => {
			await contract.connect(addr1).mint(1);
			expect(await contract.ownerOf(1)).to.equal(addr1.address);
		});

		it("should not allow transfer even by contract owner", async () => {
			await contract.connect(addr1).mint(1);
			await expect(
				contract.connect(owner1).transferFrom(addr1.address, addr2.address, 1),
			).to.be.revertedWith("SBT: transfer is not allowed");
		});
	});
});
