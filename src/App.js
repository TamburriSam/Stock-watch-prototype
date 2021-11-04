import { useState } from "react";
import "./App.css";
import Container from "./components/Container";

//PSEUDOCODE

//I want to be able to enter a stock and add it to my "tracking" arsenal.

//Once the stock is entered in the input
//enter the stock name into the db
//record the date and time and value
//run a funciton on an interval of 5 minutes that takes the stockname and plugs it into the finhubClient API  and records the current quote data
//
//eventually get a service worker to run program offline

function App() {
  const [panels, setpanels] = useState(0);

  return (
    <div className='App'>
      <h1 style={{ textAlign: "center" }}>Divitia</h1>
      <h2 style={{ textAlign: "center" }}>Stock Tracker</h2>
      <button
        onClick={() => {
          setpanels(panels + 1);
          console.log(panels);
        }}
      >
        Add Stock Tile
      </button>

      <Container />

      {Array.from({ length: panels }, (_, index) => (
        <Container key={index} />
      ))}
    </div>
  );
}

export default App;
