function Indicator(props) {
  const twoDayFormula = (x1, x2) => {
    //x1 stock market value two days ago
    //x2 stock market value now
    if (x1 > x2) {
      console.log("BUY");
    } else {
      console.log("HOLD");
    }
  };
  return (
    <div>
      <h1>{props.stockName.toUpperCase()}</h1>
    </div>
  );
}

export default Indicator;
