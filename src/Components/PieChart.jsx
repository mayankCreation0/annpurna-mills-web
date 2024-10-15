import React from 'react';
import { PieChart as MuiPieChart } from '@mui/x-charts/PieChart';
import { useSelector } from 'react-redux';
import { Box, Typography, useTheme } from '@mui/material';

const PieChart = () => {
    const getData = useSelector(state => state.getData);
    const theme = useTheme();

    if (!Array.isArray(getData) || getData.length === 0) {
        return (
            <Box sx={{ padding: 3, backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" component="div" sx={{ textAlign: 'center', marginBottom: 2 }}>
                    No data available
                </Typography>
            </Box>
        );
    }

    const aggregatedData = getData.reduce((acc, customer) => {
        if (Array.isArray(customer.Loans)) {
            customer.Loans.forEach(loan => {
                if (loan.Status === 'Active') {
                    const { Category, Weight } = loan;
                    if (['Gold', 'Silver', 'Bronze'].includes(Category)) {
                        acc[Category] = (acc[Category] || 0) + parseFloat(Weight || 0);
                    }
                }
            });
        }
        return acc;
    }, {});

    const data = Object.keys(aggregatedData).map(category => ({
        id: category,
        value: aggregatedData[category],
        label: `${category} (${['Gold', 'Silver', 'Bronze'].includes(category) ? 'gms' : 'count'})`,
        color: getCategoryColor(category),
    }));

    function getCategoryColor(category) {
        switch (category) {
            case 'Gold': return '#FFD700';
            case 'Silver': return '#C0C0C0';
            case 'Bronze': return '#B87333';
            default: return '#888888';
        }
    }

    return (
        <Box sx={{ padding: 1, backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h5" component="div" sx={{ textAlign: 'center', marginBottom: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                Total Assets Holdings
            </Typography>
            {data.length > 0 ? (
                <MuiPieChart
                    series={[
                        {
                            data,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            color: ({ id }) => data.find(d => d.id === id).color,
                        },
                    ]}
                    height={300}
                />
            ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', padding: 2 }}>
                    No active loans with Gold, Silver, or Bronze categories found.
                </Typography>
            )}
        </Box>
    );
};

export default PieChart;