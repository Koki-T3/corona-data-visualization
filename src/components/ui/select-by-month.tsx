import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";

interface SelectByMonthProps {
  selectedMonth: string | undefined;
  onSelectMonth: (selectedMonth: string) => void;
}

export const SelectByMonth = ({
  selectedMonth,
  onSelectMonth,
}: SelectByMonthProps) => {
  return (
    <Select value={selectedMonth} onValueChange={onSelectMonth}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          {selectedMonth ? `${selectedMonth}月` : "月を選択"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Array.from({ length: 12 }, (_, i) => (
            <SelectItem key={i + 1} value={(i + 1).toString()}>{`${
              i + 1
            }月`}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
