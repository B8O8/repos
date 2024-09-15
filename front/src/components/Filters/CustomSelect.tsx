import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

export interface LabelsWithValues {
    label: string,
    value: string
}

interface Props {
    menuItems: LabelsWithValues[]
    label: string
    value: string
    name: string
    handleChange: (e: any) => void
}

function CustomSelect(props: Props) {
  const {menuItems, label, handleChange, value, name} = props;

  return (
    <FormControl fullWidth>
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        labelId={label}
        id="demo-simple-select"
        name={name}
        value={value}
        label="Age"
        onChange={handleChange}
      >
        {menuItems.map(item => (
            <MenuItem value={item.value}>{item.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CustomSelect;
