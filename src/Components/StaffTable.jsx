import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { getStaff, deleteStaff } from '../Api/AttendanceApis';
import DetailsModal from './DetailModal';
import EditAttendanceModal from './EditAttendanceModal';
import AddStaffModal from './AddStaffModal';

const getPreviousDays = (numDays) => {
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  return dates;
};

const StaffTable = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openEditAttendance, setOpenEditAttendance] = useState(false);
  const [openAddStaff, setOpenAddStaff] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [aggregatedData, setAggregatedData] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading
  const dispatch = useDispatch();

  const staffList = useSelector(state => state.staff);
  const attendanceDetails = useSelector(state => state.attendance);

  useEffect(() => {
    getStaff(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const aggregateData = () => {
      const data = {};

      staffList.forEach(staff => {
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const currentYearStart = new Date(new Date().getFullYear(), 0, 1);

        let totalMonthMoney = 0;
        let totalYearMoney = 0;
        let totalDaysPresentMonth = 0;
        let totalDaysPresentYear = 0;

        Object.keys(attendanceDetails[staff._id] || {}).forEach(date => {
          const record = attendanceDetails[staff._id][date];
          const recordDate = new Date(date);

          if (recordDate >= currentMonthStart) {
            totalMonthMoney += record.moneyTaken || 0;
            if (record.status === 'present') totalDaysPresentMonth += 1;
            if (record.status === 'half day') totalDaysPresentMonth += 0.5;
          }

          if (recordDate >= currentYearStart) {
            totalYearMoney += record.moneyTaken || 0;
            if (record.status === 'present') totalDaysPresentYear += 1;
            if (record.status === 'half day') totalDaysPresentYear += 0.5;
          }
        });

        data[staff._id] = {
          totalMonthMoney,
          totalYearMoney,
          totalDaysPresentMonth,
          totalDaysPresentYear
        };
      });

      setAggregatedData(data);
    };

    aggregateData();
  }, [attendanceDetails, staffList]);

  const handleOpenDetails = (staff, date) => {
    setSelectedStaff(staff);
    setSelectedDate(date);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedStaff(null);
    setSelectedDate(null);
  };

  const handleOpenEditAttendance = (staff, date, adding) => {
    setSelectedStaff(staff);
    setSelectedDate(date);
    setIsAdding(adding);
    setOpenEditAttendance(true);
  };

  const handleCloseEditAttendance = () => {
    setOpenEditAttendance(false);
    setOpenDetails(false);
    setIsAdding(false);
  };

  const handleMenuOpen = (event, staff) => {
    setSelectedStaff(staff);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEditStaff = () => {
    setOpenAddStaff(true);
    handleMenuClose();
  };

  const handleDeleteConfirmOpen = () => {
    setOpenDeleteConfirm(true);
    handleMenuClose();
  };

  const handleDeleteConfirmClose = () => {
    setOpenDeleteConfirm(false);
    setSelectedStaff(null);
  };

  const handleDeleteStaff = async () => {
    try {
      await deleteStaff(selectedStaff._id, dispatch);
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting staff', error);
    }
  };

  const dates = getPreviousDays(365);

  return (
    <Box >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  left: 0,
                  backgroundColor: 'background.default',
                  fontWeight: 'bold',
                  borderRight: '2px solid #ddd',
                  borderBottom: '2px solid #ddd'
                }}
              >
                Name/Date
              </TableCell>
              {dates.map((date, idx) => (
                <TableCell
                  key={idx}
                  style={{
                    backgroundColor: 'background.default',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #ddd'
                  }}
                >
                  {date.toDateString()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {staffList.length === 0 ? (
              <TableRow>
                {dates.map((date, idx) => (
                  <TableCell key={idx} style={{ height: '100px', borderRight: '1px solid #ddd' }}>
                    <CircularProgress size={24} />
                  </TableCell>
                ))}
              </TableRow>
            ) : (
              staffList.map((staff) => (
                <TableRow key={staff._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <TableCell
                    style={{
                      left: 0,
                      backgroundColor: 'background.default',
                      zIndex: 10,
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      height: '100px'
                    }}
                  >
                    <span>{staff.name}</span>
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuOpen(event, staff)}
                      style={{ marginLeft: 'auto', marginRight: '0' }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                  {dates.map((date) => {
                    const formattedDate = date.toISOString().split('T')[0];
                    const attendance = attendanceDetails[staff._id]?.[formattedDate];
                    return (
                      <TableCell
                        key={formattedDate}
                        style={{
                          borderRight: '1px solid #ddd',
                          height: '100px',
                          backgroundColor: attendance ? (attendance.status === 'present' ? '#d9f2d9' : (attendance.status === 'half day' ? '#ffe0b3' : '#ffd9cc')) : '#fff'
                        }}
                      >
                        {attendance ? (
                          <Button
                            onClick={() => handleOpenDetails(staff, formattedDate)}
                            variant="text"
                            style={{
                              fontWeight: 'bold',
                              padding: '0px',
                              color: attendance.status === 'present' ? 'green' : (attendance.status === 'half day' ? 'orange' : 'red'),
                              background: 'transparent'
                            }}
                          >
                            {`${attendance.status} (₹${attendance.moneyTaken || '0'})`}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleOpenEditAttendance(staff, formattedDate, true)}
                            variant="contained"
                            startIcon={<AddIcon />}
                            color="primary"
                            style={{
                              fontWeight: 'bold',
                              padding: '10px 15px',
                              backgroundColor: '#2196f3'
                            }}
                          >
                             {loading ? <CircularProgress size={24} color="inherit" /> : 'Add'}
                          </Button>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {selectedStaff && (
          <DetailsModal
            open={openDetails}
            handleClose={handleCloseDetails}
            handleOpenEdit={() => handleOpenEditAttendance(selectedStaff, selectedDate, false)}
            staff={selectedStaff}
            date={selectedDate}
            aggregatedData={aggregatedData[selectedStaff._id]}
          />
        )}
        {openEditAttendance && (
          <EditAttendanceModal
            open={openEditAttendance}
            handleClose={handleCloseEditAttendance}
            staff={selectedStaff}
            date={selectedDate}
            isAdding={isAdding}
          />
        )}
        {openAddStaff && (
          <AddStaffModal
            open={openAddStaff}
            handleClose={() => setOpenAddStaff(false)}
            staff={selectedStaff}
            isEdit={!!selectedStaff}
          />
        )}
        {openDeleteConfirm && (
          <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete {selectedStaff?.name}?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteConfirmClose} color="primary">Cancel</Button>
              <Button onClick={handleDeleteStaff} color="secondary">Delete</Button>
            </DialogActions>
          </Dialog>
        )}
      </TableContainer>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditStaff}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteConfirmOpen}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default StaffTable;
