import { useState } from "react";
import Indicator from "./Indicator";
import firebase from "firebase";
import dateFormat, { masks } from "dateformat";
import { useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./Font.css";

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

function LoadedContainer(props) {
  const finnhub = require("finnhub");
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "c60l812ad3ifmvvnm9og"; // Replace this
  const finnhubClient = new finnhub.DefaultApi();
  const db = firebase.firestore();
  const now = new Date();

  const [value, onChange] = useState();
  const [value2, onChange2] = useState();
  const [dailyAverage, setdailyAverage] = useState("");
  const [formattedValue, setformattedValue] = useState("");
  const [startTick, setStartTick] = useState(false);
  const [stockName, setstockName] = useState(props.id);
  const [time, setCurrentTime] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  useEffect(() => {
    console.log(stockName);
    console.log(time);
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

      //ERROR HERE
      //IDK RN WHAT IT IS
      //ERROR HERE
      //ERROR HERE
      //ERROR HERE
      /*    var today = value;
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      today = mm + "/" + dd + "/" + yyyy;

      setformattedValue(today); */
    }, 2000);

    return () => window.clearInterval(timeoutID);
  }, []);

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

  return (
    <div className='container' style={divStyle}>
      <h2>{props.id}</h2>
      {/*       {setstockName(props.id)}
       */}{" "}
      <h2>{props.time}</h2>
      <h3 style={{ position: "absolute", right: "10px" }}>
        Daily Average: {props.currentPrice}
      </h3>
      {/*       <Indicator stockName={props.stockName} />
       */}{" "}
      <h3>Current Price: {props.currentPrice}</h3>
      {/*  PASS DOWN FROM CONTAINER   <TextField
        id='outlined-basic'
        label='Stock Symbol'
        variant='outlined'
        onChange={(e) => setStock(e)}
      /> */}
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
      <Button variant='outlined'>Average by time (all time)</Button> */}
    </div>
  );
}

export default LoadedContainer;
