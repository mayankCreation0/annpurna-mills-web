import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getStaffDetailById } from '../Api/AttendanceApis';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DetailsModal = ({ open, handleClose, handleOpenEdit, staff, date, aggregatedData }) => {
  const [staffDetails, setStaffDetails] = useState(null);
  const dispatch = useDispatch();
  const attendanceDetails = useSelector(state => state.attendance);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await getStaffDetailById(staff, dispatch);
        setStaffDetails(response);
      } catch (error) {
        console.error('Error fetching staff details', error);
      }
    };

    fetchStaffDetails();
  }, [staff, dispatch]);

  const formattedDate = date ? new Date(date).toDateString() : 'N/A';
  const attendance = attendanceDetails[staff._id]?.[new Date(date).toISOString().split('T')[0]] || {};

  const getStatusIcon = (status) => {
    if (status === 'present') return <CheckCircleIcon style={{ color: 'green' }} />;
    if (status === 'absent') return <CancelIcon style={{ color: 'red' }} />;
    if (status === 'half day') return <AccessTimeIcon style={{ color: 'orange' }} />;
    return null;
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h5">Details for {staff.name}</Typography>
        <Typography variant="subtitle1">{formattedDate}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="h6" color="primary">Attendance Details</Typography>
          <Divider />
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>Status:</Typography>
            <Box display="flex" alignItems="center" ml={1}>
              {getStatusIcon(attendance.status)}
              <Typography variant="body1" ml={1}>{attendance.status || 'N/A'}</Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>Wages:</Typography>
            <Typography variant="body1" ml={1}>{attendance.moneyTaken ? `₹${attendance.moneyTaken}` : '₹0'}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>Remark:</Typography>
            <Typography variant="body1" ml={1}>{attendance.remark || 'N/A'}</Typography>
          </Box>
        </Box>
        {aggregatedData && (
          <Box>
            <Typography variant="h6" color="primary">Aggregated Data</Typography>
            <Divider />
            <Box display="flex" alignItems="center" mt={2}>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>Total Money Taken This Month:</Typography>
              <Typography variant="body1" ml={1}>₹{aggregatedData.totalMonthMoney}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>Total Money Taken This Year:</Typography>
              <Typography variant="body1" ml={1}>₹{aggregatedData.totalYearMoney}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>Total Days Present This Month:</Typography>
              <Typography variant="body1" ml={1}>{aggregatedData.totalDaysPresentMonth}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>Total Days Present This Year:</Typography>
              <Typography variant="body1" ml={1}>{aggregatedData.totalDaysPresentYear}</Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Close</Button>
        <Button onClick={handleOpenEdit} color="secondary">{attendance.status ? 'Edit' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsModal;
