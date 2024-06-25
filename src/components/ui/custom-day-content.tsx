import { getDate, getMonth, getYear } from "date-fns";
import { DayContentProps as OriginalDayContentProps } from "react-day-picker";
import { RawDataItem } from "./calendar";

interface DayContentProps extends OriginalDayContentProps {
  data: RawDataItem[];
}

const CustomDayContent = (props: DayContentProps) => {
  let numOfConsultations = 0;

  const targetYear = getYear(props.date);
  const targetMonth = getMonth(props.date) + 1;
  const targetDate = getDate(props.date);

  props.data.forEach((data) => {
    const date = data["受付_年月日"];
    const dataYear = getYear(date);
    const dataMonth = getMonth(date) + 1;
    const dataDay = getDate(date);

    if (
      targetYear === dataYear &&
      targetMonth === dataMonth &&
      targetDate === dataDay
    ) {
      numOfConsultations = data["相談件数"];
    }
  });
  return (
    <span style={{ position: "relative", overflow: "visible" }}>
      {targetDate}
      {numOfConsultations ? (
        <div className="text-gray-400/80">{numOfConsultations}</div>
      ) : (
        <div className="text-gray-400/80">0</div>
      )}
    </span>
  );
};

export default CustomDayContent;
