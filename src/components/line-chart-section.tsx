import { ResponsiveLine } from "@nivo/line";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { RawDataItem } from "./ui/calendar";
import { SelectByMonth } from "./ui/select-by-month";
import { SelectByGroup } from "./ui/select-by-group";
import { SelectByYear } from "./ui/select-by-year";
import { weekdayNames } from "../lib/weekdays";

interface ProcessedDataProps {
  x: string;
  y: number;
}

const LineChartSection = () => {
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

  const dataBy = [
    {
      id: "相談件数",
      color: "hsl(32, 70%, 50%)",
      data: data,
    },
  ];
  return (
    <>
      <div className="relative h-[90vh]">
        {isLoading ? (
          <div className="h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        ) : (
          <ResponsiveLine
            data={dataBy}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "transportation",
              legendOffset: 36,
              legendPosition: "middle",
              truncateTickAt: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "相談件数",
              legendOffset: -40,
              legendPosition: "middle",
              truncateTickAt: 0,
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabel="data.yFormatted"
            pointLabelYOffset={-12}
            enableTouchCrosshair={true}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
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
    </>
  );
};

export default LineChartSection;
