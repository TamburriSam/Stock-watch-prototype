import { useEffect, useState } from "react";

function DailyAverage({ passDown, props }) {
  return (
    <div>
      <button onClick={passDown}>Average</button>
      {props.formattedValue}
    </div>
  );
}

export default DailyAverage;
