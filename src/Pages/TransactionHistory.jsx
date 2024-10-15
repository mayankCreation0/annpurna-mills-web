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
      console.log('listData:', listData); // Debug log
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

  const formatAmount = (amount) => {
    return amount.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'INR'
    });
  };

  const groupByMonth = (transactions) => {
    console.log('Grouping transactions:', transactions); // Debug log
    const allTransactions = transactions.flatMap(customer => {
      return customer.Loans.flatMap(loan => {
        const loanEntries = [];

        // Add loan entry
        loanEntries.push({
          customerId: customer._id,
          customerName: customer.Name,
          ...loan,
          type: 'loan',
          Date: loan.Date,
          Amount: loan.Amount || 0
        });

        // Add previous payment entries
        if (loan.PreviousPayments && Array.isArray(loan.PreviousPayments)) {
          loan.PreviousPayments.forEach(payment => {
            loanEntries.push({
              customerId: customer._id,
              customerName: customer.Name,
              ...loan,
              type: 'payment',
              Date: payment.PaidDate,
              Amount: payment.PaidAmount || 0
            });
          });
        }

        // Add completed loan entry if applicable
        if (loan.Status === 'Completed' && loan.PaidLoan) {
          loanEntries.push({
            customerId: customer._id,
            customerName: customer.Name,
            ...loan,
            type: 'completed',
            Date: loan.PaidLoan.LoanPaidDate,
            Amount: loan.PaidLoan.loanPaidAmount || 0
          });
        }

        return loanEntries;
      });
    });

    allTransactions.sort((a, b) => moment(b.Date).valueOf() - moment(a.Date).valueOf());

    const grouped = allTransactions.reduce((acc, transaction) => {
      const month = moment(transaction.Date).format('MMMM YYYY');
      if (!acc[month]) acc[month] = [];
      acc[month].push(transaction);
      return acc;
    }, {});

    console.log('Grouped transactions:', grouped); // Debug log
    return grouped;
  };

  const calculateMonthlyNet = (transactions) => {
    return transactions.reduce((net, transaction) => {
      if (transaction.type === 'loan') {
        net -= transaction.Amount;
      }
      if (transaction.type === 'completed' || transaction.type === 'payment') {
        net += transaction.Amount;
      }
      return net;
    }, 0);
  };

  const groupedTransactions = groupByMonth(transactions);

  const handleTransactionClick = (customerId) => {
    navigate(`/view/${customerId}`);
  };

  const renderTransaction = (transaction) => {
    const type = transaction.type;
    const iconColor = type === 'loan' ? theme.palette.error.main : type === 'completed' ? theme.palette.success.main : theme.palette.info.main;

    return (
      <ListItem
        key={`${transaction.customerId}-${transaction._id}-${transaction.Date}`}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          mb: 2,
          backgroundColor: theme.palette.background.paper,
          transition: 'background-color 0.3s, color 0.3s',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            cursor: 'pointer',
          }
        }}
        component={motion.div}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => handleTransactionClick(transaction.customerId)}
      >
        <ListItemIcon sx={{ color: iconColor }}>{getIcon(type)}</ListItemIcon>
        <ListItemText
          primary={`${transaction.customerName} - ${formatAmount(transaction.Amount)}`}
          secondary={moment(transaction.Date).format('MMMM Do YYYY, h:mm:ss a')}
          primaryTypographyProps={{ fontWeight: 'bold' }}
          secondaryTypographyProps={{ fontSize: '0.9em', color: theme.palette.text.secondary }}
        />
      </ListItem>
    );
  };

  console.log('Rendering with groupedTransactions:', groupedTransactions); // Debug log

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Transaction History
      </Typography>
      {loading ? (
        <Box>
          <Skeleton height={40} width="60%" sx={{ mb: 2 }} />
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
        Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map(month => (
            <Box key={month}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold', color: theme.palette.primary.main }}>
                  {month}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold', color: calculateMonthlyNet(groupedTransactions[month]) >= 0 ? theme.palette.success.main : theme.palette.error.main }}>
                  Net: {formatAmount(calculateMonthlyNet(groupedTransactions[month]))}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List>
                {groupedTransactions[month].map(transaction => renderTransaction(transaction))}
              </List>
            </Box>
          ))
        ) : (
          <Typography>No transactions to display.</Typography>
        )
      )}
    </Box>
  );
};

export default TransactionHistory;