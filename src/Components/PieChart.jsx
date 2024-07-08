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

    const aggregatedData = getData.reduce((acc, item) => {
        if (item.Status === 'Active') {
            const { Category, Weight } = item;
            if (['Gold', 'Silver', 'Bronze'].includes(Category)) {
                acc[Category] = (acc[Category] || 0) + parseFloat(Weight || 0);
            }
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
          case 'Bike': return '#FF5733';
          case 'Cycle': return '#33FF57';
          default: return '#888888';
        }
    }

    return (
        <Box sx={{ padding: 1, backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h5" component="div" sx={{ textAlign: 'center', marginBottom: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                Total Assets Holdings
            </Typography>
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
        </Box>
    );
};

export default PieChart;
