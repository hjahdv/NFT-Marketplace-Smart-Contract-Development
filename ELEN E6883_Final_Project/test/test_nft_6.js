const NFTMarketplace = artifacts.require("NFTMarketplace");

contract("NFTMarketplace", accounts => {
  it("Test that the smart contract can execute an unsuccessful NFT purchase", async () => {
    // Create a new instance of the smart contract
    const nftMarketplaceInstance = await NFTMarketplace.deployed();

    // Create two user accounts
    const seller = accounts[0];
    const buyer = accounts[1];

    // Create a new NFT with the first user account
    const tokenId = 1;
    const name = "Test NFT";
    const description = "This is a test NFT";
    await nftMarketplaceInstance.createNFT(tokenId, name, description, { from: seller });

    // List the NFT for sale using the listNFTForSale function with a sale price
    const salePrice = web3.utils.toWei("1", "ether");
    await nftMarketplaceInstance.listNFTForSale(tokenId, salePrice, { from: seller });

    // Attempt to purchase the NFT using the purchaseNFT function with the second user account but with an incorrect amount of Ether
    const balanceSellerBefore = web3.utils.toBN(await web3.eth.getBalance(seller));
    const incorrectPrice = salePrice / 2;
    try {
      await nftMarketplaceInstance.purchaseNFT(tokenId, { from: buyer, value: incorrectPrice });
    } catch (err) {
      assert(err.message.includes("Incorrect Ether amount"), "Purchase should fail with incorrect Ether amount");
    }
    const balanceSellerAfter = web3.utils.toBN(await web3.eth.getBalance(seller));

    // Assert that the NFT ownership remains with the first user account and no Ether was transferred
    const newOwner = await nftMarketplaceInstance.ownerOf(tokenId);
    assert.equal(newOwner, seller);
    assert.equal(balanceSellerAfter.sub(balanceSellerBefore), 0);
  });
});