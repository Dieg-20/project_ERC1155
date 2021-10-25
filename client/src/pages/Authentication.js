import React from "react";
import { useHistory } from "react-router-dom";

export default function Authentication() {
  const history = useHistory();

  const redirectToCreate = () => {
    history.push("/Create");
  };

  return (
    <div>
      <button
        onClick={() => {
          redirectToCreate();
        }}
      >
        Connect
      </button>
    </div>
  );
}
