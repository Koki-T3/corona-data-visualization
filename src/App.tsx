import { useQuery } from "@tanstack/react-query";
// import CalendarSection from "./components/calendar-section";
import LineChartSection from "./components/line-chart-section";
import { RawDataItem } from "./components/ui/calendar";
import { useEffect, useState } from "react";
import { SelectByYear } from "./components/ui/select-by-year";
import SelectByMonth from "./components/ui/select-by-month";
import SelectByGroup from "./components/ui/select-by-group";

interface ProcessedDataProps {
  x: string;
  y: number;
}

const weekdayNames = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
];

function App() {
  const [data, setData] = useState<ProcessedDataProps[]>([]);
  const [groupBy, setGroupBy] = useState("day");
  const [year, setYear] = useState("2020");
  const [month, setMonth] = useState<string | undefined>(undefined);

  const fetchData = async (from: string, till: string) => {
    try {
      const response = await fetch(
        `https://api.data.metro.tokyo.lg.jp/v1/Covid19CallCenter?from=${from}&till=${till}&limit=1000`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchAllData = async (): Promise<RawDataItem[]> => {
  //   try {
  //     const [data2020, data2021, data2022] = await Promise.all([
  //       fetchData("2020-01-01", "2020-12-31"),
  //       fetchData("2021-01-01", "2021-12-31"),
  //       fetchData("2022-01-01", "2022-12-31"),
  //     ]);

  //     const allData = [...data2020, ...data2021, ...data2022];
  //     return allData;
  //   } catch (error) {
  //     console.error("Error fetching all data:", error);
  //     throw Error("Error");
  //   }
  // };

  const fetchYearData = async (year: string) => {
    const from = `${year}-01-01`;
    const till = `${year}-12-31`;
    const fetchedData = await fetchData(from, till);
    return fetchedData;
  };

  const fetchMonthData = async (year: string, month: string) => {
    const from = `${year}-${month.padStart(2, "0")}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const till = `${year}-${month.padStart(2, "0")}-${lastDay}`;
    const fetchedData = await fetchData(from, till);
    return fetchedData;
  };

  const { data: nums, isLoading } = useQuery({
    queryFn: () => (month ? fetchMonthData(year, month) : fetchYearData(year)),
    queryKey: month ? ["num", year, month] : ["num", year],
  });

  const processData = (
    data: RawDataItem[],
    groupBy: string
  ): ProcessedDataProps[] => {
    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item["受付_年月日"]);
      let key: string;

      switch (groupBy) {
        case "month":
          key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        case "day":
          key = date.getDate().toString();
          break;
        case "weekday":
          key = weekdayNames[date.getDay()];
          break;
        default:
          key = date.toISOString();
      }

      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += item["相談件数"];
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(groupedData).map(([key, value]) => ({
      x: key,
      y: value,
    }));
  };

  // useEffect(() => {
  //   const getData = async () => {
  //     const fetchedData = await fetchData(from, till);
  //     const processedData = processData(fetchedData, groupBy);
  //     setData(processedData);
  //   };

  //   getData();
  // }, [from, till, groupBy]);

  useEffect(() => {
    if (nums) {
      const processedData = processData(nums, month ? groupBy : "month");
      setData(processedData);
    }
  }, [nums, groupBy, month]);

  const handleSelectYear = (selectedYear: string) => {
    setYear(selectedYear);
    setMonth(undefined);
  };

  const handleSelectMonth = (selectedMonth: string) => {
    setMonth(selectedMonth);
  };

  const handleSelectGroup = (selectedGroup: string) => {
    setGroupBy(selectedGroup);
  };

  if (!data) {
    return null;
  }

  const dataBy = [
    {
      id: "相談件数",
      color: "hsl(32, 70%, 50%)",
      data: data,
    },
  ];
  return (
    <>
      <div className="relative">
        {/* <CalendarSection /> */}
        <LineChartSection isLoading={isLoading} data={dataBy} />
        <SelectByYear selectedYear={year} onSelectYear={handleSelectYear} />
        {year && (
          <SelectByMonth
            selectedMonth={month}
            onSelectMonth={handleSelectMonth}
          />
        )}
        {month && (
          <SelectByGroup
            selectedGroup={groupBy}
            onSelectGroup={handleSelectGroup}
          />
        )}
      </div>
    </>
  );
}

export default App;
