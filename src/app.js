import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import * as EthereumInterface from "./ethereum/interface";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      etherReserve: "",
      tokenReserve: "",
      mintField: "",
      redeemField: ""
    };
  }

  onControlChange = async e => {
    await this.setState({ [e.target.id]: e.target.value });
  };

  onMint = async e => {
    const { activeAddress, mintField } = this.state;
    EthereumInterface.send(
      "SimpleBondingCurve",
      activeAddress,
      mintField,
      "mint"
    ).then(() => {
      this.queryBalances();
    });
  };

  onRedeem = async e => {
    const { activeAddress, redeemField } = this.state;

    await EthereumInterface.send(
      "SimpleBondingCurve",
      activeAddress,
      0,
      "redeem",
      redeemField
    ).then(() => {
      this.queryBalances();
    });
  };

  getReserveConstant = async () =>
    EthereumInterface.call("SimpleBondingCurve", "reserveConstant");
  getTokenSupply = async () =>
    EthereumInterface.call("DemoToken", "totalSupply");

  getEtherReserve = async () =>
    EthereumInterface.call("SimpleBondingCurve", "etherReserve");
  getTokenReserve = async () =>
    EthereumInterface.call("SimpleBondingCurve", "tokenReserve");

  getTokenBalance = async wallet =>
    EthereumInterface.call("DemoToken", "balanceOf", wallet);

  async queryBalances() {
    const etherReserve = await this.getEtherReserve();
    const tokenReserve = await this.getTokenReserve();
    const etherBalance = await EthereumInterface.etherBalance(
      this.state.activeAddress
    );

    const mintSuggestion =
      parseInt(etherReserve / 10) > etherBalance
        ? etherBalance / 10
        : parseInt(etherReserve / 10);

    this.setState({
      etherReserve: etherReserve,
      tokenReserve: await tokenReserve,
      tokenBalance: await this.getTokenBalance(this.state.activeAddress),
      etherBalance: etherBalance,
      reserveConstant: await this.getReserveConstant(),
      tokenSupply: await this.getTokenSupply(),
      mintField: mintSuggestion,
      redeemField: parseInt(tokenReserve / 10)
    });
  }

  async componentDidMount() {
    if (typeof window.ethereum !== "undefined") {
      await this.setState({ activeAddress: window.ethereum.selectedAddress });
      window.ethereum.on("accountsChanged", accounts => {
        this.setState({ activeAddress: accounts[0] });
      });
    } else console.error("MetaMask not detected :(");

    this.queryBalances();
  }

  render() {
    const {
      reserveConstant,
      tokenSupply,
      activeAddress,
      etherReserve,
      tokenReserve,
      tokenBalance,
      etherBalance,
      mintField,
      redeemField
    } = this.state;
    return (
      <>
        <header>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
            <div className="container">
              <a className="navbar-brand" href="/">
                Swap
              </a>

              <ul className="nav justify-content-end">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href={`https://kovan.etherscan.io/address/${activeAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex="-1"
                    aria-disabled="true"
                    style={{ color: "white" }}
                  >
                    {activeAddress &&
                      `${activeAddress.substr(0, 6)}...${activeAddress.substr(
                        -4
                      )}`}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <main className="container">
          <div className="mt-5 jumbotron">
            <h1 className="display-4">Hello, trader!</h1>
            <p className="lead">
              Here is a simple bonding curve implementation with no fee.
            </p>
            {(!activeAddress || !reserveConstant) && (
              <p>Switch to Kovan network with MetaMask to try it out.</p>
            )}
          </div>
          {activeAddress && reserveConstant && (
            <>
              <div>
                <h1>
                  Reserve Constant{" "}
                  <span className="badge badge-info">{reserveConstant}</span>
                </h1>
                <h1>
                  Token Supply{" "}
                  <span className="badge badge-info">{tokenSupply}</span>
                </h1>
                <h2>
                  Token Reserve{" "}
                  <span className="badge badge-success">{tokenReserve}</span>
                </h2>
                <h2>
                  Ether Reserve{" "}
                  <span className="badge badge-danger">{etherReserve}</span>
                </h2>
                <h2>
                  Your Token Balance{" "}
                  <span className="badge badge-success">{tokenBalance}</span>
                </h2>
                <h2>
                  Your Ether Balance{" "}
                  <span className="badge badge-danger">{etherBalance}</span>
                </h2>
              </div>
              <div className="row mt-5">
                <div className="col text-center">
                  <div className="input-group mb-3">
                    <input
                      id="redeemField"
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Token input"
                      aria-label="Recipient's username"
                      aria-describedby="button-addon2"
                      value={redeemField}
                      onChange={this.onControlChange}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={this.onRedeem}
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col text-center">
                  <div className="input-group mb-3">
                    <input
                      id="mintField"
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Ether input"
                      aria-label="Recipient's username"
                      aria-describedby="button-addon2"
                      value={mintField}
                      onChange={this.onControlChange}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={this.onMint}
                      >
                        Mint
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </>
    );
  }
}

export default App;
