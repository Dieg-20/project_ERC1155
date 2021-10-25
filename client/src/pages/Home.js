import React from "react";
import { useHistory } from "react-router-dom";

export default function Home({ web3, contract, accounts }) {
  const history = useHistory();

  const redirectToCreate = () => {
    history.push("/Authentication");
  };

  const redirectToExplore = () => {
    history.push("/Explore");
  };

  return (
    <div>
      Home
      <div>
        <button
          onClick={() => {
            redirectToCreate();
          }}
        >
          Create
        </button>
        <button
          onClick={() => {
            redirectToExplore();
          }}
        >
          Explore
        </button>
      </div>
    </div>
  );
}
