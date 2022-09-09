const Adoption = artifacts.require('Adoption');

contract('Adoption', function (accounts) {
  const expectPetID = 8;

  before(async function () {
    this.adoption = await Adoption.new();
  });

  it('Fetch address of owner by pet id', async function () {
    // function not have view should be .call()
    const petID = await this.adoption.adopt.call(8, {from: accounts[2]});
    assert.equal(petID, expectPetID);
  });

  it("Fetch collection of all owner's address", async function () {
    await this.adoption.adopt(8, {from: accounts[2]});

    const expectedAdopter = accounts[2];
    const adopters = await this.adoption.getAdopters();
    assert.equal(adopters[expectPetID], expectedAdopter);
  });
});
