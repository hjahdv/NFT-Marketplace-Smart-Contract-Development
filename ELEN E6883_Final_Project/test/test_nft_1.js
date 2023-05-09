const NFTMarketplace = artifacts.require("NFTMarketplace");

contract("NFTMarketplace", accounts => {
  it("Test that the smart contract can create a new NFT", async function () {
    // Create a new instance of the smart contract
    const nftMarketplaceInstance = await NFTMarketplace.deployed();

    // Call the createNFT function with a unique ID, name, and description
    const tokenId = 1;
    const name = "Test NFT";
    const description = "This is a test NFT";
    await nftMarketplaceInstance.createNFT(tokenId, name, description, { from: accounts[0] });

    // Assert that the NFT was created and its properties match the input values
    const nft = await nftMarketplaceInstance.getNFT(tokenId);
    assert.equal(nft[0], name);
    assert.equal(nft[1], description);
  });
});