import { strict as assert } from "node:assert";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Crowdfunding", function () {
  it("creates a campaign and funds it", async () => {
    const [owner, funder] = await ethers.getSigners();

    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    const cf = (await Crowdfunding.deploy()) as any;
    await cf.waitForDeployment();

    // create campaign: goal 1 ETH, duration 1 day
    const goalWei = ethers.parseEther("1");
    const duration = 24 * 60 * 60;

    const tx = await cf.createCampaign("Test", "Desc", goalWei, duration);
    await tx.wait();

    const c = await cf.getCampaign(1);
    assert.equal(c.creator, owner.address);
    assert.equal(c.goal.toString(), goalWei.toString());

    // fund with 0.2 ETH
    const fundTx = await cf
      .connect(funder)
      .fundCampaign(1, { value: ethers.parseEther("0.2") });
    await fundTx.wait();

    const updated = await cf.getCampaign(1);
    assert.equal(
      updated.amountRaised.toString(),
      ethers.parseEther("0.2").toString(),
    );
  });
});
