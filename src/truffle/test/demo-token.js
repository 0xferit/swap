const {
  BN,
  constants,
  expectEvent,
  expectRevert
} = require("@openzeppelin/test-helpers");

const DemoToken = artifacts.require("DemoToken");

contract("DemoToken", ([sender, receiver]) => {
  const initialAmount = new BN("1000");
  beforeEach(async () => {
    token = await DemoToken.new(initialAmount, { from: sender });
  });

  it("assigns initial balance to deployer", async () => {
    assert((await token.balanceOf(sender)).eq(initialAmount));
  });

  it("transfers so that origin and destination accounts updated correctly", async () => {
    let amount = new BN("33");
    await token.transfer(receiver, amount);

    assert((await token.balanceOf(receiver)).eq(amount));
    assert(
      (await token.balanceOf(sender)).eq(new BN(initialAmount.sub(amount)))
    );
  });

  it("emits Transfer event in case of a transfer", async () => {
    const receipt = await token.transfer(receiver, "33", {
      from: sender
    });

    expectEvent(receipt, "Transfer", {
      from: sender,
      to: receiver,
      value: "33"
    });
  });

  it("can not transfer more than balance the sender has", async () => {
    await expectRevert(
      token.transfer(receiver, initialAmount.add(new BN("1")), {
        from: sender
      }),
      "ERC20: transfer amount exceeds balance."
    );
  });
});
