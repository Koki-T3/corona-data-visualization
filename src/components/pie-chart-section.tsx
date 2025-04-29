import { ResponsivePie } from "@nivo/pie";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { weekdayNames } from "../lib/weekdays";
import { SelectByYear } from "./ui/select-by-year";
import { SelectByMonth } from "./ui/select-by-month";
import { SelectByGroup } from "./ui/select-by-group";
import { Loader2 } from "lucide-react";
import { RawDataItem } from "./ui/calendar";

const PieChartSection = () => {
  const [groupBy, setGroupBy] = useState("day");
  const [year, setYear] = useState("2020");
  const [month, setMonth] = useState<string | null>(null);

  const fetchDataByPeriod = async (from: string, till: string) => {
    const response = await fetch(
      `https://api.data.metro.tokyo.lg.jp/v1/Covid19CallCenter?from=${from}&till=${till}&limit=1000`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data[0];
  };

  const getPeriod = () => {
    if (month) {
      const paddedMonth = month.padStart(2, "0");
      const from = `${year}-${paddedMonth}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      const till = `${year}-${paddedMonth}-${lastDay}`;
      return { from, till };
    } else {
      return { from: `${year}-01-01`, till: `${year}-12-31` };
    }
  };

  const { data: nums, isLoading } = useQuery({
    queryKey: month ? ["num", year, month] : ["num", year],
    queryFn: async () => {
      const { from, till } = getPeriod();
      return await fetchDataByPeriod(from, till);
    },
    staleTime: 5 * 60 * 1000,
  });

  const processData = (data: RawDataItem[], groupBy: string) => {
    const grouped = new Map<string, number>();

    data.forEach((item) => {
      const date = new Date(item["受付_年月日"]);
      let key = "";

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

      grouped.set(key, (grouped.get(key) ?? 0) + item["相談件数"]);
    });

    return Array.from(grouped.entries()).map(([x, y]) => ({ x, y }));
  };

  const processedData = useMemo(() => {
    if (!nums) return [];
    return processData(nums, month ? groupBy : "month");
  }, [nums, groupBy, month]);

  const colorScale = [
    "hsl(56, 70%, 50%)",
    "hsl(120, 70%, 50%)",
    "hsl(200, 70%, 50%)",
    "hsl(300, 70%, 50%)",
    "hsl(20, 70%, 50%)",
    "hsl(180, 70%, 50%)",
    "hsl(260, 70%, 50%)",
    "hsl(340, 70%, 50%)",
  ];

  const dataBy = useMemo(() => {
    return processedData.map((item, index) => ({
      id: item.x,
      label: item.x,
      value: item.y,
      color: colorScale[index % colorScale.length],
    }));
  }, [processedData]);

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
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              translateY: 56,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              symbolSize: 18,
              symbolShape: "circle",
              effects: [{ on: "hover", style: { itemTextColor: "#000" } }],
            },
          ]}
        />
      )}
      <div className="flex gap-x-3">
        <div className="ml-3">
          <SelectByYear selectedYear={year} onSelectYear={handleSelectYear} />
        </div>
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
