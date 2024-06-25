import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectByYearProps {
  onSelectYear: (selectedYear: string) => void;
  selectedYear: string;
}

export const SelectByYear = ({
  onSelectYear,
  selectedYear,
}: SelectByYearProps) => {
  return (
    <Select value={selectedYear} onValueChange={onSelectYear}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a year" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="2020">2020</SelectItem>
          <SelectItem value="2021">2021</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
