import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Explore({ web3, contract, accounts }) {
  const [deployedPools, setDeployedPools] = useState([]);

  useEffect(() => {
    contract.methods
      .getDeployedPools()
      .call()
      .then((res) => {
        setDeployedPools(res);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, []);

  const pools = deployedPools.map((pool) => {
    return (
      <Link address={pool} to={`/Explore/${pool}`}>
        <div>{pool}</div>
      </Link>
    );
  });

  return (
    <div>
      <h1>Explore</h1>
      {pools}
    </div>
  );
}
