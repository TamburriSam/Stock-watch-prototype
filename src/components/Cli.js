import { useState, useEffect } from "react";
import firebase from "firebase";
import LoadedContainer from "./LoadedContainer";
function Cli() {
  const db = firebase.firestore();

  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (nodes) {
      let mappedNodes = Object.entries(nodes);
      console.log(nodes);
    }
  }, []);

  const getData = () => {
    db.collection("companies").onSnapshot((snapshot) => {
      let arr = [];

      snapshot.docs.map((doc) => {
        arr.push(doc.data());
      });

      setNodes(arr);

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

  /*   console.log(mappedNodes);
   */ return (
    <div style={{ marginTop: "20px" }}>
      {nodes.map((node, index) => {
        return (
          <div key={index + 1} style={{ position: "relative", top: "600px" }}>
            {console.log(node.current_price, node.Symbol)}
            {/*    {console.log(node.data.id)}
            {console.log(Object.entries(nodes))} */}
            <LoadedContainer
              key={index + 1}
              id={node.Symbol}
              currentPrice={node.current_price}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Cli;
