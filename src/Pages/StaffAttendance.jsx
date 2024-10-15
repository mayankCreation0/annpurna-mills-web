import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  useTheme, 
  useMediaQuery, 
  Container, 
  Grid, 
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import AttendanceForm from '../Components/AttendanceForm';
import StaffTable from '../Components/StaffTable';
import { useDispatch } from 'react-redux';
import { getStaff } from '../Api/AttendanceApis';
import AddStaffModal from '../Components/AddStaffModal';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function StaffAttendance() {
  const [openAddStaff, setOpenAddStaff] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchStaff(dispatch);
  }, [dispatch]);

  const fetchStaff = async (dispatch) => {
    try {
      getStaff(dispatch)
    } catch (error) {
      console.error('Error fetching staff data', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Paper elevation={3} sx={{ mt: 4, p: 1, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant={isMobile ? "h6" : "h5"} component="h1" fontWeight="bold" color="primary">
            Staff Attendance Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenAddStaff(true)}
            size={isMobile ? "small" : "medium"}
          >
            {isMobile ? "Add" : "Add Staff"}
          </Button>
        </Box>

        {isMobile ? (
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
            <Tab label="Attendance Table" />
            <Tab label="Add Attendance" />
          </Tabs>
        ) : null}

        <Grid container spacing={3}>
          {(!isMobile || tabValue === 0) && (
            <Grid item xs={12} md={8}>
              <StaffTable />
            </Grid>
          )}
          {(!isMobile || tabValue === 1) && (
            <Grid item xs={12} md={4}>
              <AttendanceForm />
            </Grid>
          )}
        </Grid>
      </Paper>

      <AddStaffModal
        open={openAddStaff}
        handleClose={() => setOpenAddStaff(false)}
      />
    </>
  );
}

export default StaffAttendance;