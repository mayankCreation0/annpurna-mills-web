import React, { useEffect, useState } from 'react';
import { BarChart, axisClasses } from '@mui/x-charts';
import { ToggleButton, ToggleButtonGroup, Box, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalytics } from '../Api/Apis';
import { motion } from 'framer-motion';
import moment from 'moment';

export default function LoanBookChart() {
    const [data, setData] = useState({ yearly: [], monthly: [] });
    const [chartType, setChartType] = useState('monthly'); // 'monthly' or 'yearly'
    const loading = useSelector(state => state.loading);
    const analytics = useSelector(state => state.analytics);
    const dispatch = useDispatch();
    const theme = useTheme();

    const fetchData = async () => {
        const response = await getAnalytics(dispatch);
        const { yearlyData, monthlyData } = response.data;
        setData({ yearly: yearlyData, monthly: monthlyData });
    };

    useEffect(() => {
        if (!analytics) {
            fetchData();
        } else {
            const { yearlyData, monthlyData } = analytics;
            setData({ yearly: yearlyData, monthly: monthlyData });
        }
    }, [analytics]);
    const formatYAxisLabel = (value) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
        if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
        return `₹${value}`;
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    const createChartData = (data, type) => {
        if (type === 'yearly') {
            const currentYear = new Date().getFullYear();
            const last7Years = Array.from({ length: 7 }, (_, i) => currentYear - i).reverse();
            const yearlyDataMap = new Map(data.map(item => [item._id.year, item.totalLoanTakenAmount]));

            return last7Years.map(year => ({
                time: year,
                amount: yearlyDataMap.get(year) || 0,
            }));
        }

        // Get last 12 months for monthly data
        const last12Months = Array.from({ length: 12 }, (_, i) => moment().subtract(i, 'months')).reverse();
        const monthlyDataMap = new Map(data.map(item => [`${item.year}-${item.month}`, item.totalLoanTakenAmount]));

        return last12Months.map(date => ({
            time: date.format('MMM-YY'), // Format as Jan-24
            amount: monthlyDataMap.get(`${date.year()}-${date.month() + 1}`) || 0,
        }));
    };

    const chartData = createChartData(data[chartType], chartType);

    return (
        <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
                    <lord-icon
                        src="https://cdn.lordicon.com/ofcynlwa.json"
                        trigger="loop"
                        delay="1500"
                        style={{ width: '30px', height: '30px', marginRight: '3px' }}
                    />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                        Loan Issued
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
                        right: 10,
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
                                fontSize:'0.7rem'                             },
                        }
                    ]}
                    yAxis={[
                        { labelStyle: theme.typography.body1, tickLabelStyle: theme.typography.body2, valueFormatter: formatYAxisLabel, }
                    ]}
                    series={[
                        {
                            dataKey: 'amount', color: theme.palette.primary.main, valueFormatter: (value) => `₹${value.toLocaleString()}`,
                            highlightScope: { faded: 'global', highlighted: 'item' }, }
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
