import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../../lib/utils";
import { buttonVariants } from "../../components/ui/button";
import { ja } from "date-fns/locale";
import CustomDayContent from "./custom-day-content";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  // 一月分のデータだけ最初に取得し、渡す
  const [data, setData] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);

  // const numOfConsultations = data[0]

  const fetchData = async (from, till) => {
    try {
      // 月が変わるたびにapi requestをして１ヶ月分だけのデータを取得し、そのdataをDayContentに渡す
      const response = await fetch(
        `https://api.data.metro.tokyo.lg.jp/v1/Covid19CallCenter?from=${from}&till=${till}&limit=1000`
      );

      // const response = await fetch(
      //   "https://api.data.metro.tokyo.lg.jp/v1/Covid19CallCenter?from=2020-01-01&till=2020-12-31&limit=1000"
      // );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setData(data[0]);
      setMounted(true);
      return data[0];
      // console.log(data[0][0]["相談件数"]);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      // setError(error);
      // setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchAllData = async () => {
      const data2020 = await fetchData("2020-01-01", "2020-12-31");
      const data2021 = await fetchData("2021-01-01", "2021-12-31");
      const data2022 = await fetchData("2022-01-01", "2022-12-31");
      const allData = [...data2020, ...data2021, ...data2022];

      setData(allData);
    };

    fetchAllData();
  }, []);

  return (
    <>
      {mounted && (
        <DayPicker
          locale={ja}
          defaultMonth={new Date(2019, 12)}
          fromYear={2020}
          toYear={2022}
          showOutsideDays={showOutsideDays}
          className={cn("p-3", className)}
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 disabled:opacity-20"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
            ),
            day_range_end: "day-range-end",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside:
              "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
            DayContent: ({ ...props }) => (
              <CustomDayContent {...props} data={data} />
            ),
          }}
          {...props}
        />
      )}
    </>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
