import { useState, useEffect } from "react";
import firebase from "firebase";

function Cli() {
  const db = firebase.firestore();

  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    db.collection("companies").onSnapshot((snapshot) => {
      setNodes(snapshot.docs);
      setLoading(false);
    });
  };

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }
  //for each object
  //u need another component
  //that iterates through node.id
  //an object of objects
  //this is where ur stuck
  return (
    <div style={{ marginTop: "100px" }}>
      {nodes.map((node, index) => {
        return (
          <div>
            {/* test db loader */}
            <h1 style={{ fontSize: "8px" }}>{node.id}</h1>
          </div>
        );
      })}
    </div>
  );
}

export default Cli;
