import React from "react";
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

const SelectByGroup = ({
  selectedGroup,
  onSelectGroup,
}: SelectByGroupProps) => {
  return (
    <Select value={selectedGroup} onValueChange={onSelectGroup}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>{selectedGroup}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="weekday">Weekday</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectByGroup;
