import { useState } from "react";
import Indicator from "./Indicator";
import firebase from "firebase";
/* import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; */
/* import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite"; */

const finnhub = require("finnhub");
var yahooFinance = require("yahoo-finance");

const firebaseConfig = {
  apiKey: "AIzaSyDniJDNDWsdTyKcBBPf8MzaghGUVE6Mfeo",
  authDomain: "stock-track-76e74.firebaseapp.com",
  projectId: "stock-track-76e74",
  storageBucket: "stock-track-76e74.appspot.com",
  messagingSenderId: "623608527796",
  appId: "1:623608527796:web:897fd73dcccd304b1250e1",
};

// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
var auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider();

function Container() {
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "c60l812ad3ifmvvnm9og"; // Replace this
  const finnhubClient = new finnhub.DefaultApi();

  let arr = [];

  const [stockName, setStockName] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [twoDayAgoPrice, setTwoDayAgoPrice] = useState("");

  const setStock = (e) => {
    setStockName(e.target.value);
  };

  const handleChange = () => {
    setInterval(() => {
      finnhubClient.quote(stockName.toUpperCase(), (error, data, response) => {
        //current price
        console.log(data);
        console.log(`current price`, data.c);

        console.log(arr);

        setCurrentPrice(data.c);

        arr.push(data.c);
      });
      console.log(arr);
    }, 5000);
    console.log("o");
  };

  /* const test = () => {
    db.collection("values")
      .doc("value")
      .set({
        value: "sam",
      })
      .then(function () {
        console.log("Value successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing Value: ", error);
      });
  }; */
  const submit = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <div>
      <Indicator stockName={stockName} />
      <input onChange={(e) => setStock(e)}></input>
      <button onClick={handleChange}>Submit</button>
      {/*       <button onClick={test}>ttest</button>
       */}{" "}
    </div>
  );
}

export default Container;
