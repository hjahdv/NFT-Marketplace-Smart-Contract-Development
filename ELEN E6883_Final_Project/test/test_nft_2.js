const NFTMarketplace = artifacts.require("NFTMarketplace");

contract("NFTMarketplace", accounts => {
  it("Test that the smart contract can transfer ownership of an NFT", async () => {
    // Create a new instance of the smart contract
    const nftMarketplaceInstance = await NFTMarketplace.deployed();

    // Create two user accounts
    const seller = accounts[0];
    const buyer = accounts[1];

    // Create a new NFT with the first user account
    const tokenId = 1;
    const name = "Test NFT";
    const description = "This is a test NFT";
    await nftMarketplaceInstance.createNFT(tokenId, name, description, {from: seller});

    // Transfer ownership of the NFT to the second user account using the transferNFT function
    await nftMarketplaceInstance.transferNFT(tokenId, buyer, {from: seller});

    // Assert that the NFT is now owned by the second user account
    const nowOwner = await nftMarketplaceInstance.ownerOf(tokenId);
    assert.equal(nowOwner, buyer);
  });
});