import React, { useState } from 'react';
import {
  TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid, Typography, Paper, useTheme, CircularProgress
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
    <Paper
      sx={{
        padding: '16px',
        border: '1px solid',
        borderColor: theme.palette.mode === 'light' ? '#ccc' : theme.palette.divider,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add/Edit Attendance
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="staff-label">Staff</InputLabel>
              <Select
                labelId="staff-label"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                required
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
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
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
              label="Remark"
              multiline
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: theme.palette.applicationTheme.main,
                '&:hover': {
                  backgroundColor: theme.palette.applicationTheme.secondaryColor_1,
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AttendanceForm;
