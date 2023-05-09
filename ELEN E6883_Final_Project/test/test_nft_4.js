const NFTMarketplace = artifacts.require("NFTMarketplace");

contract("NFTMarketplace", accounts => {
  it("Test that the smart contract can remove an NFT from sale", async () => {
    // Create a new instance of the smart contract
    const nftMarketplaceInstance = await NFTMarketplace.deployed();

    // Create a new user account
    const owner = accounts[0];
  
    // Create a new NFT with the user account
    const tokenId = 1;
    const name = "Test NFT";
    const description = "This is a test NFT";
    await nftMarketplaceInstance.createNFT(tokenId, name, description, {from: owner});
  
    // List the NFT for sale using the listNFTForSale function with a sale price
    const salePrice = web3.utils.toWei("1", "ether");
    await nftMarketplaceInstance.listNFTForSale(tokenId, salePrice, {from: owner});
  
    // Remove the NFT from sale using the removeNFTFromSale function
    await nftMarketplaceInstance.removeNFTFromSale(tokenId, {from: owner});
  
    // Assert that the NFT is no longer listed for sale
    const nft = await nftMarketplaceInstance.getNFT(tokenId);
    assert.equal(nft.forSale, false);
    assert.equal(nft.price, 0);
  });
});