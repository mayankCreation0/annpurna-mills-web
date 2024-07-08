import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getList } from '../Api/Apis';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Skeleton,
} from '@mui/material';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import DoneIcon from '@mui/icons-material/Done';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const TransactionHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(state => state.loading);
  const listData = useSelector((state) => state.getData);
  const [transactions, setTransactions] = React.useState([]);
  const theme = useTheme();

  useEffect(() => {
    async function fetchData() {
      await getList(dispatch, navigate);
    }

    if (!Object.keys(listData).length > 0) {
      fetchData();
    } else {
      setTransactions(listData);
    }
  }, [listData, dispatch, navigate]);

  const getIcon = (type) => {
    switch (type) {
      case 'loan':
        return <CallMadeIcon />;
      case 'payment':
        return <CallReceivedIcon />;
      case 'completed':
        return <DoneIcon />;
      default:
        return null;
    }
  };

  const groupByMonth = (transactions) => {
    const allTransactions = transactions.flatMap(transaction => {
      const transactionEntries = [];
  
      if (transaction.Status === 'Active') {
        if (transaction.Amount !== null) {
          transactionEntries.push({
            ...transaction,
            type: 'loan',
            Date: transaction.Date,
            Amount: transaction.Amount || 0
          });
        }
  
        transaction.PreviousPayments.forEach(payment => {
          transactionEntries.push({
            ...transaction,
            type: 'payment',
            Date: payment.PaidDate,
            Amount: payment.Amount || 0
          });
        });
      }
  
      if (transaction.Status === 'Completed') {
        if (transaction.Amount !== null) {
          transactionEntries.push({
            ...transaction,
            type: 'loan',
            Date: transaction.Date,
            Amount: transaction.Amount || 0
          });
        }
  
        transaction.PreviousPayments.forEach(payment => {
          transactionEntries.push({
            ...transaction,
            type: 'payment',
            Date: payment.PaidDate,
            Amount: payment.Amount || 0
          });
        });
  
        transaction.PaidLoan.forEach(paidLoan => {
          transactionEntries.push({
            ...transaction,
            type: 'completed',
            Date: paidLoan.LoanPaidDate,
            Amount: paidLoan.loanPaidAmount || 0
          });
        });
      }
  
      return transactionEntries;
    });
  
    // Sort all transactions by date in descending order
    allTransactions.sort((a, b) => moment(b.Date).valueOf() - moment(a.Date).valueOf());
  
    return allTransactions.reduce((acc, transaction) => {
      const month = moment(transaction.Date).format('MMMM YYYY');
      if (!acc[month]) acc[month] = [];
      acc[month].push(transaction);
      return acc;
    }, {});
  };
  

  const calculateMonthlyNet = (transactions) => {
    return transactions.reduce((net, transaction) => {
      if (transaction.type === 'loan') {
        net -= transaction.Amount;
      }
      if (transaction.type === 'completed') {
        net += transaction.Amount;
      }
      if (transaction.type === 'payment') {
        net += transaction.Amount;
      }
      return net;
    }, 0);
  };

  const groupedTransactions = groupByMonth(transactions);

  const renderTransaction = (transaction) => {
    const type = transaction.type;
    const iconColor = type === 'loan' ? theme.palette.error.main : type === 'completed' ? theme.palette.success.main : theme.palette.info.main;

    return (
      <ListItem
        key={transaction._id + transaction.Date}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          mb: 2,
          backgroundColor: theme.palette.background.paper,
          transition: 'background-color 0.3s, color 0.3s',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          }
        }}
        component={motion.div}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ListItemIcon sx={{ color: iconColor }}>{getIcon(type)}</ListItemIcon>
        <ListItemText
          primary={`${transaction.Name} - ₹${transaction.Amount}`}
          secondary={moment(transaction.Date).format('MMMM Do YYYY, h:mm:ss a')}
          primaryTypographyProps={{ fontWeight: 'bold' }}
          secondaryTypographyProps={{ fontSize: '0.9em', color: theme.palette.text.secondary }}
        />
      </ListItem>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Transaction History
      </Typography>
      {loading ? (
        <Box>
          {/* Skeleton for Month Header */}
          <Skeleton height={40} width="60%" sx={{ mb: 2 }} />
          {/* Skeleton for Transaction Items */}
          <List>
            {[...Array(5)].map((_, index) => (
              <ListItem key={index} sx={{ mb: 2 }}>
                <ListItemIcon>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton width="80%" />}
                  secondary={<Skeleton width="60%" />}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        Object.keys(groupedTransactions).map(month => (
          <Box key={month}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold', color: theme.palette.primary.main }}>
                {month}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold', color: calculateMonthlyNet(groupedTransactions[month]) >= 0 ? theme.palette.success.main : theme.palette.error.main }}>
                Net: ₹{calculateMonthlyNet(groupedTransactions[month])}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {groupedTransactions[month].map(transaction => renderTransaction(transaction))}
            </List>
          </Box>
        ))
      )}
    </Box>
  );
};

export default TransactionHistory;
