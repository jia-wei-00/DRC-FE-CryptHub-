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
import dayjs from "dayjs";
import { Column, Transaction } from "../../types";

const columns: readonly Column[] = [
  // { id: "id", label: "No", minWidth: 170 },
  { id: "type", label: "Trade Type", minWidth: 100 },
  {
    id: "currency",
    label: "Currency",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) => value.toLocaleString("en-US"),
  },
  {
    id: "coin_amount",
    label: "Coin Amount",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) =>
      value.toLocaleString("en-US", { maximumFractionDigits: 20 }),
  },
  {
    id: "transaction_amount",
    label: "Transaction Amount",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) =>
      value.toLocaleString("en-US", { maximumFractionDigits: 20 }),
  },
  {
    id: "commission",
    label: "Commission (5%)",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) =>
      value.toLocaleString("en-US", { maximumFractionDigits: 20 }),
  },

  {
    id: "date",
    label: "Date",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) => {
      const date = new Date(value);
      return date.toLocaleString("en-US");
    },
  },
];

function TransactionHistory() {
  const [fromDate, setFromDate] = React.useState<any>(
    dayjs().subtract(30, "day")
  );
  const [toDate, setToDate] = React.useState<any>(dayjs());

  React.useEffect(() => {
    authStore.fetchTransaction();
  }, []);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="From"
          value={fromDate}
          onChange={(date) => setFromDate(date)}
        />
        <DatePicker
          label="To"
          value={toDate}
          onChange={(date) => setToDate(date)}
        />
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
              {authStore.transaction &&
                authStore.transaction
                  .filter(
                    (transaction: Transaction) =>
                      transaction.date >= fromDate.valueOf() &&
                      transaction.date <= toDate.valueOf()
                  )
                  .map((row: Transaction, index: number) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell>{index + 1}</TableCell>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                              {/* {value} */}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default observer(TransactionHistory);
