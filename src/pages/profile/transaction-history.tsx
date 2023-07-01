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

interface Column {
  id:
    | "id"
    | "type"
    | "date"
    | "currency"
    | "commission"
    | "transaction_amount"
    | "coin_amount";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number | Date) => string;
}

const columns: readonly Column[] = [
  { id: "id", label: "No", minWidth: 170 },
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
    format: (value: number | Date) => value.toLocaleString("en-US"),
  },
  {
    id: "transaction_amount",
    label: "Transaction Amount",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) => value.toLocaleString("en-US"),
  },
  {
    id: "commission",
    label: "Commission (5%)",
    minWidth: 170,
    align: "right",
    format: (value: number | Date) => value.toLocaleString("en-US"),
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
        <DatePicker value={fromDate} onChange={(date) => setFromDate(date)} />
        <DatePicker value={toDate} onChange={(date) => setToDate(date)} />
      </LocalizationProvider>
      <Paper>
        <TableContainer style={{ height: "calc(100vh - 240px)" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
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
                    (transaction: any) =>
                      transaction.date >= fromDate.valueOf() &&
                      transaction.date <= toDate.valueOf()
                  )
                  .map((row: any) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
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
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default observer(TransactionHistory);