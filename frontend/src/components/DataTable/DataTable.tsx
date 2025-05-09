import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

type DataTableColumn<T> = {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: unknown) => React.ReactNode;
  sortable?: boolean;
};

type DataTableAction<T> = {
  icon: React.ReactNode;
  tooltip: string;
  onClick: (item: T) => void;
  visible?: (item: T) => boolean;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
};

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  title?: string;
  actions?: DataTableAction<T>[];
  onRowClick?: (item: T) => void;
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  onRefresh?: () => void;
  searchable?: boolean;
  pagination?: boolean;
  /**
   * Optional array of React nodes to render as extra rows at the top of the TableBody.
   * Useful for in-place add/edit rows.
   */
  extraRows?: React.ReactNode[];
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator(
  order: Order,
  orderBy: string
): (a: any, b: any) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function DataTable<T>({
  columns,
  data,
  title,
  actions = [],
  onRowClick,
  keyExtractor,
  isLoading = false,
  onRefresh,
  searchable = true,
  pagination = true,
  extraRows = [],
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property: string) => () => {
    handleRequestSort(property);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  // Filter data based on search query
  const filteredData =
    searchQuery.trim() === ""
      ? data
      : data.filter((item) => {
          // Create a string representation of all values in the row
          const rowValues = columns
            .map((column) => {
              const value = item[column.id as keyof T];
              return typeof value === "string" || typeof value === "number"
                ? String(value).toLowerCase()
                : "";
            })
            .join(" ");

          return rowValues.includes(searchQuery.toLowerCase());
        });

  // Apply sorting
  const sortedData = orderBy
    ? stableSort(filteredData, getComparator(order, orderBy))
    : filteredData;

  // Apply pagination
  const paginatedData = pagination
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedData;

  const emptyRows = pagination
    ? Math.max(0, rowsPerPage - paginatedData.length)
    : 0;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2, mb: 2 }}>
      {/* Toolbar with title and search */}
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{ flex: "1 1 auto", mt: 1, mb: 1 }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {searchable && (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={handleSearch}
              sx={{ mr: 1, width: { xs: "100%", sm: "auto" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {onRefresh && (
            <Tooltip title="Atualizar">
              <IconButton onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  style={{
                    minWidth: column.minWidth || 100,
                    fontWeight: "bold",
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={createSortHandler(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell align="right" style={{ minWidth: 100 }}>
                  Ações
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {extraRows &&
              extraRows.map((row, idx) => (
                <React.Fragment key={"extra-" + idx}>{row}</React.Fragment>
              ))}
            {paginatedData.map((row) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={keyExtractor(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {columns.map((column) => {
                    const value = row[column.id as keyof T];
                    let cellContent: React.ReactNode = column.format
                      ? column.format(value)
                      : value;
                    if (cellContent === undefined || cellContent === null) {
                      cellContent = "";
                    } else if (
                      typeof cellContent !== "string" &&
                      typeof cellContent !== "number" &&
                      typeof cellContent !== "boolean" &&
                      !React.isValidElement(cellContent)
                    ) {
                      cellContent = String(cellContent);
                    }
                    return (
                      <TableCell key={column.id} align={column.align || "left"}>
                        {/* @ts-expect-error: cellContent is ensured to be a valid ReactNode at runtime for generic table rendering */}
                        {cellContent}
                      </TableCell>
                    );
                  })}
                  {actions.length > 0 && (
                    <TableCell align="right">
                      {actions.map((action, index) => {
                        const isVisible = action.visible
                          ? action.visible(row)
                          : true;
                        if (!isVisible) return null;

                        return (
                          <IconButton
                            key={index}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            color={action.color || "primary"}
                          >
                            <Tooltip title={action.tooltip}>
                              {action.icon}
                            </Tooltip>
                          </IconButton>
                        );
                      })}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  align="center"
                >
                  {isLoading
                    ? "Carregando..."
                    : filteredData.length === 0
                    ? "Nenhum registro encontrado"
                    : ""}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      )}
    </Paper>
  );
}

export default DataTable;
