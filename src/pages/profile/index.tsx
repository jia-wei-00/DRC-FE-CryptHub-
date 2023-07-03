import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import React from "react";
import "../../styles/pages/profile.scss";
import TransactionHistory from "./transaction-history";
import ResetPassword from "./reset-password";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Profile = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const matches = useMediaQuery("(min-width:1023px)");

  return (
    <Box className="profile-box">
      <Tabs
        orientation={matches ? "vertical" : "horizontal"}
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Transaction History" {...a11yProps(0)} />
        <Tab label="Reset Password" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <TransactionHistory />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ResetPassword />
      </TabPanel>
    </Box>
  );
};

export default Profile;
