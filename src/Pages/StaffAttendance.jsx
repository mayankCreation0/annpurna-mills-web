// src/App.js

import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import AttendanceForm from '../Components/AttendanceForm';
import StaffTable from '../Components/StaffTable';
import { useDispatch } from 'react-redux';
import { getStaff } from '../Api/AttendanceApis';
import AddStaffModal from '../Components/AddStaffModal';
import AddIcon from '@mui/icons-material/Add';


function StaffAttendance() {
  const [openAddStaff, setOpenAddStaff] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchStaff(dispatch);
  }, []);

  const fetchStaff = async (dispatch) => {
    try {
      getStaff(dispatch)
    } catch (error) {
      console.error('Error fetching staff data', error);
    }
  };


  return (
    <>
      <Box sx={{display:'flex',justifyContent:'space-around',padding:'10px'}}>
        <Typography variant="h5" gutterBottom>
          Staff Attendance Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddStaff(true)}
          style={{ marginBottom: '16px' }}
        >
          Add Staff
        </Button>
      </Box>
      <StaffTable />
      <AttendanceForm />
      {openAddStaff && (
        <AddStaffModal
          open={openAddStaff}
          handleClose={() => setOpenAddStaff(false)}
        // staff={selectedStaff}
        // isEdit={!!selectedStaff}
        />
      )}
    </>
  );
}

export default StaffAttendance;
