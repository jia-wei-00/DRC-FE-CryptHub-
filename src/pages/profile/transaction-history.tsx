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
import { Column, Transaction } from "../../types";
import dayjs, { Dayjs } from "dayjs";
import { Loading } from "../../components";
import { Typography } from "@mui/material";

const columns: readonly Column[] = [
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
    label: "Transaction Amount (USD)",
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
      return date.toLocaleString("eu-US");
    },
  },
];

function TransactionHistory() {
  const [fromDate, setFromDate] = React.useState<Dayjs>(
    dayjs().startOf("day").subtract(30, "day")
  );

  const [toDate, setToDate] = React.useState<Dayjs>(dayjs().endOf("day"));

  React.useEffect(() => {
    historyStore.fetchTransaction();
  }, []);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="date">
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(date) => {
              setFromDate(dayjs(date).startOf("day"));
            }}
          />
          <DatePicker
            label="To"
            value={toDate}
            onChange={(date) => {
              setToDate(dayjs(date).endOf("day"));
            }}
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
              ) : historyStore.transaction.length > 0 ? (
                historyStore.transaction
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

export default observer(TransactionHistory);
