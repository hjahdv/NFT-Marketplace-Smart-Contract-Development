// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721, Ownable {
    struct NFT {
        string name;
        string description;
        bool forSale;
        uint256 price;
    }

    mapping(uint256 => NFT) private nfts;

    constructor() ERC721("NFT Marketplace", "HW") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmPi6AabevKz4EBRBDh2MXei2QrnQgoPK5R1sZyZkYHoea/";
    }

    function createNFT(uint256 tokenId, string memory name, string memory description) public onlyOwner {
        require(!_exists(tokenId), "NFT with this ID already exists");

        _safeMint(msg.sender, tokenId);
        nfts[tokenId] = NFT(name, description, false, 0);
    }

    function transferNFT(uint256 tokenId, address to) public {
        require(_exists(tokenId), "NFT with this ID does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only the owner can transfer this NFT");

        safeTransferFrom(msg.sender, to, tokenId);
    }

    function listNFTForSale(uint256 tokenId, uint256 price) public {
        require(_exists(tokenId), "NFT with this ID does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list this NFT for sale");

        nfts[tokenId].forSale = true;
        nfts[tokenId].price = price;
    }

    function removeNFTFromSale(uint256 tokenId) public {
        require(_exists(tokenId), "NFT with this ID does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only the owner can remove this NFT from sale");

        nfts[tokenId].forSale = false;
        nfts[tokenId].price = 0;
    }

    function purchaseNFT(uint256 tokenId) public payable {
        require(_exists(tokenId), "NFT with this ID does not exist");
        require(nfts[tokenId].forSale, "NFT is not for sale");
        require(msg.value == nfts[tokenId].price, "Incorrect Ether amount");

        address payable owner = payable(ownerOf(tokenId));
        _transfer(owner, msg.sender, tokenId);
        owner.transfer(msg.value);

        nfts[tokenId].forSale = false;
        nfts[tokenId].price = 0;
    }

    function getNFT(uint256 tokenId) public view returns (NFT memory nft) {
        require(_exists(tokenId), "NFT with this ID does not exist");

        return nfts[tokenId];
    }
}
