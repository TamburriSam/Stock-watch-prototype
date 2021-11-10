import firebase from "firebase";
import { useState } from "react";
import Indicator from "./Indicator";
import dateFormat, { masks } from "dateformat";
import { useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LoadedContainer from "./LoadedContainer";
import "./Font.css";
import App from "../App";

function Container(props) {
  const finnhub = require("finnhub");
  const db = firebase.firestore();
  const now = new Date();
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "c60l812ad3ifmvvnm9og"; // Replace this
  const finnhubClient = new finnhub.DefaultApi();

  const [stockName, setStockName] = useState("");
  const [startTick, setStartTick] = useState(false);
  const [time, setCurrentTime] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [twoDayAgoPrice, setTwoDayAgoPrice] = useState("");
  const [count, setCount] = useState("");
  const [value, onChange] = useState();
  const [value2, onChange2] = useState();
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
        console.log(strTime);
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
    console.log(time);
    if (time !== "") {
      console.log(stockName);
      console.log("ok");
      let priceNow;

      finnhubClient.quote(stockName.toUpperCase(), (error, data, response) => {
        //current price
        const shortDate = dateFormat(now, "paddedShortDate");

        console.log(time);

        setCurrentPrice(data.c);
        priceNow = data.c;

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
            roomRef.update("current_price", priceNow);
            roomRef.update("Symbol", stockName);
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
        console.log(average);
        setdailyAverage(average);
        //////////////////////////
        //error here not sure why
        //because u need to use the date picker first than calc daily avg
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
    border: "1px solid #d7ecff",
    width: "83vw",
    position: "relative",
    margin: "auto",
    borderRadius: "15px",
    padding: "10px",
    marginTop: "30px",
    marginBottom: "30px",
    boxShadow: "0px 3px 12px 1px #d7ecff",
  };

  //CAN USE CLOUD FUNCTIONS FOR WHEN ITS CONSIDERED A GOOD TIME TO BUY A PHONE
  //LIKE SEND A TEXT MSG OR EMAIL OR NOTIFICATION

  return (
    <div className='container' style={divStyle}>
      <h2>{time}</h2>

      <h3 style={{ position: "absolute", right: "10px" }}>
        Daily Average: {dailyAverage}
      </h3>

      <Indicator stockName={stockName} />
      <h3>Current Price: {currentPrice}</h3>
      <TextField
        id='outlined-basic'
        label='Stock Symbol'
        variant='outlined'
        onChange={(e) => setStock(e)}
      />
      <br></br>
      <Button variant='outlined' onClick={handleChange}>
        Submit
      </Button>
    </div>
  );
}

export default Container;
