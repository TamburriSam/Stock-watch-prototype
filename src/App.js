import { useEffect, useState } from "react";
import "./App.css";
import Container from "./components/Container";
import firebase from "firebase";
import Button from "@mui/material/Button";

import { GiReceiveMoney } from "react-icons/gi";

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
//PSEUDOCODE

//I want to be able to enter a stock and add it to my "tracking" arsenal.

//Once the stock is entered in the input
//enter the stock name into the db
//record the date and time and value
//run a funciton on an interval of 5 minutes that takes the stockname and plugs it into the finhubClient API  and records the current quote data
//
//eventually get a service worker to run program offline
const firebaseConfig = {
  apiKey: "AIzaSyDniJDNDWsdTyKcBBPf8MzaghGUVE6Mfeo",
  authDomain: "stock-track-76e74.firebaseapp.com",
  projectId: "stock-track-76e74",
  storageBucket: "stock-track-76e74.appspot.com",
  messagingSenderId: "623608527796",
  appId: "1:623608527796:web:897fd73dcccd304b1250e1",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
function App() {
  const [panels, setpanels] = useState(0);
  const [signedIn, setsignedIn] = useState(false);
  const [signInStatus, settsignInStatus] = useState("Sign in with Google");
  let lsItem = localStorage.getItem("loggedIn");
  let screenName = localStorage.getItem("username");
  console.log(auth.currentUser);

  useEffect(() => {
    console.log(signedIn);
    if (lsItem) {
      settsignInStatus(`Signed In as ${screenName}`);
    }
  }, []);

  const submit = () => {
    auth
      .signInWithPopup(provider)
      .catch(alert)
      .then(() => {
        localStorage.setItem("loggedIn", true);
        setsignedIn(true);
        localStorage.setItem("username", auth.currentUser.displayName);

        settsignInStatus(`Signed In as ${auth.currentUser.displayName}`);

        console.log(auth.currentUser);
      });
  };

  return (
    <div>
      <div id='Nav'>
        <GiReceiveMoney />

        <h1 id='title'>Divitia</h1>
        <h2 id='subtitle'>Stock & Crypto Tracker</h2>
      </div>
      <Button variant='outlined' onClick={submit} id='googleSignIn'>
        {signInStatus}
      </Button>

      <Button
        variant='outlined'
        onClick={() => {
          setpanels(panels + 1);
          console.log(panels);
        }}
      >
        Add Stock Tile
      </Button>

      <Container />

      {Array.from({ length: panels }, (_, index) => (
        <Container key={index} />
      ))}
    </div>
  );
}

export default App;
