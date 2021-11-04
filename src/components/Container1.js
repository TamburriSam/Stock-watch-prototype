import { useState } from "react";
import Indicator from "./Indicator";
import firebase from "firebase";
import dateFormat, { masks } from "dateformat";
import { useEffect } from "react";
import { tickerDetails } from "@polygon.io/client-js/lib/rest/reference/tickerDetails";
const finnhub = require("finnhub");
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
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();
const now = new Date();

function Container1() {
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "c60l812ad3ifmvvnm9og"; // Replace this
  const finnhubClient = new finnhub.DefaultApi();

  const [stockName, setStockName] = useState("");
  const [startTick, setStartTick] = useState(false);
  const [time, setCurrentTime] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [twoDayAgoPrice, setTwoDayAgoPrice] = useState("");
  const [count, setCount] = useState("");

  useEffect(() => {
    if (startTick) {
      const timeoutID = window.setInterval(() => {
        let date = new Date();

        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes.toString().padStart(2, "0");
        let strTime = hours + ":" + minutes + " " + ampm;
        setCurrentTime(strTime);
      }, 2000);

      return () => window.clearInterval(timeoutID);
    }
  }, [startTick]);

  useEffect(() => {
    if (time !== "") {
      console.log(stockName);
      console.log("ok");

      finnhubClient.quote(stockName.toUpperCase(), (error, data, response) => {
        //current price
        const shortDate = dateFormat(now, "paddedShortDate");

        console.log(time);

        const quoteData = {
          [shortDate]: {
            [time]: {
              value: data.c,
            },
          },
        };

        let roomRef = db.collection("companies").doc(stockName);

        return roomRef
          .set(
            {
              date: quoteData,
            },
            { merge: true }
          )
          .then(() => {
            console.log(quoteData);
          });
      });
    }
  }, [time]);

  const setStock = (e) => {
    setStockName(e.target.value);
  };

  const handleChange = () => {
    //
    setStartTick(true);
    //
  };

  return (
    <div>
      <Indicator stockName={stockName} />
      <p>{time}</p>
      <input onChange={(e) => setStock(e)}></input>
      <button onClick={handleChange}>Submit</button>
    </div>
  );
}

export default Container1;
