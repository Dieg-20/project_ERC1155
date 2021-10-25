import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "../css/form.css";
import { NFTStorage, File } from "nft.storage";

export default function PoolCreation({ web3, contract, accounts }) {
  const [poolName, setPoolName] = useState("");
  const [tokenCount, setTokenCount] = useState("");
  const [initialTokenPrice, setInitialTokenPrice] = useState("");
  const [poolImage, setPoolImage] = useState(null);
  const [poolImagePreview, setPoolImagePreview] = useState("");

  const client = new NFTStorage({
    token: "",
  });

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const intTokenCount = parseInt(tokenCount);

    await contract.methods
      .createPool(intTokenCount, poolName)
      .send({ from: accounts[0] });

    const deployedPools = await contract.methods.getDeployedPools().call();
    const lastPoolCreated = deployedPools[deployedPools.length - 1];

    setDoc(doc(db, "pools", lastPoolCreated), {
      poolName: poolName,
      tokenPrice: initialTokenPrice,
    })
      .then((res) => {
        history.push("/Explore");
        setPoolName("");
        setTokenCount("");
        setInitialTokenPrice("");
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };

  const deployImage = async (e) => {
    e.preventDefault();
    const metadata = await client.store({
      name: poolName,
      description: "description",
      image: new File([poolImage], poolName, { type: "image/jpg" }),
    });
  };

  return (
    <div class="container">
      <h1>Create your Pool</h1>
      <form>
        <div class="row">
          <div class="col-25">
            <label for="fname">Pool Name</label>
          </div>
          <div class="col-75">
            <input
              type="text"
              placeholder="Pool name.."
              onChange={(e) => {
                setPoolName(e.target.value);
              }}
            />
          </div>
        </div>
        <div class="row">
          <div class="col-25">
            <label for="lname">Last Name</label>
          </div>
          <div class="col-75">
            <input
              type="text"
              placeholder="Token count.."
              onChange={(e) => {
                setTokenCount(e.target.value);
              }}
            />
          </div>
        </div>

        <div class="row">
          <div class="col-25">
            <label for="subject">Description</label>
          </div>
          <div class="col-75">
            <textarea
              id="subject"
              name="subject"
              placeholder="Description..."
            ></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-25"></div>
          <div class="col-75">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPoolImage(file);
                }
              }}
            />
          </div>

          <div>
            <img src={poolImagePreview} />
          </div>
        </div>
        <div class="row">
          <input
            type="submit"
            value="Create"
            onClick={(e) => {
              deployImage(e);
            }}
          />
        </div>
      </form>
    </div>
  );
}
