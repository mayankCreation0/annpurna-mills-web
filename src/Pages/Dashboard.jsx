import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalytics } from '../Api/Apis';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import LoanBookChart from '../Components/LoanBookChart';
import LoanAmountBarChart from '../Components/RepaidChart';
import Statistics from '../Components/Statistics';
import Chart from '../Components/CountCharts';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import PieChart from '../Components/PieChart';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://annpurna-mills.vercel.app/">
        Annpurna Mills
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Home = () => {
  const dispatch = useDispatch();
  const storeData = useSelector(state => state.analytics);
  const getData = useSelector(state => state.getData);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      await getAnalytics(dispatch, navigate);
    };
    if (Object.keys(storeData).length <= 0) {
      fetchData();
    }
  }, [dispatch, navigate, storeData]);

  const renderSkeletons = () => (
    <Box sx={{ display: 'flex', bgcolor: "applicationTheme.primary" }}>
      <Container maxWidth="lg" sx={{ paddingLeft: "5px", paddingRight: "5px" }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            {/* Skeleton for Statistics */}
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                minHeight: '120px', // Ensure a minimum height to match the Statistics card
              }}
            >
              <Skeleton variant="text" width="30%" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={80} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            {/* Skeleton for Count Chart */}
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '300px',
                width: '100%',
                margin: '0 auto',
              }}
            >
              <Skeleton variant="rectangular" height={300} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            {/* Skeleton for Loan Amount Bar Chart */}
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '300px',
              }}
            >
              <Skeleton variant="rectangular" height={300} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            {/* Skeleton for Loan Book Chart */}
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '300px',
              }}
            >
              <Skeleton variant="rectangular" height={300} />
            </Paper>
          </Grid>
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
  

  return (
    <div>
      {Object.keys(storeData).length > 0 ? (
        <Box sx={{ display: 'flex', bgcolor: "applicationTheme.primary" }}>
          <Container maxWidth="lg" sx={{ paddingLeft: "5px", paddingRight: "5px" }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12}>
                <Statistics />
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto',
                  }}
                >
                  <LoanBookChart />
                </Paper>
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto',
                  }}
                >
                  <LoanAmountBarChart />
                </Paper>
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '300px',
                    width: '100%',
                    margin: '0 auto',
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>

              {Array.isArray(getData) || getData.length === 0 ? <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '300px',
                    width: '100%',
                    margin: '0 auto',
                    height:'400px'
                  }}
                >
                  <PieChart />
                </Paper>
              </Grid> : null}


            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      ) : renderSkeletons()}
    </div>
  );
};

export default Home;
