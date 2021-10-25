import React, { useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import PoolFactoryContract from "./contracts/PoolFactory.json";
import PoolContract from "./contracts/Pool.json";
import { Route, BrowserRouter as Router, Link, Switch } from "react-router-dom";
import Home from "./pages/Home";
import PoolCreation from "./pages/PoolCreation";
import PoolDetail from "./pages/PoolDetail";
import Explore from "./pages/Explore";
import Authentication from "./pages/Authentication";
import PoolFactoryContractInstance from "./contractInstances/PoolFactoryInstance";

export default function App() {
  const [contract, setContract] = useState(null);
  const [poolContract, setPoolContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [deployedNetwork, setDeployedNetwork] = useState(null);

  useEffect(async () => {
    try {
      const web3 = await getWeb3();
      setWeb3(web3);
      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PoolFactoryContract.networks[networkId];

      setDeployedNetwork(deployedNetwork);
      const instance = new web3.eth.Contract(
        PoolFactoryContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      setContract(instance);
      setAccounts(accounts);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home web3={web3} contract={contract} accounts={accounts} />
          </Route>

          <Route path="/Authentication">
            <Authentication
              web3={web3}
              contract={contract}
              accounts={accounts}
            />
          </Route>

          <Route path="/Create">
            <PoolCreation web3={web3} contract={contract} accounts={accounts} />
          </Route>

          <Route path="/Explore/:address">
            <PoolDetail
              web3={web3}
              networkId={networkId}
              deployedNetwork={deployedNetwork}
              contract={contract}
              poolContract={poolContract}
              accounts={accounts}
            />
          </Route>

          <Route path="/Explore">
            <Explore web3={web3} contract={contract} accounts={accounts} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
