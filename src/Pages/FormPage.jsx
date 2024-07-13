import React, { useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    MenuItem,
    Typography,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
    InputAdornment,
    Autocomplete,
    Paper,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { postFormData } from '../Api/Apis';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const FormContainer = styled(motion.div)(({ theme }) => ({
    maxWidth: '800px',
    margin: 'auto',
    padding: theme.spacing(3),
}));

const FormPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    border: '1px solid #e0e0e0',
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none',
}));

const FormHeading = styled(Typography)(({ theme }) => ({
    fontSize: '1.75rem',
    fontWeight: 500,
    marginBottom: theme.spacing(3),
    color: theme.palette.text.primary,
}));

const FormPage = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Gender: '',
        Address: '',
        Amount: '',
        Rate: '',
        Category: '',
        Weight: '',
        Status: '',
        Date: new Date().toISOString().split('T')[0],
        PhoneNumber: '',
        Remarks: '',
    });

    const [paidLoanData, setPaidLoanData] = useState({
        LoanPaidDate: new Date().toISOString().split('T')[0],
        loanPaidAmount: '',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.loading);
    const getData = useSelector(state => state.getData);

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentDate = new Date();
        const submissionDate = new Date(formData.Date);
        submissionDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());

        const dataToSubmit = {
            ...formData,
            Date: submissionDate.toISOString(),
        };

        console.log("Submit", dataToSubmit);

        if (formData.Status === 'Completed') {
            const paidLoanDate = new Date(paidLoanData.LoanPaidDate);
            paidLoanDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());

            dataToSubmit.PaidLoan = [{
                ...paidLoanData,
                LoanPaidDate: paidLoanDate.toISOString(),
            }];
        }
        await postFormData(dataToSubmit, dispatch, navigate);
    };

    const handlePaidLoanChange = (e) => {
        setPaidLoanData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const uniqueAddresses = Array.isArray(getData)
        ? Array.from(new Set(getData.map(item => item.Address?.trim()).filter(Boolean))).sort()
        : [];

    return (
        <FormContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <FormPaper elevation={1}>
                <FormHeading>Customer Data Form</FormHeading>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Name"
                                label="Name"
                                value={formData.Name}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="Gender"
                                    value={formData.Gender}
                                    onChange={handleChange}
                                    label="Gender"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="others">Others</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                freeSolo
                                options={uniqueAddresses}
                                value={formData.Address}
                                onChange={(e, newValue) => setFormData(prev => ({ ...prev, Address: newValue }))}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        name="Address"
                                        label="Address"
                                        onChange={handleChange}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="Amount"
                                label="Amount"
                                value={formData.Amount}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="Rate"
                                label="Rate"
                                value={formData.Rate}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="Category"
                                    value={formData.Category}
                                    onChange={handleChange}
                                    label="Category"
                                    required
                                >
                                    <MenuItem value="Gold">Gold</MenuItem>
                                    <MenuItem value="Silver">Silver</MenuItem>
                                    <MenuItem value="Bronze">Kansa</MenuItem>
                                    <MenuItem value="Others">Others</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="Status"
                                    value={formData.Status}
                                    onChange={handleChange}
                                    label="Status"
                                    required
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="Weight"
                                label="Weight"
                                value={formData.Weight}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">gms</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="date"
                                name="Date"
                                label="Date"
                                value={formData.Date}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="PhoneNumber"
                                label="Phone Number"
                                value={formData.PhoneNumber}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="Remarks"
                                label="Product Details"
                                value={formData.Remarks}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                        {formData.Status === 'Completed' && (
                            <Grid item xs={12} container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="date"
                                        name="LoanPaidDate"
                                        label="Loan Paid Date"
                                        value={paidLoanData.LoanPaidDate}
                                        onChange={handlePaidLoanChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="number"
                                        name="loanPaidAmount"
                                        label="Loan Paid Amount"
                                        value={paidLoanData.loanPaidAmount}
                                        onChange={handlePaidLoanChange}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        )}
                        <Grid item xs={12} container justifyContent="center" spacing={2}>
                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : "Submit"}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/')}
                                    startIcon={<ArrowBackIcon />}
                                >
                                    Back
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </FormPaper>
        </FormContainer>
    );
};

export default FormPage;