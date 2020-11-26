const {
  BN,
  constants,
  expectEvent,
  expectRevert
} = require("@openzeppelin/test-helpers");

const SimpleBondingCurve = artifacts.require("SimpleBondingCurve");
const DemoToken = artifacts.require("DemoToken");

const ten = new BN("10");

contract("SimpleBondingCurve", ([admin, user]) => {
  const initialAmount = 1000;
  beforeEach(async () => {
    token = await DemoToken.new("1000", { from: admin });
    automatedMarketMaker = await SimpleBondingCurve.new(token.address, {
      from: admin
    });
  });

  it("reverts if initialize called by someone but admin", async () => {
    await expectRevert(
      automatedMarketMaker.initialize(initialAmount / 2, {
        from: user
      }),
      "Reason given: Requires admin privilege."
    );
  });

  it("reverts if no ether deposited during initialize", async () => {
    await expectRevert(
      automatedMarketMaker.initialize(initialAmount / 2, {
        from: admin
      }),
      "Reason given: No ether deposited."
    );
  });

  it("reverts if no token deposited during initialize", async () => {
    await expectRevert(
      automatedMarketMaker.initialize(initialAmount / 2, {
        from: admin,
        value: 10000
      }),
      "ERC20: transfer amount exceeds allowance."
    );
  });

  it("reverts mint if curve not initialized", async () => {
    await expectRevert(
      automatedMarketMaker.mint({
        from: user,
        value: 1000
      }),
      "Reason given: Curve not initialized."
    );
  });

  it("reverts redeem if curve not initialized", async () => {
    await expectRevert(
      automatedMarketMaker.redeem(1, {
        from: user
      }),
      "Reason given: Curve not initialized."
    );
  });

  it("succesfully initializes when called by admin with non-zero reserves", async () => {
    await token.approve(automatedMarketMaker.address, initialAmount / 2, {
      from: admin
    });

    await automatedMarketMaker.initialize(initialAmount / 2, {
      from: admin,
      value: 10000
    });
    assert(
      (await automatedMarketMaker.etherReserve()).eq(ten.pow(new BN("4")))
    );
    assert(
      (await automatedMarketMaker.tokenReserve()).eq(
        new BN(initialAmount).div(new BN("2"))
      )
    );
    assert(
      (await automatedMarketMaker.reserveConstant()).eq(
        ten.pow(new BN("4")).mul(new BN(initialAmount).div(new BN("2")))
      )
    );
  });

  it("succesfully mints", async () => {
    await token.approve(automatedMarketMaker.address, initialAmount / 2, {
      from: admin
    });

    await automatedMarketMaker.initialize(initialAmount / 2, {
      from: admin,
      value: 100
    });
    await automatedMarketMaker.mint({
      from: user,
      value: ten
    });

    assert((await token.balanceOf(user)).eq(new BN("46")), "Bad mint output");

    assert(
      (await automatedMarketMaker.etherReserve()).eq(new BN("110")),
      "Bad ether reserve value."
    );
    assert(
      (await automatedMarketMaker.tokenReserve()).eq(new BN("454")),
      "Bad token reserve value."
    );
  });

  it("succesfully redeems", async () => {
    await token.approve(automatedMarketMaker.address, initialAmount / 2, {
      from: admin
    });

    await token.transfer(user, 100, { from: admin });

    await token.approve(automatedMarketMaker.address, 100, {
      from: user
    });

    await automatedMarketMaker.initialize(initialAmount / 2, {
      from: admin,
      value: ten.pow(new BN("2"))
    });

    const tx = await automatedMarketMaker.redeem(100, {
      from: user
    });

    expectEvent(tx, "Swap", {
      output: "17"
    });
  });
});
