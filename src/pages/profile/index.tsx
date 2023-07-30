import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import React from "react";
import "../../styles/pages/profile.scss";
import TransactionHistory from "./transaction-history";
import ResetPasswordForm from "./reset-password";
import WalletHistoryT from "./wallet-history";
import P2PHistory from "./p2p-history";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../stores";
import { observer } from "mobx-react-lite";

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
      className="tabpanel"
    >
      {value === index && (
        <Box sx={{ p: 3 }} className="tab-box">
          {children}
        </Box>
      )}
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
  const [value, setValue] = React.useState<number>(0);
  const [resetPassword, setResetPassword] = React.useState<boolean>(false);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const matches = useMediaQuery("(min-width:1023px)");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (authStore.user === null) {
      navigate("/");
    }
  }, [authStore.user]);

  return (
    <Box className="profile-box">
      <Tabs
        orientation={matches ? "vertical" : "horizontal"}
        value={value}
        onChange={handleChange}
        aria-label="vertial_tabs_table"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Transaction History" {...a11yProps(0)} />
        <Tab label="Wallet History" {...a11yProps(1)} />
        <Tab label="P2P Completed History" {...a11yProps(2)} />
        <Tab
          label="Reset Password"
          onClick={() => setResetPassword(!resetPassword)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        {<TransactionHistory />}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <WalletHistoryT />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <P2PHistory />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ResetPasswordForm />
      </TabPanel>
    </Box>
  );
};

export default observer(Profile);
