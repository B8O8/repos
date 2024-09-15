import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

interface IOption {
  label: string;
  value: string;
}

interface IProps {
  selectedLevel: string;
  setSelectedLevel: Dispatch<SetStateAction<string>>;
  options: IOption[];
}

function LevelFilter({ selectedLevel, setSelectedLevel, options }: IProps) {
  return (
    <FormControl style={{width: '70%', marginRight: '15px'}}>
      <InputLabel id="level-label">Level</InputLabel>
      <Select
        labelId="level-label"
        id="level-select"
        value={selectedLevel}
        label="Age"
        onChange={(e) => setSelectedLevel(e.target.value as string)}
      >
        {options.map((option) => (
          <MenuItem value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LevelFilter;
