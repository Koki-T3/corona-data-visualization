import React from "react";
import { Calendar } from "./ui/calendar";

const CalendarSection = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex justify-center items-center h-screen">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </div>
  );
};

export default CalendarSection;
