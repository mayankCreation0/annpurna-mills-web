import React, { useState, useEffect } from 'react';
import {
    Typography, Box, Stack, Button, TextField, Accordion, AccordionSummary, AccordionDetails,
    CircularProgress, IconButton, Chip, Divider, Menu, MenuItem, Tooltip, FormControl,
    InputLabel, Select, styled, Paper, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentModal from './PaymentModal';
import { updateData } from '../../Api/Apis';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from 'lucide-react';
import { AddAPhoto, VideoCall } from '@mui/icons-material';

const LoanAccordion = ({ loan, index, customer, setCustomer, handleLoanUpdate, isLoading, setIsModalOpen, handleMediaClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoanEdit, setIsLoanEdit] = useState(false);
    const [newPayment, setNewPayment] = useState({ PaidAmount: '', PaidDate: '' });
    const [interest, setInterest] = useState(0);
    const [month, setMonth] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paidAmount, setPaidAmount] = useState(0);
    const theme = useTheme();
    const mode = useSelector(state => state.mode);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        handleClose();
        handleLoanDelete(index);
    };
    const calculateMonthlySimpleInterest = (principal, monthlyRate, startDate, endDate = new Date()) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();
        if (days < 0) {
            months -= 1;
            days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        }
        let totalMonths = years * 12 + months;
        if (totalMonths > 0 && days > 20) {
            totalMonths += 1;
        }
        if (totalMonths < 1) {
            totalMonths = 1;
        }
        const simpleInterest = (principal * monthlyRate * totalMonths) / 100;
        setMonth(totalMonths);
        setInterest(simpleInterest);
        return simpleInterest;
    };

    const StyledPaper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(3),
        borderRadius: theme.shape.borderRadius * 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
            boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
        },
    }));

    const AmountTypography = styled(Typography)(({ theme }) => ({
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        fontSize: '1.5rem',
    }));

    // const LoanStatusCard = ({ loan, interest, calculateTotalAmount }) => {
    //     const  loan.Status === 'Completed' =;
    // }

    const calculateExactTimePeriod = (startDate, endDate = new Date()) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();
        if (days < 0) {
            months -= 1;
            days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }
        if (days >= 30) {
            months += Math.floor(days / 30);
            days = days % 30;
        }
        if (months >= 12) {
            years += Math.floor(months / 12);
            months = months % 12;
        }
        return `${years} years, ${months} months, ${days} days`;
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return theme.palette.success.main;
            case 'completed':
                return theme.palette.error.main; // Changed to red for completed loans
            default:
                return theme.palette.warning.main;
        }
    };

    const handleEditToggle = () => {
        setIsLoanEdit(!isLoanEdit);
        handleClose();
    };
    const calculateTotalAmount = (loan) => {
        let totalAmount = 0;
        loan.PreviousPayments.forEach(payment => {
            totalAmount += parseFloat(payment.PaidAmount) || 0;
        });
        return totalAmount.toFixed(2);
    };

    const deletePayment = async (paymentIndex) => {
        const updatedLoans = [...customer.Loans];
        updatedLoans[index].PreviousPayments.splice(paymentIndex, 1);
        setCustomer({ ...customer, Loans: updatedLoans });
        await handleLoanUpdate(index);
    };

    const addNewPayment = async () => {
        const updatedLoans = [...customer.Loans];
        updatedLoans[index].PreviousPayments.push(newPayment);
        setCustomer({ ...customer, Loans: updatedLoans });
        await handleLoanUpdate(index);
        setNewPayment({ PaidAmount: '', PaidDate: '' });
    };

    const handlePaymentModalOpen = () => {
        setPaidAmount((parseFloat(loan.Amount) + interest - parseFloat(calculateTotalAmount(loan))).toFixed(2));
        setIsPaymentModalOpen(true);
    };

    const handlePaymentModalClose = () => {
        setIsPaymentModalOpen(false);
    };

    const handleSwipeSuccess = async (paidAmount, paidDate) => {
        const updatedLoan = {
            ...loan,
            Status: 'Completed',
            PaidLoan: { loanPaidAmount: paidAmount, LoanPaidDate: paidDate }
        };
        const updatedLoans = customer.Loans.map((l, i) => i === index ? updatedLoan : l);
        const updatedCustomer = { ...customer, Loans: updatedLoans };

        try {
            const response = await updateData(updatedCustomer, dispatch, navigate, customer._id);
            setCustomer(response); // Update with the response from the server
            setIsPaymentModalOpen(false);
        } catch (error) {
            console.error('Error updating loan status:', error);
            // Handle error (show error message to user)
        }
    };

    const handleLoanDelete = async () => {
        try {
            const updatedLoans = customer.Loans.filter((_, i) => i !== index);
            const updatedCustomer = { ...customer, Loans: updatedLoans };
            await updateData(updatedCustomer, dispatch, navigate, customer._id);
            setCustomer(updatedCustomer);
        } catch (error) {
            console.error('Error deleting loan:', error);
            // Handle error (show error message to user)
        }
    };

    const UploadBox = styled(Box)(({ theme }) => ({
        border: `2px dashed ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    }));

    const HiddenInput = styled('input')({
        display: 'none',
    });

    const handleMediaUpload = async (event, mediaType) => {
        const file = event.target.files[0];
        if (!file) return;

        const setUploading = mediaType === 'image' ? setUploadingImage : setUploadingVideo;
        setUploading(true);

        try {
            const formData = new FormData();

            // Append customer data
            formData.append('customerData', JSON.stringify({
                Name: customer.Name,
                Gender: customer.Gender,
                Address: customer.Address,
                PhoneNumber: customer.PhoneNumber
            }));

            // Append loan data
            const updatedLoans = [...customer.Loans];
            updatedLoans[index] = {
                ...updatedLoans[index],
                media: {
                    ...updatedLoans[index].media,
                    [mediaType]: { file }
                }
            };
            formData.append('loanData', JSON.stringify(updatedLoans));

            // Append the file
            formData.append(mediaType, file);

            const updatedCustomer = await updateData(formData, dispatch, navigate, customer._id);
            setCustomer(updatedCustomer);
        } catch (error) {
            console.error(`Error uploading ${mediaType}:`, error);
            // Handle error (e.g., show error message to user)
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (loan) {
            const endDate = loan.Status === 'Completed' ? loan.PaidLoan?.LoanPaidDate : new Date();
            calculateMonthlySimpleInterest(loan.Amount, loan.Rate, loan.Date, endDate);
        }
    }, [loan]);

    if (!loan) return null;
    
    return (
        <Accordion
            expanded={isExpanded || isLoanEdit}
            onChange={() => !isLoanEdit && setIsExpanded(!isExpanded)}
            sx={{
                marginBottom: 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[3],
                borderRadius: '8px',
                '&:before': {
                    display: 'none',
                },
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            <AccordionSummary
                expandIcon={!isLoanEdit && <ExpandMoreIcon />}
                sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? theme.palette.background.paper
                        : theme.palette.grey[50],
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.action.hover
                            : theme.palette.grey[100],
                    },
                    padding: '16px 16px 12px',
                    '& .MuiAccordionSummary-content': {
                        margin: '0',
                    },
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ position: 'relative', top: '-24px', left: '0', marginBottom: '-16px' }}>
                        <Chip
                            label={loan.Status}
                            size="small"
                            sx={{
                                backgroundColor: getStatusColor(loan.Status),
                                color: '#fff',
                                fontWeight: 'bold',
                                animation: loan.Status.toLowerCase() === 'active' ? 'blink 2s linear infinite' : 'none',
                                '@keyframes blink': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.6 },
                                    '100%': { opacity: 1 },
                                },
                            }}
                        />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 'medium',
                                color: theme.palette.text.primary,
                            }}
                        >
                            {loan.Category}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                        }}>
                            <motion.div
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: theme.palette.primary.main,
                                    }}
                                >
                                    ₹{parseFloat(loan.Amount).toLocaleString('en-IN')}
                                </Typography>
                            </motion.div>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {moment(loan.Date).format('DD MMM, YY')}
                            </Typography>
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleClick(event);
                                }}
                                size="small"
                                sx={{ color: theme.palette.text.secondary }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, pt: 3 }}>
                <Stack spacing={3}>
                    {isLoanEdit ? (
                        <>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="Category"
                                    value={loan.Category} // Assuming 'loan' refers to the current loan being edited
                                    onChange={(e) => {
                                        const updatedLoans = [...customer.Loans];
                                        updatedLoans[index].Category = e.target.value;
                                        setCustomer({ ...customer, Loans: updatedLoans });
                                    }}
                                    label="Category"
                                >
                                    <MenuItem value="Gold">Gold</MenuItem>
                                    <MenuItem value="Silver">Silver</MenuItem>
                                    <MenuItem value="Bronze">Kansa</MenuItem>
                                    <MenuItem value="Bike">Bike</MenuItem>
                                    <MenuItem value="Cycle">Cycle</MenuItem>
                                    <MenuItem value="Others">Others</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Loan Date"
                                type="date"
                                value={moment(loan.Date).format('YYYY-MM-DD')}
                                onChange={(e) => {
                                    const updatedLoans = [...customer.Loans];
                                    updatedLoans[index].Date = e.target.value;
                                    setCustomer({ ...customer, Loans: updatedLoans });
                                }}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField label="Amount" value={loan.Amount} onChange={(e) => {
                                const updatedLoans = [...customer.Loans];
                                updatedLoans[index].Amount = e.target.value;
                                setCustomer({ ...customer, Loans: updatedLoans });
                            }} fullWidth />
                            <TextField label="Rate" value={loan.Rate} onChange={(e) => {
                                const updatedLoans = [...customer.Loans];
                                updatedLoans[index].Rate = e.target.value;
                                setCustomer({ ...customer, Loans: updatedLoans });
                            }} fullWidth />
                            <TextField label="Weight" value={loan.Weight} onChange={(e) => {
                                const updatedLoans = [...customer.Loans];
                                updatedLoans[index].Weight = e.target.value;
                                setCustomer({ ...customer, Loans: updatedLoans });
                            }} fullWidth />
                            <TextField label="Remarks" value={loan.Remarks} onChange={(e) => {
                                const updatedLoans = [...customer.Loans];
                                updatedLoans[index].Remarks = e.target.value;
                                setCustomer({ ...customer, Loans: updatedLoans });
                            }} fullWidth multiline rows={2} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <UploadBox>
                                        <HiddenInput
                                            accept="image/*"
                                            id={`image-upload-file-${index}`}
                                            type="file"
                                            onChange={(e) => handleMediaUpload(e, 'image')}
                                        />
                                        <HiddenInput
                                            accept="image/*"
                                            id={`image-upload-camera-${index}`}
                                            type="file"
                                            capture="environment"
                                            onChange={(e) => handleMediaUpload(e, 'image')}
                                        />
                                        <label htmlFor={`image-upload-file-${index}`}>
                                            <IconButton component="span" color="primary">
                                                <CloudUploadIcon />
                                            </IconButton>
                                            <Typography variant="body2">
                                                {loan.media?.image ? 'Change Image' : 'Upload Image'}
                                            </Typography>
                                        </label>
                                        <label htmlFor={`image-upload-camera-${index}`}>
                                            <IconButton component="span" color="primary">
                                                <AddAPhoto />
                                            </IconButton>
                                            <Typography variant="body2">
                                                Take Photo
                                            </Typography>
                                        </label>
                                    </UploadBox>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <UploadBox>
                                        <HiddenInput
                                            accept="video/*"
                                            id={`video-upload-file-${index}`}
                                            type="file"
                                            onChange={(e) => handleMediaUpload(e, 'video')}
                                        />
                                        <HiddenInput
                                            accept="video/*"
                                            id={`video-upload-camera-${index}`}
                                            type="file"
                                            capture="environment"
                                            onChange={(e) => handleMediaUpload(e, 'video')}
                                        />
                                        <label htmlFor={`video-upload-file-${index}`}>
                                            <IconButton component="span" color="primary">
                                                <InsertDriveFileIcon />
                                            </IconButton>
                                            <Typography variant="body2">
                                                {loan.media?.video ? 'Change Video' : 'Upload Video'}
                                            </Typography>
                                        </label>
                                        <label htmlFor={`video-upload-camera-${index}`}>
                                            <IconButton component="span" color="primary">
                                                <VideoCall />
                                            </IconButton>
                                            <Typography variant="body2">
                                                Record Video
                                            </Typography>
                                        </label>
                                    </UploadBox>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                            <Typography><strong>Category:</strong> {loan.Category}</Typography>
                            <Typography><strong>Amount:</strong> ₹{loan.Amount}</Typography>
                            <Typography><strong>Rate:</strong> {loan.Rate}%</Typography>
                            <Typography><strong>Weight:</strong> {loan.Weight} gms</Typography>
                            <Typography sx={{ gridColumn: '1 / -1' }}><strong>Remarks:</strong> {loan.Remarks}</Typography>
                        </Box>
                    )}
                    <Divider />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                        <Typography>
                            <strong>Time Period: </strong>
                            <Box component="span" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                                {month} months
                            </Box>
                            <Box component="span" sx={{ color: theme.palette.text.secondary, ml: 1 }}>
                                ~({loan.Status !== 'Completed' ? calculateExactTimePeriod(loan?.Date) : calculateExactTimePeriod(loan?.PaidLoan?.LoanPaidDate)})
                            </Box>
                        </Typography>
                        <Typography><strong>Interest: </strong>₹{interest.toFixed(2)}</Typography>
                        {/* <Typography><strong>Total Paid:</strong> ₹{calculateTotalAmount(loan)}</Typography> */}
                        <StyledPaper elevation={3}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight="bold">
                                    { loan.Status === 'Completed' ? 'Loan Completed' : 'Current Loan Status'}
                                </Typography>
                                <Chip
                                    icon={ loan.Status === 'Completed' ? <CheckCircleIcon /> : <AccountBalanceWalletIcon />}
                                    label={ loan.Status === 'Completed' ? 'Paid' : 'Due'}
                                    color={ loan.Status === 'Completed' ? 'success' : 'primary'}
                                    variant="outlined"
                                />
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            { loan.Status === 'Completed' ? (
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <strong>Paid Amount:</strong>
                                    </Typography>
                                    <AmountTypography>
                                        ₹{loan.PaidLoan?.loanPaidAmount.toLocaleString('en-IN')}
                                    </AmountTypography>
                                    {loan.PaidLoan && (
                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                            <strong>Paid on:</strong> {moment(loan.PaidLoan.LoanPaidDate).format('DD MMM YYYY [at] hh:mm A')}
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <strong>Total Dues:</strong>
                                    </Typography>
                                    <AmountTypography>
                                        ₹{(parseFloat(loan.Amount) + interest - parseFloat(calculateTotalAmount(loan))).toLocaleString('en-IN')}
                                    </AmountTypography>
                                </Box>
                            )}
                        </StyledPaper>
                    </Box>
                    

                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<ImageIcon />}
                            onClick={() => handleMediaClick('image', loan)}
                            disabled={!loan.media || !loan.media.image}
                            sx={{ mr: 1, mb: 1 }}
                        >
                            View Image
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<VideoLibraryIcon />}
                            onClick={() => handleMediaClick('video', loan)}
                            disabled={!loan.media || !loan.media.video}
                            sx={{ mr: 1, mb: 1 }}
                        >
                            View Video
                        </Button>
                    </Box>

                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6" sx={{ fontWeight: '600' }}>
                                        Old Payments
                                        <Chip
                                            label={`Net: ₹${calculateTotalAmount(loan)}`}
                                            color="primary"
                                            size="small"
                                            sx={{ ml: 2 }}
                                        />
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {loan.PreviousPayments.length > 0 ? (
                                        <>
                                            {loan.PreviousPayments.map((payment, paymentIndex) => (
                                                <Stack key={paymentIndex} direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '10px' }}>
                                                    <Typography variant="body2">Amount: ₹{payment.PaidAmount}</Typography>
                                                    <Typography variant="body2">Date: {moment(payment.PaidDate).format('DD/MM/YYYY [at] hh:mm A')}</Typography>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => deletePayment(paymentIndex)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Stack>
                                            ))}
                                            <Divider sx={{ my: 2 }} />
                                        </>
                                    ) : (
                                        <Typography variant="body2">No previous payments available.</Typography>
                                    )}

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Add New Payment</Typography>
                                        <Stack direction="row" alignItems="flex-start" spacing={1}>
                                            <TextField
                                                value={newPayment.PaidAmount}
                                                onChange={(e) => setNewPayment({ ...newPayment, PaidAmount: e.target.value })}
                                                label="Amount"
                                                size="small"
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                required
                                            />
                                            <TextField
                                                type="date"
                                                value={newPayment.PaidDate}
                                                onChange={(e) => setNewPayment({ ...newPayment, PaidDate: e.target.value })}
                                                label="Date"
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                required
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={addNewPayment}
                                                sx={{ height: '40px' }}
                                            >
                                                Add
                                            </Button>
                                        </Stack>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </motion.div>
                    </AnimatePresence>
                </Stack>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isLoanEdit ? (
                        <>
                            <Button
                                onClick={() => {
                                    handleLoanUpdate(index);
                                    setIsLoanEdit(false);
                                }}
                                variant="contained"
                                color="primary"
                                startIcon={<AutoFixHighIcon />}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Update Loan'}
                            </Button>
                            <Button
                                onClick={handleEditToggle}
                                variant="outlined"
                                color="secondary"
                                startIcon={<CancelIcon />}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        loan.Status !== 'Completed' && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ width: '100%' }}
                            >
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handlePaymentModalOpen}
                                    sx={{
                                        width: '100%',
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        boxShadow: theme.shadows[4],
                                        '&:hover': {
                                            boxShadow: theme.shadows[8],
                                        },
                                    }}
                                >
                                    Mark as Paid
                                </Button>
                            </motion.div>
                        )
                    )}
                </Box>
            </AccordionDetails>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleEditToggle}>
                    {isLoanEdit ? (
                        <>
                            <CancelIcon fontSize="small" sx={{ mr: 1 }} />
                            Cancel Edit
                        </>
                    ) : (
                        <>
                            <EditIcon fontSize="small" sx={{ mr: 1 }} />
                            Edit
                        </>
                    )}
                </MenuItem>
                <MenuItem
                    onClick={handleDelete}
                    sx={{
                        color: theme.palette.error.main,
                        '&:hover': {
                            backgroundColor: theme.palette.error.light,
                        },
                    }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={handlePaymentModalClose}
                loan={loan}
                interest={interest}
                calculateTotalAmount={calculateTotalAmount}
                onSuccess={handleSwipeSuccess}
            />
        </Accordion>
    );
};

export default LoanAccordion;