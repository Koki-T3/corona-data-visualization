import React from "react";
import { Calendar } from "./ui/calendar";

const CalendarSection = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </>
  );
};

export default CalendarSection;
