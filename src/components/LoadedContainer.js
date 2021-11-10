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

  return (
    <div className='container' style={divStyle}>
      <h2>{props.id}</h2>
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
      {/*     <Button variant='outlined' onClick={handleChange}>
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
      <Button variant='outlined'>Average by time (all time)</Button> */}
    </div>
  );
}

export default LoadedContainer;
