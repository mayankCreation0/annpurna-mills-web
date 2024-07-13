import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Typography,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
  Box,
  Button, Modal,
  Skeleton
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  ArrowUpward,
  ArrowDownward,
  FilterList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TransitionsModal from '../Components/Modal';
import { deleteData, emailCsv, getList } from '../Api/Apis';
import { useMediaQuery, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const columns = [
  { id: '_id', label: 'ID', minWidth: 50 },
  { id: 'Name', label: 'Name', minWidth: 100 },
  { id: 'Date', label: 'Date', minWidth: 100 },
  { id: 'Category', label: 'Category', minWidth: 100 },
  { id: 'Status', label: 'Status', minWidth: 100 },
  { id: 'Amount', label: 'Amount', minWidth: 100 },
  { id: 'Address', label: 'Address', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 100 },
];

export default function CustomerList() {
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const listData = useSelector((state) => state.getData);


  const [placeholder, setPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const text = 'Search_name';
  const typingSpeed = 150; // Adjust typing speed in ms
  const deletionSpeed = 100; // Adjust deletion speed in ms
  const pauseDuration = 1000; // Pause duration in ms before retyping
  const PIN_EXPORT_CSV = process.env.REACT_APP_PIN_EXPORT_CSV; // Change this to the actual PIN you want to use



  const handleDelete = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpen(false);
    setLoaderOpen(true);
    await deleteData(selectedId, dispatch, navigate);
    setLoaderOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (columnId) => {
    let sortedData;
    if (sortBy === columnId) {
      sortedData = [...filteredCustomers].reverse();
    } else {
      sortedData = [...filteredCustomers].sort((a, b) => {
        if (a[columnId] < b[columnId]) return -1;
        if (a[columnId] > b[columnId]) return 1;
        return 0;
      });
    }
    setFilteredCustomers(sortedData);
    setSortBy(sortBy === columnId ? `-${columnId}` : columnId);
  };

  const calculateTenure = (startDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const diffInMonths =
      (currentDate.getFullYear() - start.getFullYear()) * 12 +
      (currentDate.getMonth() - start.getMonth());
    if (diffInMonths < 12) {
      return {
        color: '#3f51b5',
        text: `${diffInMonths} months`,
        backgroundColor: '#f3e5f5',
        fontSize: '12px',
        borderRadius: '8px',
      };
    } else if (diffInMonths < 24) {
      return {
        color: '#f57c00',
        text: '1 year',
        backgroundColor: '#fff3e0',
        fontSize: '12px',
        borderRadius: '8px',
      };
    } else if (diffInMonths < 36) {
      return {
        color: '#f57c00',
        text: '2 years',
        backgroundColor: '#fff3e0',
        fontSize: '12px',
        borderRadius: '8px',
      };
    } else if (diffInMonths < 48) {
      return {
        color: '#d32f2f',
        text: '3 years',
        backgroundColor: '#ffcdd2',
        fontSize: '12px',
        borderRadius: '8px',
      };
    } else {
      return {
        color: '#d32f2f',
        text: '3+ years',
        backgroundColor: '#ef9a9a',
        fontSize: '12px',
        borderRadius: '8px',
      };
    }
  };

  const getShortTenureText = (text) => {
    switch (text) {
      case 'More than 3 years':
        return '3+ yrs';
      case 'More than 2 years':
        return '2+ yrs';
      case 'More than a year':
        return '1+ yr';
      case 'Less than a year':
        return '< 1 yr';
      default:
        const monthsMatch = text.match(/^(\d+) months$/);
        if (monthsMatch) {
          return `${monthsMatch[1]}mos`;
        }
        return text;
    }
  };

  const handleView = (id) => {
    navigate(`/view/${id}`);
  };

  // const handleSearch = () => {
  //   const lowercasedFilter = searchValue.toLowerCase();
  //   const filteredData = customers.filter((item) =>
  //     item.Name.toLowerCase().includes(lowercasedFilter)
  //   );
  //   setFilteredCustomers(filteredData);
  //   setPage(0);
  // };

  const TableSkeleton = ({ rows, columns }) => {
    return (
      <TableBody>
        {Array.from(new Array(rows)).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from(new Array(columns)).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton variant="rectangular" width="100%" height={20} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPin('');
  };

  const handlePinChange = (event) => {
    setPin(event.target.value);
  };

  const handleDownloadClick = async () => {
    if (pin !== PIN_EXPORT_CSV) {
      setError('Incorrect PIN');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use your redux dispatch here
      const response = await emailCsv(dispatch);
      console.log(response);
    } catch (error) {
      console.error('Error sending email with CSV:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      handleCloseModal(); // Close the modal after sending email
    }
  };


  useEffect(() => {
    let typingTimeout;
    let currentIndex = placeholder.length;

    if (isTyping) {
      if (currentIndex < text.length) {
        typingTimeout = setTimeout(() => {
          setPlaceholder((prev) => prev + text[currentIndex]);
        }, typingSpeed);
      } else {
        typingTimeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      if (currentIndex > 0) {
        typingTimeout = setTimeout(() => {
          setPlaceholder((prev) => prev.slice(0, -1));
        }, deletionSpeed);
      } else {
        typingTimeout = setTimeout(() => {
          setIsTyping(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(typingTimeout);
  }, [placeholder, isTyping]);


  useEffect(() => {
    async function fetchData() {
      setLoaderOpen(true);
      await getList(dispatch, navigate);
      setLoaderOpen(false);
    }

    if (!Object.keys(listData).length > 0) {
      fetchData();
    } else {
      setCustomers(listData);
      setFilteredCustomers(listData);
    }
  }, [listData, dispatch, navigate]);

  useEffect(() => {
    let filteredData = customers;

    if (filterValue) {
      filteredData = filteredData.filter((item) => item.Category === filterValue);
    }

    if (searchValue) {
      filteredData = filteredData.filter((item) =>
        item.Name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (sortBy) {
      const isAscending = !sortBy.startsWith('-');
      const sortColumn = isAscending ? sortBy : sortBy.substring(1);
      filteredData = [...filteredData].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return isAscending ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return isAscending ? 1 : -1;
        return 0;
      });
    }

    setFilteredCustomers(filteredData);
  }, [customers, filterValue, searchValue, sortBy]);

  return (
    <>
      <Paper sx={{ paddingTop: '10px', overflowx: 'hidden', bgcolor: "applicationTheme.primary", height: '95%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', gap: "10px", boxShadow: 'none', backgroundImage: "none", borderRadius: "0px", overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.1em',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'applicationTheme.primary',
            height: 'fit-content',
          }}
        >
          <TextField
            // label="Search Name"
            variant="outlined"

            onChange={(e) => { setSearchValue(e.target.value); setPage(0); }}
            value={searchValue}
            placeholder={placeholder}
            sx={{
              width: isMediumScreen ? '250px' : '100%',
              // marginRight: '1rem',

              '.MuiOutlinedInput-root': {
                height: isMediumScreen ? '2.5rem' : '3rem',
                borderRadius: isMediumScreen ? '30px' : '10px',
              },
              '.MuiInputLabel-outlined': {
                transform: 'translate(14px, 10px) scale(1)',
              },

              "& input::placeholder": {
                fontSize: "15px",
                color: theme.palette.mode === 'light' ? "#333333" : '#b6b6b6',
                opacity: .9,
              },

              "& .MuiOutlinedInput-root": {
                color: theme.palette.mode === 'light' ? "#333333" : '#b6b6b6',
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'grey !important',
                  borderWidth: "1px",
                },
              }

            }}
            InputProps={{

              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {isMediumScreen ? (
            <Select
              variant="outlined"
              value={filterValue}
              onChange={(e) => {
                setFilterValue(e.target.value); // Ensure state is updated correctly
                setPage(0);
              }}
              IconComponent={FilterList}
              displayEmpty
              sx={{
                height: '2.5rem',
                borderRadius: '20px',
                minWidth: '150px',
                borderColor: 'grey !important',
                '.MuiSelect-icon': {
                  right: '10px',
                },
                ".MuiOutlinedInput-notchedOutline": { borderColor: 'grey !important' },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'grey !important',
                },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: '1px !important',
                  borderColor: 'grey !important',
                },
                '.MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  paddingRight: '30px',
                  borderColor: 'grey !important',
                },
                '.MuiInputLabel-outlined': {
                  transform: 'translate(14px, 10px) scale(1)',
                },
              }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="Gold">Gold</MenuItem>
              <MenuItem value="Silver">Silver</MenuItem>
              <MenuItem value="Bronze">Bronze</MenuItem>
              <MenuItem value="Bike">Bike</MenuItem>
              <MenuItem value="Cycle">Cycle</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          ) : (
            <Select
              variant="outlined"
              value=""// Ensure value is set here too
              onChange={(e) => setFilterValue(e.target.value)}
              IconComponent={FilterList}
              displayEmpty
              sx={{
                height: '2.7rem',
                borderRadius: '50%',
                padding: '0px !important',
                width: '43px',
                borderColor: 'grey !important',
                '.MuiSelect-icon': {
                  right: '10px',
                },
                ".MuiOutlinedInput-notchedOutline": { borderColor: 'grey !important' },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'grey !important',
                },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: '1px !important',
                  borderColor: 'grey !important',
                },
                '.MuiOutlinedInput-root': {
                  padding: '0px',
                  borderColor: 'grey !important',
                },
                '.MuiInputLabel-outlined': {
                  transform: 'translate(14px, 10px) scale(1)',
                },
                '.MuiSelect-selectMenu': {
                  display: 'none', // Hide selected value on small screens
                },
              }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="Gold">Gold</MenuItem>
              <MenuItem value="Silver">Silver</MenuItem>
              <MenuItem value="Bronze">Bronze</MenuItem>
              <MenuItem value="Bike">Bike</MenuItem>
              <MenuItem value="Cycle">Cycle</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          )}
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Export
          </Button>
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="pin-modal-title"
            aria-describedby="pin-modal-description"
          >
            <Box sx={{ ...modalStyle, width: 300 }}>
              <h2 id="pin-modal-title">Enter PIN</h2>
              <TextField
                id="pin-input"
                label="PIN"
                type="password"
                value={pin}
                onChange={handlePinChange}
                fullWidth
                margin="normal"
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <Button variant="contained" color="primary" onClick={handleDownloadClick} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Download CSV'}
              </Button>
            </Box>
          </Modal>
        </Box>
        <>
          <TableContainer
            component={'div'}
            sx={{
              border: 'none',
              backgroundColor: 'applicationTheme.primary',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              height: '100%',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              '-ms-overflow-style': 'none', /* IE and Edge */
              'scrollbar-width': 'none', /* Firefox */
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index, array) => (
                    <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      sx={{
                        borderRight: '1px solid white',
                        fontSize: '0.875rem',
                        color: 'applicationTheme.primaryColor_1',
                        backgroundColor: 'applicationTheme.secondaryColor_1',
                        fontWeight: 'bold',
                        padding: index === 0 || index + 1 >= array.length ? "10px 10px" : "10px 5px",
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle2">{column.label}</Typography>
                        {(column.id === 'Date' || column.id === 'Amount') && (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleSort(column.id)}
                            >
                              <ArrowUpward sx={{ fontSize: '1rem', color: 'applicationTheme.primaryColor_1', }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleSort(`-${column.id}`)}
                            >
                              <ArrowDownward sx={{ fontSize: '1rem', color: 'applicationTheme.primaryColor_1', }} />
                            </IconButton>
                          </>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {loaderOpen ? (
                <TableSkeleton rows={10} columns={columns.length} />
              ) : (
                <TableBody>
                  {Array.isArray(filteredCustomers) && filteredCustomers.length > 0 ? (
                    filteredCustomers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((customer, index, array) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                              transition: 'background-color 0.3s ease',
                            },
                            '&:last-child td, &:last-child th': {
                              borderBottom: 0,
                            },
                          }}
                        >
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              onClick={() => handleView(customer._id)}
                              className={`sample-customer ${customer && '!w-52'}`}
                              sx={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                backgroundColor: 'transparent',
                                color: 'applicationTheme.secondaryColor_1',
                                padding: "10px 5px",
                                cursor: 'pointer',
                                borderBottom: index + 1 >= array.length ? 'none' : '1px solid #ddd',
                                transition: 'color 0.3s ease, background-color 0.3s ease',
                                '&:hover': {
                                  color: '#333',
                                },
                              }}
                              align={column.align || 'left'}
                            >
                              {column.id === '_id'
                                ? customer._id.slice(-6)
                                : column.id === 'Date'
                                  ? new Date(customer.Date).toLocaleDateString('en-IN')
                                  : column.id === 'Name' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                      <div style={{ display: 'inline-block', alignItems: 'center', width: "150px", whiteSpace: "nowrap", textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                        {customer.Name}
                                      </div>
                                      {customer.Status === 'Active' && <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          backgroundColor: calculateTenure(customer.Date).backgroundColor,
                                          borderRadius: '8px',
                                          padding: '2px 4px',
                                          marginTop: '4px',
                                          width: "70px"
                                        }}
                                      >
                                        <AccessTimeIcon style={{ marginRight: '4px', color: '#757575', fontSize: '1rem' }} />
                                        <span
                                          style={{
                                            color: calculateTenure(customer.Date).color,
                                            fontWeight: '500',
                                            fontSize: '0.75rem',
                                          }}
                                        >
                                          {getShortTenureText(calculateTenure(customer.Date).text)}
                                        </span>
                                      </div>}
                                    </div>
                                  ) : column.id === 'Status' ? (
                                    <span
                                      style={{
                                        color: 'white',
                                        backgroundColor:
                                          customer.Status === 'Active'
                                            ? '#4CAF50'
                                            : customer.Status === 'Renew'
                                              ? '#2196F3'
                                              : customer.Status === 'Completed'
                                                ? '#F44336'
                                                : 'inherit',
                                        padding: '2px 6px',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        display: 'inline-block',
                                      }}
                                    >
                                      {customer.Status}
                                    </span>
                                  ) : column.id === 'Amount' ? (<span>₹{customer.Amount}</span>) : column.id === 'actions' ? (
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      style={{ display: 'flex', justifyContent: 'left', gap: '8px' }}
                                    >
                                      <IconButton
                                        color="error"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(customer._id);
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f8d7da', padding: '4px 8px', borderRadius: '4px' }}
                                      >
                                        <DeleteIcon sx={{ fontSize: '1rem' }} />
                                        <Typography variant="body2">Delete</Typography>
                                      </IconButton>
                                    </motion.div>
                                  ) : (
                                    customer[column.id]
                                  )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ height: '40vh' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                          <iframe
                            title='no data available'
                            src="https://lottie.host/embed/d47386c6-aef0-4de0-98dc-a294ec763487/6t4uVY89AD.json"
                            style={{ border: 'none', width: '100%', height: '100%' }}
                          ></iframe>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: 'applicationTheme.primary', justifyContent: isMediumScreen ? 'flex-end' : 'center', alignItems: 'center', height: 'fit-content', width: "100%" }}>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={filteredCustomers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ xs: 'flex', justifyContent: 'flex-end', backgroundColor: 'applicationTheme.primary', fontSize: '0.75rem', padding: '0px', overflow: 'hidden', paddingX: '0px' }}
            />
            <TransitionsModal
              open={open}
              handleClose={() => setOpen(false)}
              handleConfirm={handleConfirm}
            />
          </Box>
        </>
      </Paper>
    </>
  );
}
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
