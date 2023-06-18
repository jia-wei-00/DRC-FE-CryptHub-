import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { apiStore } from "../../stores";

interface ActionProps {
  currency: string;
  setcurrency: React.Dispatch<React.SetStateAction<string>>;
}

const Action: React.FC<ActionProps> = ({ currency, setcurrency }) => {
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">
          Currency
        </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={currency}
          onChange={(e) => {
            setcurrency(e.target.value);
            apiStore.unsubscribeTicks(currency);
            apiStore.resetData();
          }}
          autoWidth
          label="Currency"
        >
          <MenuItem value="cryBTCUSD">cryBTCUSD</MenuItem>
          <MenuItem value="cryETHUSD">cryETHUSD</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default Action;
