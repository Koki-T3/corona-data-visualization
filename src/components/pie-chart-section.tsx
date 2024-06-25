import { ResponsivePie } from "@nivo/pie";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { weekdayNames } from "../lib/weekdays";
import { SelectByYear } from "./ui/select-by-year";
import { SelectByMonth } from "./ui/select-by-month";
import { SelectByGroup } from "./ui/select-by-group";
import { Loader2 } from "lucide-react";
import { RawDataItem } from "./ui/calendar";

interface ProcessedDataProps {
  x: string;
  y: number;
}

const PieChartSection = () => {
  const [data, setData] = useState<ProcessedDataProps[]>([]);
  const [groupBy, setGroupBy] = useState("day");
  const [year, setYear] = useState("2020");
  const [month, setMonth] = useState<string | null>(null);

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

  const processData = (data: RawDataItem[], groupBy: string) => {
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

  useEffect(() => {
    if (nums) {
      const processedData = processData(nums, month ? groupBy : "month");
      setData(processedData);
    }
  }, [nums, groupBy, month]);

  const handleSelectYear = (selectedYear: string) => {
    setYear(selectedYear);
    setMonth(null);
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

  const dataBy = data.map((data) => ({
    id: data.x,
    label: data.x,
    value: data.y,
    color: "hsl(56, 70%, 50%)",
  }));

  return (
    <div className="h-[90vh]">
      {isLoading ? (
        <div className="h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      ) : (
        <ResponsivePie
          data={dataBy}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: "ruby",
              },
              id: "dots",
            },
            {
              match: {
                id: "c",
              },
              id: "dots",
            },
            {
              match: {
                id: "go",
              },
              id: "dots",
            },
            {
              match: {
                id: "python",
              },
              id: "dots",
            },
            {
              match: {
                id: "scala",
              },
              id: "lines",
            },
            {
              match: {
                id: "lisp",
              },
              id: "lines",
            },
            {
              match: {
                id: "elixir",
              },
              id: "lines",
            },
            {
              match: {
                id: "javascript",
              },
              id: "lines",
            },
          ]}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                  },
                },
              ],
            },
          ]}
        />
      )}
      <div className="flex gap-x-3">
        <SelectByYear selectedYear={year} onSelectYear={handleSelectYear} />
        {year && (
          <SelectByMonth
            selectedMonth={month ?? undefined}
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
    </div>
  );
};

export default PieChartSection;
