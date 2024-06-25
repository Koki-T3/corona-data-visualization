import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";

interface SelectByGroupProps {
  selectedGroup: string;
  onSelectGroup: (selectedGroup: string) => void;
}

export const SelectByGroup = ({
  selectedGroup,
  onSelectGroup,
}: SelectByGroupProps) => {
  return (
    <Select value={selectedGroup} onValueChange={onSelectGroup}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          {selectedGroup === "day" ? "日にち毎" : "曜日毎"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="day">日にち毎</SelectItem>
          <SelectItem value="weekday">曜日毎</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
