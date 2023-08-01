import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { observer } from "mobx-react-lite";
import { historyStore, loadingStore } from "../../stores";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { WalletHistoryT, WalletHistoryColumn } from "../../types";
import dayjs, { Dayjs } from "dayjs";
import { Typography } from "@mui/material";
import { Loading } from "../../components";

const columns: readonly WalletHistoryColumn[] = [
  { id: "type", label: "Type", minWidth: 100 },
  {
    id: "before",
    label: "Before (USD)",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "after",
    label: "After (USD)",
    minWidth: 170,
    align: "right",
    format: (value: number) =>
      value.toLocaleString("en-US", { maximumFractionDigits: 20 }),
  },
  {
    id: "amount",
    label: "Transaction Amount (USD)",
    minWidth: 170,
    align: "right",
    format: (value: number) =>
      value.toLocaleString("en-US", { maximumFractionDigits: 20 }),
  },
  {
    id: "created_at",
    label: "Date",
    minWidth: 170,
    align: "right",
    format: (value: number) => {
      const date = dayjs.unix(value).format("YYYY/MM/DD h:mm:ss A");
      return date.toLocaleString();
    },
  },
];

function WalletHistory() {
  const [fromDate, setFromDate] = React.useState<Dayjs>(
    dayjs().startOf("day").subtract(30, "day")
  );
  const [toDate, setToDate] = React.useState<Dayjs>(dayjs().endOf("day"));

  React.useEffect(() => {
    historyStore.fetchWalletHistory();
  }, []);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="date">
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(date) => setFromDate(dayjs(date).startOf("day"))}
          />
          <DatePicker
            label="To"
            value={toDate}
            onChange={(date) => setToDate(dayjs(date).endOf("day"))}
          />
        </div>
      </LocalizationProvider>
      <Paper>
        <TableContainer className="table-container">
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingStore.history_loading ? (
                <TableRow className="absolute-middle">
                  <TableCell>
                    <Loading height={"30px"} width={"30px"} />
                  </TableCell>
                </TableRow>
              ) : historyStore.wallet_history.length > 0 ? (
                historyStore.wallet_history
                  .filter(
                    (transaction: WalletHistoryT) =>
                      (transaction.created_at as number) >= fromDate.unix() &&
                      (transaction.created_at as number) <= toDate.unix()
                  )
                  .map((row: WalletHistoryT, index: number) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>{index + 1}</TableCell>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow className="absolute-middle">
                  <TableCell>
                    <Typography>No Data</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default observer(WalletHistory);
