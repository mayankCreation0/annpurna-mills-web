import React, { useState } from 'react';
import {
  TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid, Typography, Paper, useTheme, CircularProgress,
  Box
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { postAttendance } from '../Api/AttendanceApis';

const AttendanceForm = () => {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [moneyTaken, setMoneyTaken] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const staffList = useSelector(state => state.staff);
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const attendanceData = {
      staffId: selectedStaff,
      date,
      status,
      moneyTaken,
      remark,
    };
    await postAttendance(attendanceData, dispatch);
    setLoading(false);
    setSelectedStaff('');
    setDate('');  
    setStatus('');
    setMoneyTaken('');
    setRemark('');
  };

return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        Add/Edit Attendance
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="staff-label">Staff</InputLabel>
              <Select
                labelId="staff-label"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                required
                label="Staff"
              >
                {staffList.map((staff) => (
                  <MenuItem key={staff._id} value={staff._id}>
                    {staff.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                label="Status"
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="half day">Half Day</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Wages"
              type="number"
              value={moneyTaken}
              onChange={(e) => setMoneyTaken(e.target.value)}
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Remark"
              multiline
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};


export default AttendanceForm;
