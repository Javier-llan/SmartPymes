var Employee = artifacts.require("./Employee.sol");

module.exports = function(deployer) {
  deployer.deploy(Employee);
};