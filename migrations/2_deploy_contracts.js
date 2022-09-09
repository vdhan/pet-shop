const CONTRACT = 'Adoption';
const Contract = artifacts.require(CONTRACT);

module.exports = function(deployer) {
  deployer.deploy(Contract);
};
