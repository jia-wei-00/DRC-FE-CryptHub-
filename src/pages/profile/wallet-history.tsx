import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { observer } from "mobx-react-lite";
import { authStore } from "../../stores";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { WalletHistoryT, WalletHistoryColumn } from "../../types";
import dayjs, { Dayjs } from "dayjs";

const columns: readonly WalletHistoryColumn[] = [
  // { id: "id", label: "No", minWidth: 170 },
  { id: "dwt_type", label: "Type", minWidth: 100 },
  {
    id: "dwt_before",
    label: "Before",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) => value.toLocaleString("en-US"),
  },
  {
    id: "dwt_after",
    label: "After",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) =>
      value.toLocaleString("en-US", { maximumFractionDigits: 20 }),
  },
  {
    id: "dwt_amount",
    label: "Transaction Amount",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) =>
      value.toLocaleString("en-US", { maximumFractionDigits: 20 }),
  },
  {
    id: "created_at",
    label: "Date",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) => {
      const date = new Date(value);
      return date.toLocaleString("eu-US");
    },
  },
];

function WalletHistory() {
  const [fromDate, setFromDate] = React.useState<Dayjs>(
    dayjs().subtract(30, "day")
  );
  const [toDate, setToDate] = React.useState<Dayjs>(dayjs());

  React.useEffect(() => {
    authStore.fetchWalletHistory();
  }, []);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="date">
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(date) => setFromDate(date!)}
          />
          <DatePicker
            label="To"
            value={toDate}
            onChange={(date) => setToDate(date!)}
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
            {authStore.wallet_history.length > 0 ? (
              <TableBody>
                {authStore.wallet_history
                  .filter(
                    (transaction: WalletHistoryT) =>
                      (transaction.created_at as number) >=
                        fromDate.valueOf() &&
                      (transaction.created_at as number) <= toDate.valueOf()
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
                  })}
              </TableBody>
            ) : (
              <p className="no-data">No Data</p>
            )}
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default observer(WalletHistory);
