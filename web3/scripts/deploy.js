const { ethers } = require("hardhat");

async function main() {
  const contractfactory = await ethers.getContractFactory("CrowdFunding");

  console.log("deploying.....");
  const CrowdFunding = await contractfactory.deploy();
  await CrowdFunding.waitForDeployment();
  // await SimpleStorage.deploymentTransaction();
  console.log(`deployed `);
  console.log(CrowdFunding.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
