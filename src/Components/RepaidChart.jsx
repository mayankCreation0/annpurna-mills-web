import React, { useEffect, useState } from 'react';
import { BarChart, axisClasses } from '@mui/x-charts';
import { ToggleButton, ToggleButtonGroup, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalytics } from '../Api/Apis';
import { motion } from 'framer-motion';

export default function LoanAmountBarChart() {
    const [data, setData] = useState({ yearly: [], monthly: [] });
    const [chartType, setChartType] = useState('monthly'); // 'monthly' or 'yearly'

    const loading = useSelector(state => state.loading);
    const analytics = useSelector(state => state.analytics);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchData = async () => {
        const response = await getAnalytics(dispatch);
        const { yearlyLoanRepaidData, monthlyLoanRepaidData } = response.data;
        setData({ yearly: yearlyLoanRepaidData, monthly: monthlyLoanRepaidData });
    };

    useEffect(() => {
        if (!analytics) {
            fetchData();
        } else {
            const { yearlyLoanRepaidData, monthlyLoanRepaidData } = analytics;
            setData({ yearly: yearlyLoanRepaidData, monthly: monthlyLoanRepaidData });
        }
    }, [analytics]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const formatDate = (year, month) => {
        const date = new Date(year, month - 1); // JavaScript months are 0-indexed
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    };

    const createChartData = (data, type) => {
        if (type === 'yearly') {
            const currentYear = new Date().getFullYear();
            const last7Years = Array.from({ length: 7 }, (_, i) => currentYear - i).reverse();

            const yearlyDataMap = data.reduce((acc, item) => {
                acc[item._id.year] = item.totalLoanRepaidAmount;
                return acc;
            }, {});

            return last7Years.map(year => ({
                time: year,
                amount: yearlyDataMap[year] || 0
            }));
        }

        // Get last 12 months for monthly data
        const last12Months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return date;
        }).reverse();

        const monthlyDataMap = new Map(data.map(item => [`${item.year}-${item.month}`, item.totalLoanRepaidAmount]));

        return last12Months.map(date => ({
            time: formatDate(date.getFullYear(), date.getMonth() + 1), // Format as MMM-YY
            amount: monthlyDataMap.get(`${date.getFullYear()}-${date.getMonth() + 1}`) || 0,
        }));
    };


    const chartData = createChartData(data[chartType], chartType);

    return (
        <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'center', mb: 2, mt: '0' }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
                    <lord-icon
                        src="https://cdn.lordicon.com/jtiihjyw.json"
                        trigger="loop"
                        delay="1500"
                        style={{ width: '30px', height: '30px', marginRight: '3px' }}
                    />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                        Loan Repaid
                    </Typography>
                </Box>
                <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={(e, newType) => newType && setChartType(newType)}
                    sx={{ height: '24px', mt: 1 }}
                >
                    <ToggleButton value="monthly" sx={{ textTransform: 'none', fontSize: '0.7rem', padding: '3px 8px' }}>
                        Monthly
                    </ToggleButton>
                    <ToggleButton value="yearly" sx={{ textTransform: 'none', fontSize: '0.7rem', padding: '3px 8px' }}>
                        Yearly
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '100%',
                    flexGrow: 1,
                    overflow: 'hidden',
                    padding: '6px',
                    background: theme.palette.background.paper,
                    borderRadius: '8px',
                    boxShadow: theme.shadows[3]
                }}
            >
                <BarChart
                    dataset={chartData}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 70,
                        bottom: 50,
                    }}
                    xAxis={[
                        {
                            scaleType: 'band',
                            dataKey: 'time',
                            tickPlacement: 'middle',
                            tickLabelPlacement: 'middle',
                            tickLabelStyle: {
                                ...theme.typography.body2,
                                transform: 'rotate(-45deg)',
                                textAnchor: 'end',
                                fontSize: '0.7rem' 
                            },
                            ticks: isSmallScreen ? chartData.filter((_, index) => index % 2 === 0) : chartData
                        }
                    ]}
                    yAxis={[
                        { labelStyle: theme.typography.body1, tickLabelStyle: theme.typography.body2 }
                    ]}
                    series={[
                        {
                            dataKey: 'amount',
                            color: theme.palette.primary.main,
                            TooltipComponent: ({ x, y, dataPoint }) => (
                                <Box sx={{
                                    background: theme.palette.background.paper,
                                    borderRadius: '4px',
                                    boxShadow: theme.shadows[3],
                                    padding: '8px',
                                    fontSize: '0.75rem',
                                    color: theme.palette.text.primary
                                }}>
                                    <Typography variant="body2"><strong></strong></Typography>
                                    <Typography variant="body2">Loan Repaid: ₹{dataPoint.amount.toLocaleString()}</Typography>
                                </Box>
                            )
                        }
                    ]}
                    height={300}
                    sx={{
                        [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
                        [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
                        [`& .${axisClasses.left} .${axisClasses.label}`]: {
                            transform: 'translateX(-10px)',
                        },
                        [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
                            transform: 'translateY(10px)',
                        },
                    }}
                />
            </motion.div>
        </React.Fragment>
    );
}
