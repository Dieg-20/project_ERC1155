import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PoolContract from "../contracts/Pool.json";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import axios from "axios";

export default function PoolDetail({
  web3,
  networkId,
  deployedNetwork,
  contract,
  accounts,
}) {
  const [poolContract, setPoolContract] = useState(null);
  const [theInstance, setTheInstance] = useState(null);
  const [poolName, setPoolName] = useState("");
  const [poolManager, setPoolManager] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenCount, setTokenCount] = useState("");
  const [purchaseAmmount, setPurchaseAmount] = useState("");
  const [poolBalance, setPoolBalance] = useState("");
  const { address } = useParams();

  useEffect(async () => {
    try {
      const deployedNetwork = {};
      const poolContractInstance = new web3.eth.Contract(
        PoolContract.abi,
        deployedNetwork && address
      );
      setPoolContract(poolContractInstance);
      getSummary(poolContractInstance);
    } catch (error) {
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  }, []);

  const getManagersBalance = async (passedInstance, poolManagerAddress) => {
    passedInstance.methods
      .getAccountTokenBalance(accounts[0], 0)
      .call()
      .then((res) => {
        setPoolBalance(res);
        console.log("res:", res);
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  const getSummary = (passedInstance) => {
    passedInstance.methods
      .getSummary()
      .call()
      .then((res) => {
        setPoolName(res[0]);
        setTokenCount(res[1]);
        setPoolManager(res[2]);
        getManagersBalance(passedInstance, res[2]);
      })
      .catch((err) => {
        console.log("error getting summary:", err);
      });
  };

  const initializePurchase = () => {
    poolContract.methods
      .transferToken(purchaseAmmount)
      .send({ from: accounts[0], value: web3.utils.toWei("1", "ether") })
      .then(() => {
        setPurchaseAmount("");
        console.log("succesful transfer");
      })
      .catch((err) => {
        console.log("transfer failed:", err);
      });
  };

  const initializeCashOut = () => {
    poolContract.methods
      .cashOut()
      .then(() => {
        console.log("succesful cash out");
      })
      .catch((err) => {
        console.log("error: unable to cash out:", err);
      });
  };

  if (true) {
    return (
      <div>
        <h1>{poolName}</h1>
        {address}
        <div>Count: {tokenCount}</div>
        <div>Balance: {poolBalance}</div>

        <input
          onChange={(e) => {
            setPurchaseAmount(e.target.value);
          }}
        />
        <button
          onClick={() => {
            initializePurchase();
          }}
        >
          Buy
        </button>

        {accounts[0] === poolManager ? (
          <button
            onClick={(e) => {
              initializeCashOut();
            }}
          >
            Cash out
          </button>
        ) : (
          <div>No:{poolManager}</div>
        )}
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
