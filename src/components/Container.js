import { useState } from "react";
import Indicator from "./Indicator";
import firebase from "firebase";
import dateFormat, { masks } from "dateformat";
import { useEffect } from "react";
import Container1 from "./Container1";
import DateTimePicker from "react-datetime-picker";
import DailyAverage from "./DailyAverage";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import "./Font.css";
import Cli from "./Cli";

const finnhub = require("finnhub");

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
      <br></br>
      <h4>Date Range 1 (Start)</h4>
      <DateTimePicker onChange={onChange} value={value} />
      <br></br>
      <h4>Date Range 2 (End)</h4>
      <DateTimePicker onChange={onChange2} value={value2} />
      <br></br>
      <Button variant='outlined'>Low Average by Range </Button>
      <Button variant='outlined'>High Average by Range</Button>

      <br></br>
      <Button variant='outlined' onClick={DailyAverage}>
        Daily Average
      </Button>
      <Button variant='outlined' onClick={RangeAverage}>
        Range Average
      </Button>
      <Button variant='outlined'>Average by time (range)</Button>
      <Button variant='outlined'>Average by time (all time)</Button>
    </div>
  );
}

export default Container;
