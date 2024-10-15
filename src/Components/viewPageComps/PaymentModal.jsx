import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SwipeableButton } from 'react-swipeable-button';

const PaymentModal = ({ isOpen, onClose, loan, interest, calculateTotalAmount, onSuccess }) => {
    const [paidAmount, setPaidAmount] = useState('');
    const [paidDate, setPaidDate] = useState('');

    useEffect(() => {
        if (isOpen && loan) {
            const totalDues = (parseFloat(loan.Amount) + interest - parseFloat(calculateTotalAmount(loan))).toFixed(2);
            setPaidAmount(totalDues);
            setPaidDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen, loan, interest, calculateTotalAmount]);

    const handleSwipeSuccess = () => {
        if (paidAmount && paidDate) {
            onSuccess(paidAmount, paidDate);
        } else {
            console.error('Paid amount or date is missing');
        }
    };

    if (!loan) return null;

    return (
        <Modal open={isOpen} onClose={onClose} aria-labelledby="payment-modal-title">
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
            }}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Typography id="payment-modal-title" variant="h6" component="h2" mb={2}>
                    Confirm Payment
                </Typography>
                <TextField
                    label="Paid Amount"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    fullWidth
                    margin="normal"
                    type="number"
                />
                <TextField
                    label="Paid Date"
                    type="date"
                    value={paidDate}
                    onChange={(e) => setPaidDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <Box sx={{ mt: 2 }}>
                    <SwipeableButton
                        text='Swipe to confirm payment'
                        color='#4CAF50'
                        onSuccess={handleSwipeSuccess}
                    />
                </Box>
            </Box>
        </Modal>
    );
};

export default PaymentModal;