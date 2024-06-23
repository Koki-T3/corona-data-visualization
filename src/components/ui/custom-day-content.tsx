import { getDate, getMonth, getYear } from "date-fns";
import { useState } from "react";
import { DayContentProps as OriginalDayContentProps } from "react-day-picker";

interface DayContentProps extends OriginalDayContentProps {
  data: any;
}

const CustomDayContent = (props: DayContentProps) => {
  const [data, setData] = useState(null);

  let numOfConsultations = 0;

  const targetYear = getYear(props.date);
  const targetMonth = getMonth(props.date) + 1;
  const targetDate = getDate(props.date);
  //   console.log("target year", targetYear);
  //   console.log("target month", targetMonth);
  //   console.log("target date", targetDate);

  //   props.data.forEach((data) => {
  //     console.log(getMonth(data["受付_年月日"]));
  //   });

  props.data.forEach((data) => {
    const date = data["受付_年月日"];
    const dataYear = getYear(date);
    const dataMonth = getMonth(date) + 1;
    const dataDay = getDate(date);

    // 年、月、日が一致するか比較
    if (
      targetYear === dataYear &&
      targetMonth === dataMonth &&
      targetDate === dataDay
    ) {
      console.log(data["相談件数"]);
      numOfConsultations = data["相談件数"];
    }
  });

  // If the date is the same as 受付_年月日, pass the date, otherwise null
  return (
    <span style={{ position: "relative", overflow: "visible" }}>
      {targetDate}
      {numOfConsultations ? (
        <div className="text-gray-400/80">{numOfConsultations}</div>
      ) : (
        <div className="text-gray-400/80">0</div>
      )}
      {/* {date}{" "}
      <div className="text-gray-400/80">{props.data[date - 1]["相談件数"]}</div> */}
    </span>
  );
};

export default CustomDayContent;
