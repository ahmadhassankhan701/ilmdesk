import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { Badge, Chip } from "@mui/material";

const columns = [
  { id: "courseName", label: "Course", minWidth: 170 },
  { id: "amount", label: "Amount", minWidth: 170 },
  { id: "status", label: "Status", minWidth: 170 },
  { id: "paidAt", label: "Paid At", minWidth: 170 },
  { id: "confirmedAt", label: "Confirmed At", minWidth: 170 },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "right",
  },
];

export default function StickyHeadTable({ data }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const row = data?.map((payment) =>
    createData(
      payment.courseName,
      payment.amount,
      payment.status,
      payment.paidAt,
      payment.confirmedAt,
      payment.receipt,
      payment.key
    )
  );
  const rows = row;
  function createData(
    courseName,
    amount,
    status,
    paidAt,
    confirmedAt,
    receipt,
    key
  ) {
    return {
      key,
      courseName,
      amount,
      status,
      paidAt,
      confirmedAt,
      receipt,
    };
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3 }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{ bgcolor: "#f50366", color: "#fff" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.key}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "paidAt" ||
                          column.id === "confirmedAt" ? (
                            moment(value?.seconds * 1000).format(
                              "DD MMM, YYYY hh:mm A"
                            )
                          ) : column.id === "action" ? (
                            <a
                              href={row["receipt"]}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                textDecoration: "none",
                              }}
                            >
                              <Chip
                                label={"View"}
                                variant="contained"
                                color="info"
                                size="small"
                                sx={{ cursor: "pointer" }}
                              />
                            </a>
                          ) : column.id === "status" ? (
                            <Chip
                              label={value}
                              variant="contained"
                              color={value === "pending" ? "info" : "success"}
                              size="small"
                            />
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
