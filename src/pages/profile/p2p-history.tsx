import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { observer } from "mobx-react-lite";
import { p2pStore } from "../../stores";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { P2PCompletedHistoryColumn, P2PCompletedHistoryT } from "../../types";
import dayjs, { Dayjs } from "dayjs";

const columns: readonly P2PCompletedHistoryColumn[] = [
  // { id: "id", label: "No", minWidth: 170 },
  { id: "transaction_type", label: "Type", align: "right", minWidth: 100 },
  { id: "currency", label: "Currency", align: "right", minWidth: 100 },
  {
    id: "coin_amount",
    label: "Coin Amount",
    minWidth: 100,
    align: "right",
    format: (value: number) =>
      value.toLocaleString("en-US", { maximumFractionDigits: 20 }),
  },
  {
    id: "selling_price",
    label: "Selling Price",
    minWidth: 170,
    align: "right",
    format: (value: number) =>
      value.toLocaleString("en-US", { maximumFractionDigits: 20 }),
  },
  {
    id: "created_at",
    label: "Created At",
    minWidth: 170,
    align: "right",
    format: (value: number) => {
      const date = new Date(value);
      return date.toLocaleString("eu-US");
    },
  },
  {
    id: "completed_at",
    label: "Completed At",
    minWidth: 170,
    align: "right",
    format: (value: number) => {
      const date = new Date(value);
      return date.toLocaleString("eu-US");
    },
  },
];

function P2PHistory() {
  const [fromDate, setFromDate] = React.useState<Dayjs | number>(
    dayjs().subtract(30, "day")
  );
  const [toDate, setToDate] = React.useState<Dayjs | number>(dayjs());

  React.useEffect(() => {
    p2pStore.fetchP2PHistory();
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
            <TableBody>
              {p2pStore.p2p_completed_history &&
                p2pStore.p2p_completed_history
                  .filter(
                    (transaction: P2PCompletedHistoryT) =>
                      transaction.completed_at >= fromDate.valueOf() &&
                      transaction.completed_at <= toDate.valueOf()
                  )
                  .map((row: P2PCompletedHistoryT, index: number) => {
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
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default observer(P2PHistory);
