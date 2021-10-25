const Main = artifacts.require("PoolFactory");

module.exports = function (deployer) {
  deployer.deploy(Main);
};
