import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { GaslessERC721A } from "../../typechain-types";
import { GASLESS_ERC721A_PARAMS } from "../../ignition/modules/gasless-erc721a/deploy";

const ERC721_INTERFACE_ID = "0x80ac58cd";
const {
  CONTRACT_NAME,
  CONTRACT_SYMBOL,
  INITIAL_BASE_URI,
  MAX_SUPPLY,
  MAX_MINT_PER_ADDRESS,
} = GASLESS_ERC721A_PARAMS;

describe("Gasless ERC721A", function () {
  let contract: GaslessERC721A;
  let owner1: SignerWithAddress;
  let owner2: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let layer: SignerWithAddress;

  beforeEach(async function () {
    [owner1, owner2, layer, addr1, addr2] = await ethers.getSigners();

    const GaslessERC721AFactory = await ethers.getContractFactory(
      "GaslessERC721A"
    );
    contract = await GaslessERC721AFactory.deploy(
      CONTRACT_NAME,
      CONTRACT_SYMBOL,
      INITIAL_BASE_URI,
      MAX_SUPPLY,
      MAX_MINT_PER_ADDRESS,
      layer.address
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
        .to.be.reverted;
    });
  });

  describe("Check Relayer", function () {
    it("should set initial relayer correctly", async function () {
      expect(await contract.isRelayer(layer.address)).to.be.true;
    });

    it("should allow owner to add new relayer", async function () {
      await contract.connect(owner1).setRelayerStatus(owner2.address, true);
      expect(await contract.isRelayer(owner2.address)).to.be.true;
    });

    it("should allow owner to remove relayer", async function () {
      await contract.connect(owner1).setRelayerStatus(layer.address, false);
      expect(await contract.isRelayer(layer.address)).to.be.false;
    });

    it("should not allow non-owner to set relayer status", async function () {
      await expect(
        contract.connect(addr1).setRelayerStatus(addr2.address, true)
      ).to.be.reverted;
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
    async function createValidSignature(
      signer: SignerWithAddress,
      quantity: number,
      nonce: bigint
    ) {
      const expiry = (await time.latest()) + 3600; // 1時間後
      const contractAddress = await contract.getAddress();

      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "uint256", "address"],
        [signer.address, quantity, nonce, expiry, contractAddress]
      );
      const messageHashBinary = ethers.getBytes(messageHash);
      const signature = await signer.signMessage(messageHashBinary);

      return { signature, expiry };
    }

    it("should start token IDs from 1", async function () {
      const quantity = 1;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      const tx = await contract
        .connect(layer)
        .gaslessMint(addr1.address, quantity, nonce, expiry, signature);
      await tx.wait();

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

  describe("Check Max Mint Per Address", function () {
    it("should be 3 by default", async function () {
      expect(await contract.maxMintPerAddress()).to.equal(MAX_MINT_PER_ADDRESS);
      expect(await contract.getCurrentMintLimit(addr1)).to.equal(
        MAX_MINT_PER_ADDRESS
      );
    });

    it("should allow the contract owner to change the max mint per address", async function () {
      await contract.connect(owner1).setMaxMintPerAddress(5);
      expect(await contract.maxMintPerAddress()).to.equal(5);
      expect(await contract.getCurrentMintLimit(addr1)).to.equal(5);
      expect(await contract.getCurrentMintLimit(addr2)).to.equal(5);
    });

    it("should not allow the non-owner to change the max mint per address", async function () {
      await expect(contract.connect(addr1).setMaxMintPerAddress(5)).to.be
        .reverted;
    });
  });

  describe("Check Signature Validity Period", function () {
    it("should have default signature validity period of 1 hour", async function () {
      expect(await contract.signatureValidityPeriod()).to.equal(3600);
    });

    it("should allow owner to change signature validity period", async function () {
      await contract.connect(owner1).setSignatureValidityPeriod(7200);
      expect(await contract.signatureValidityPeriod()).to.equal(7200);
    });

    it("should not allow non-owner to change signature validity period", async function () {
      await expect(contract.connect(addr1).setSignatureValidityPeriod(7200)).to
        .to.be.reverted;
    });
  });

  describe("Check Temporary Mint Limit", function () {
    it("should allow owner to set temporary mint limit", async function () {
      await contract.connect(owner1).setTemporaryMintLimit(addr1.address, 5);
      expect(await contract.getCurrentMintLimit(addr1.address)).to.equal(5);
      expect(await contract.getCurrentMintLimit(addr2.address)).to.equal(
        MAX_MINT_PER_ADDRESS
      );
    });

    it("should not allow non-owner to set temporary mint limit", async function () {
      await expect(
        contract.connect(addr1).setTemporaryMintLimit(addr2.address, 5)
      ).to.be.reverted;
    });
  });

  describe("Check Remaining Total Supply", function () {
    async function createValidSignature(
      signer: SignerWithAddress,
      quantity: number,
      nonce: bigint
    ) {
      const expiry = (await time.latest()) + 3600; // 1時間後
      const contractAddress = await contract.getAddress();

      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "uint256", "address"],
        [signer.address, quantity, nonce, expiry, contractAddress]
      );
      const messageHashBinary = ethers.getBytes(messageHash);
      const signature = await signer.signMessage(messageHashBinary);

      return { signature, expiry };
    }

    it("should return correct remaining total supply", async function () {
      expect(await contract.remainingTotalSupply()).to.equal(MAX_SUPPLY);

      const quantity = 1;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      const tx = await contract
        .connect(layer)
        .gaslessMint(addr1.address, quantity, nonce, expiry, signature);
      await tx.wait();

      expect(await contract.remainingTotalSupply()).to.equal(MAX_SUPPLY - 1);
    });
  });

  describe("Check Remaining Mints", function () {
    async function createValidSignature(
      signer: SignerWithAddress,
      quantity: number,
      nonce: bigint
    ) {
      const expiry = (await time.latest()) + 3600; // 1時間後
      const contractAddress = await contract.getAddress();

      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "uint256", "address"],
        [signer.address, quantity, nonce, expiry, contractAddress]
      );
      const messageHashBinary = ethers.getBytes(messageHash);
      const signature = await signer.signMessage(messageHashBinary);

      return { signature, expiry };
    }

    it("should return correct remaining mints for a wallet", async function () {
      expect(await contract.remainingMintAmount(addr1.address)).to.equal(
        MAX_MINT_PER_ADDRESS
      );

      const quantity = 1;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      const tx = await contract
        .connect(layer)
        .gaslessMint(addr1.address, quantity, nonce, expiry, signature);
      await tx.wait();

      expect(await contract.remainingMintAmount(addr1.address)).to.equal(
        MAX_MINT_PER_ADDRESS - 1
      );
    });

    it("should consider temporary mint limit for remaining mints", async function () {
      await contract.connect(owner1).setTemporaryMintLimit(addr1.address, 5);
      expect(await contract.remainingMintAmount(addr1.address)).to.equal(5);
    });
  });

  describe("Check Gasless Minting", function () {
    async function createValidSignature(
      signer: SignerWithAddress,
      quantity: number,
      nonce: bigint
    ) {
      const expiry = (await time.latest()) + 3600; // 1時間後
      const contractAddress = await contract.getAddress();

      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "uint256", "address"],
        [signer.address, quantity, nonce, expiry, contractAddress]
      );
      const messageHashBinary = ethers.getBytes(messageHash);
      const signature = await signer.signMessage(messageHashBinary);

      return { signature, expiry };
    }

    it("should allow minting token with valid signature", async function () {
      const quantity = 1;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      const tx = await contract
        .connect(layer)
        .gaslessMint(addr1.address, quantity, nonce, expiry, signature);
      await tx.wait();

      expect(await contract.balanceOf(addr1.address)).to.equal(1);
      expect(await contract.ownerOf(1)).to.equal(addr1.address);
      expect(await contract.totalSupply()).to.equal(1);
    });

    it("should allow minting multiple tokens with valid signature", async function () {
      const quantity = 2;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      const tx = await contract
        .connect(layer)
        .gaslessMint(addr1.address, quantity, nonce, expiry, signature);
      await tx.wait();

      expect(await contract.balanceOf(addr1.address)).to.equal(2);
      expect(await contract.ownerOf(1)).to.equal(addr1.address);
      expect(await contract.ownerOf(2)).to.equal(addr1.address);
      expect(await contract.totalSupply()).to.equal(2);
    });

    it("should allow minting maxMintPerAddress tokens with valid signature", async function () {
      const quantity = MAX_MINT_PER_ADDRESS;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      const tx = await contract
        .connect(layer)
        .gaslessMint(addr1.address, quantity, nonce, expiry, signature);
      await tx.wait();

      expect(await contract.balanceOf(addr1.address)).to.equal(
        MAX_MINT_PER_ADDRESS
      );
      expect(await contract.ownerOf(1)).to.equal(addr1.address);
      expect(await contract.ownerOf(2)).to.equal(addr1.address);
      expect(await contract.ownerOf(3)).to.equal(addr1.address);
      expect(await contract.totalSupply()).to.equal(MAX_MINT_PER_ADDRESS);
    });

    it("should increment nonce after each mint", async function () {
      const quantity = 1;
      const initialNonce = await contract.nonces(addr1.address);

      for (let i = 0; i < 3; i++) {
        const nonce = await contract.nonces(addr1.address);
        const { signature, expiry } = await createValidSignature(
          addr1,
          quantity,
          nonce
        );

        await contract
          .connect(layer)
          .gaslessMint(addr1.address, quantity, nonce, expiry, signature);

        expect(await contract.nonces(addr1.address)).to.equal(
          initialNonce + BigInt(i + 1)
        );

        await time.increase(1);
      }
    });

    it("should not allow minting with invalid signature", async function () {
      const quantity = 1;
      const nonce = await contract.nonces(addr1.address);
      const { expiry } = await createValidSignature(addr1, quantity, nonce);
      const invalidSignature = await addr2.signMessage("invalid message");

      await expect(
        contract
          .connect(layer)
          .gaslessMint(addr1.address, quantity, nonce, expiry, invalidSignature)
      ).to.be.revertedWith("Invalid signature");
    });

    it("should not allow reusing a signature", async function () {
      const quantity = 1;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      await contract
        .connect(layer)
        .gaslessMint(addr1.address, quantity, nonce, expiry, signature);

      await expect(
        contract
          .connect(layer)
          .gaslessMint(addr1.address, quantity, nonce, expiry, signature)
      ).to.be.revertedWith("Invalid nonce");
    });

    it("should not allow minting with invalid nonce", async function () {
      const quantity = 1;
      const nonce = await contract.nonces(addr1.address);
      const invalidNonce = nonce + 1n;
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        invalidNonce
      );

      await expect(
        contract
          .connect(layer)
          .gaslessMint(addr1.address, quantity, invalidNonce, expiry, signature)
      ).to.be.revertedWith("Invalid nonce");
    });

    it("should not allow minting zero tokens", async function () {
      const quantity = 0;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      await expect(
        contract
          .connect(layer)
          .gaslessMint(addr1.address, quantity, nonce, expiry, signature)
      ).to.be.revertedWith("Quantity must be greater than 0");
    });

    it("should not allow minting more than initial max supply", async function () {
      await contract.connect(owner1).setMaxSupply(1);
      expect(await contract.maxSupply()).to.equal(1);

      // 1回目のミント
      const quantity1 = 1;
      const nonce1 = await contract.nonces(addr1.address);
      const { signature: signature1, expiry: expiry1 } =
        await createValidSignature(addr1, quantity1, nonce1);

      await contract
        .connect(layer)
        .gaslessMint(addr1.address, quantity1, nonce1, expiry1, signature1);
      expect(await contract.totalSupply()).to.equal(1);

      // 2回目のミント
      const quantity2 = 1;
      const nonce2 = await contract.nonces(addr2.address);
      const { signature: signature2, expiry: expiry2 } =
        await createValidSignature(addr2, quantity2, nonce2);

      await expect(
        contract
          .connect(layer)
          .gaslessMint(addr2.address, quantity2, nonce2, expiry2, signature2)
      ).to.be.revertedWith("Exceeds remaining supply");
    });

    it("should not allow minting more than MAX_MINT_PER_ADDRESS", async function () {
      const quantity = MAX_MINT_PER_ADDRESS + 1;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      await expect(
        contract
          .connect(layer)
          .gaslessMint(addr1.address, quantity, nonce, expiry, signature)
      ).to.be.revertedWith("Exceeds max mint per address");
    });

    it("should not allow minting more than temporary mint limit when it's lower than maxMintPerAddress", async function () {
      await contract.connect(owner1).setTemporaryMintLimit(addr1.address, 2);
      const quantity = 3;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      await expect(
        contract
          .connect(layer)
          .gaslessMint(addr1.address, quantity, nonce, expiry, signature)
      ).to.be.revertedWith("Exceeds max mint per address");
    });

    it("should not allow minting when paused", async function () {
      await contract.connect(owner1).setPaused(true);

      const quantity = 1;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      await expect(
        contract
          .connect(layer)
          .gaslessMint(addr1.address, quantity, nonce, expiry, signature)
      ).to.be.revertedWith("Minting is paused");
    });

    it("should not allow minting with expired signature", async function () {
      const quantity = 1;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      await time.increase(3601);

      await expect(
        contract
          .connect(layer)
          .gaslessMint(addr1.address, quantity, nonce, expiry, signature)
      ).to.be.revertedWith("Signature expired");
    });

    it("should not allow minting through non-relayer", async function () {
      const quantity = 1;
      const nonce = await contract.nonces(addr1.address);
      const { signature, expiry } = await createValidSignature(
        addr1,
        quantity,
        nonce
      );

      await expect(
        contract
          .connect(owner1)
          .gaslessMint(addr1.address, quantity, nonce, expiry, signature)
      ).to.be.revertedWith("Not authorized relayer");
    });
  });
});
