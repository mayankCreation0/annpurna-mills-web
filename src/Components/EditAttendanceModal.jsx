import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, TextField, Button, CircularProgress } from '@mui/material';
import { patchAttendance, postAttendance } from '../Api/AttendanceApis';
import { useDispatch, useSelector } from 'react-redux';

const EditAttendanceModal = ({ open, handleClose, staff, date, isAdding }) => {
  const attendanceDetails = useSelector(state => state.attendance);
  const formattedDate = new Date(date).toISOString().split('T')[0];
  const attendance = attendanceDetails[staff._id]?.[formattedDate] || {};
  const [status, setStatus] = useState(attendance.status || '');
  const [moneyTaken, setMoneyTaken] = useState(attendance.moneyTaken || '');
  const [remark, setRemark] = useState(attendance.remark || '');
  const [loading, setLoading] = useState(false); // New state for loading
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAdding) {
      setStatus(attendance.status || '');
      setMoneyTaken(attendance.moneyTaken || '');
      setRemark(attendance.remark || '');
    }
  }, [isAdding, attendance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    const attendanceData = {
      staffId: staff._id,
      date: formattedDate,
      status,
      moneyTaken,
      remark,
      _id: attendance._id,
    };

    try {
      if (isAdding) {
        await postAttendance(attendanceData, dispatch);
      } else {
        await patchAttendance(attendanceData, dispatch);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving attendance data', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isAdding ? 'Add' : 'Edit'} Attendance for {staff.name} on {new Date(date).toDateString()}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth style={{ marginBottom: '16px' }}>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <MenuItem value="present">Present</MenuItem>
            <MenuItem value="half day">Half Day</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Wages"
          value={moneyTaken}
          onChange={(e) => setMoneyTaken(e.target.value)}
          required
          style={{ marginBottom: '16px' }}
        />
        <TextField
          fullWidth
          label="Remark"
          multiline
          rows={4}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>Close</Button>
        <Button onClick={handleSubmit} color="secondary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (isAdding ? 'Add' : 'Update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAttendanceModal;
