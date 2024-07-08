import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import { motion, useAnimation } from 'framer-motion';

const StatBox = ({ title, value, growth, delay, icon }) => {
    const controls = useAnimation();
    const [displayValue, setDisplayValue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (value !== undefined) {
            setLoading(false);
            controls.start({
                displayValue: value,
                transition: { duration: 2, ease: "easeOut" }
            });

            const interval = setInterval(() => {
                setDisplayValue(Math.floor(Math.random() * value));
            }, 50);

            setTimeout(() => {
                clearInterval(interval);
                setDisplayValue(value);
            }, 2000);
        }
    }, [value, controls]);

    return (
        <Paper
            component={motion.div}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'applicationTheme.primaryColor_1',
                color: 'applicationTheme.secondary',
                width: '100%',
                borderRadius: 2,
                boxShadow: 5,
                minWidth: 300,
            }}
        >
            {icon && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: delay + 0.2, duration: 0.5 }}
                    style={{ marginBottom: 8 }}
                >
                    {icon}
                </motion.div>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 1 }}>{title}</Typography>
            {loading ? (
                <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: 1 }}>Loading...</Typography>
            ) : (
                <motion.div
                    initial={{ displayValue: 0 }}
                    animate={controls}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: 1 }}>
                        {title.includes('Customer') ? displayValue : `₹ ${displayValue}`}
                    </Typography>
                </motion.div>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', color: growth >= 0 ? 'success.main' : 'error.main' }}>
                {growth >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                    {growth >= 0 ? '+' : ''}
                    {growth}% from last month
                </Typography>
            </Box>
        </Paper>
    );
};

const Statistics = () => {
    const data = useSelector((state) => state.analytics);
    const { currentMonth, previousMonth, currentMonthLoanRepaidStats, previousMonthLoanRepaidStats } = data;

    const calculateGrowth = (current, previous) => {
        return ((current - previous) / (previous || 1) * 100).toFixed(1);
    };

    const currentDate = new Date();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentMonthName = monthNames[currentDate.getMonth()];
    const totalLoanRepaidAmountGrowth = calculateGrowth(currentMonthLoanRepaidStats.totalLoanRepaidAmount, previousMonthLoanRepaidStats.totalLoanRepaidAmount);
    const customerCountGrowth = calculateGrowth(currentMonth.customerCount, previousMonth.customerCount);
    const totalLoanTakenAmountGrowth = calculateGrowth(currentMonth.totalLoanTakenAmount, previousMonth.totalLoanTakenAmount);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                padding: 3,
                '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for webkit browsers
                '-ms-overflow-style': 'none', // Hide scrollbar for Internet Explorer
                'scrollbar-width': 'none', // Hide scrollbar for Firefox
            }}
        >
            <StatBox
                title={`${currentMonthName}'s Loan Issued`}
                value={currentMonth?.totalLoanTakenAmount}
                growth={totalLoanTakenAmountGrowth}
                delay={0.2}
                icon={<AttachMoneyIcon sx={{ fontSize: 40 }} />}
            />
            <StatBox
                title={`${currentMonthName}'s Repaid Amount`}
                value={currentMonthLoanRepaidStats?.totalLoanRepaidAmount}
                growth={totalLoanRepaidAmountGrowth}
                delay={0.4}
                icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            />
            <StatBox
                title={`${currentMonthName}'s Customer Count`}
                value={currentMonth?.customerCount}
                growth={customerCountGrowth}
                delay={0.6}
                icon={<GroupIcon sx={{ fontSize: 40 }} />}
            />
        </Box>
    );
};

export default Statistics;
    