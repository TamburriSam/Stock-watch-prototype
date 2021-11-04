import { useState } from "react";
import Indicator from "./Indicator";
import firebase from "firebase";
import dateFormat, { masks } from "dateformat";
import { useEffect } from "react";
import Container1 from "./Container1";
import DateTimePicker from "react-datetime-picker";
import DailyAverage from "./DailyAverage";

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

function Container(props) {
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "c60l812ad3ifmvvnm9og"; // Replace this
  const finnhubClient = new finnhub.DefaultApi();

  const [stockName, setStockName] = useState("");
  const [startTick, setStartTick] = useState(false);
  const [time, setCurrentTime] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [twoDayAgoPrice, setTwoDayAgoPrice] = useState("");
  const [count, setCount] = useState("");
  const [value, onChange] = useState(new Date());
  const [value2, onChange2] = useState(new Date());
  const [formattedValue, setformattedValue] = useState("");
  const [formattedValueEnd, setformattedValueEnd] = useState("");
  const [dailyAverage, setdailyAverage] = useState("");

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
    if (stockName !== "") {
      var today = value;
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      today = mm + "/" + dd + "/" + yyyy;

      setformattedValue(today);

      console.log(`value`, value);
      console.log(`formatted value`, today);
      console.log(`current time`, time);
      console.log(`current stockname`, stockName);

      db.collection("companies")
        .doc(stockName)
        .get()
        .then((doc) => {
          let dates = doc.data().date;

          console.log(dates);

          let item;
          if (dates.hasOwnProperty(today)) {
            item = dates[today];
            console.log(`date selected item from ${today}`, item);
          }
        });
    }
  }, [value]);

  useEffect(() => {
    if (time !== "") {
      console.log(stockName);
      console.log("ok");

      finnhubClient.quote(stockName.toUpperCase(), (error, data, response) => {
        //current price
        const shortDate = dateFormat(now, "paddedShortDate");

        console.log(time);

        setCurrentPrice(data.c);

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

  const submit = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  const handleChange = () => {
    //
    setStartTick(true);
    //
  };

  const DailyAverage = () => {
    db.collection("companies")
      .doc(stockName)
      .get()
      .then((doc) => {
        let dates = doc.data().date;

        console.log(dates);

        let item;
        if (dates.hasOwnProperty(formattedValue)) {
          item = dates[formattedValue];
          console.log(`date selected item from ${formattedValue}`, item);
        }

        console.log(item);

        let itemArr = Object.entries(item);

        console.log(itemArr);

        let allNums = [];

        itemArr.forEach((item) => {
          allNums.push(item[1].value);
        });

        console.log(allNums);

        let average = allNums.reduce((a, b) => a + b, 0) / allNums.length;

        //error here not sure why
        /*         setdailyAverage(average.toString());
         */
      });
  };

  const RangeAverage = () => {
    db.collection("companies")
      .doc(stockName)
      .get()
      .then((doc) => {
        let dates = doc.data().date;

        console.log(dates);

        let item;
        if (dates.hasOwnProperty(formattedValue)) {
          item = dates[formattedValue];
          console.log(`date selected item from ${formattedValue}`, item);
        }

        console.log(item);

        let itemArr = Object.entries(item);

        console.log(itemArr);

        let allNums = [];

        itemArr.forEach((item) => {
          allNums.push(item[1].value);
        });

        console.log(allNums);

        let average = allNums.reduce((a, b) => a + b, 0) / allNums.length;
        console.log(average);
      });
  };

  //quick styles
  const divStyle = {
    border: "2px solid blue",
  };

  return (
    <div style={divStyle}>
      <button onClick={submit}>Sign in with Google</button>

      <h2>{time}</h2>

      <h2 style={{ position: "absolute", right: "0" }}>{dailyAverage}</h2>

      <Indicator stockName={stockName} />
      <p>{currentPrice}</p>
      <input placeholder='Stock Symbol' onChange={(e) => setStock(e)}></input>
      <button onClick={handleChange}>Submit</button>
      <br></br>
      <h3>Date Range 1 (Start)</h3>
      <DateTimePicker onChange={onChange} value={value} />
      <br></br>
      <h3>Date Range 2 (End)</h3>
      <DateTimePicker onChange={onChange2} value={value2} />
      <br></br>
      <button>Low Average by Range </button>
      <button>High Average by Range</button>
      <br></br>
      <button onClick={DailyAverage}>Daily Average</button>
      <button onClick={RangeAverage}>Range Average</button>
      <button>Average by time (range)</button>
      <button>Average by time (all time)</button>
    </div>
  );
}

export default Container;
