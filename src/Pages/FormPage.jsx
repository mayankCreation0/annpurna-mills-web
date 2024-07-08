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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { postFormData } from '../Api/Apis';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const FormContainer = styled(motion.div)({
    maxWidth: '90vw',
    margin: 'auto',
    padding: '2rem',
    border: 'none',
    borderRadius: '8px',
    boxShadow: "4px 4px 12px -2.5px rgba(85, 166, 246, 0.15),4px 4px 12px -2.5px rgba(85, 166, 246, 0.15),4px 4px 12px -2.5px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)"
});

const FormHeading = styled(Typography)({
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
});

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
        Date: new Date().toISOString().substr(0, 10),
        PhoneNumber: '',
        Remarks: '',
    });

    const [paidLoanData, setPaidLoanData] = useState({
        LoanPaidDate: new Date().toISOString().substr(0, 10),
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
        const dataToSubmit = { ...formData };
        if (formData.Status === 'Completed') {
            dataToSubmit.PaidLoan = [paidLoanData];
        }
        await postFormData(dataToSubmit, dispatch, navigate);
    };

    const handlePaidLoanChange = (e) => {
        setPaidLoanData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };
    const uniqueAddresses = Array.from(new Set(getData.map(item => item.Address).filter(Boolean)));

    return (
        <>
            <FormContainer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                sx={{ position: 'relative' }}
            >
                <FormHeading variant="h6">Add Customers Data</FormHeading>
                <form component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="Name"
                                label="Name"
                                variant="outlined"
                                value={formData.Name}
                                onChange={handleChange}
                                fullWidth
                                required
                                placeholder="Customer name"
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
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
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    name="Category"
                                    value={formData.Category}
                                    onChange={handleChange}
                                    label="Category"
                                    required
                                    size='small'
                                >
                                    <MenuItem value="Gold">Gold</MenuItem>
                                    <MenuItem value="Silver">Silver</MenuItem>
                                    <MenuItem value="Bronze">Bronze</MenuItem>
                                    {/* <MenuItem value="Bike">Bike</MenuItem>
                                    <MenuItem value="Cycle">Cycle</MenuItem> */}
                                    <MenuItem value="Others">Others</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    name="Status"
                                    value={formData.Status}
                                    onChange={handleChange}
                                    label="Status"
                                    required
                                    size='small'
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                freeSolo
                                options={uniqueAddresses}
                                value={formData.Address}
                                onChange={(e, newValue) => {
                                    setFormData(prevData => ({
                                        ...prevData,
                                        Address: newValue,
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        name="Address"
                                        label="Address"
                                        variant="outlined"
                                        value={formData.Address}
                                        onChange={handleChange}
                                        fullWidth
                                        size='small'
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="Amount"
                                label="Amount"
                                variant="outlined"
                                value={formData.Amount}
                                onChange={handleChange}
                                fullWidth
                                required
                                size="small"
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
                                variant="outlined"
                                value={formData.Rate}
                                onChange={handleChange}
                                fullWidth
                                required
                                size="small"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="Weight"
                                label="Weight"
                                variant="outlined"
                                value={formData.Weight}
                                onChange={handleChange}
                                fullWidth
                                required
                                size="small"
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
                                variant="outlined"
                                value={formData.Date}
                                onChange={handleChange}
                                fullWidth
                                size='small'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="number"
                                name="PhoneNumber"
                                label="Phone Number"
                                variant="outlined"
                                value={formData.PhoneNumber}
                                onChange={handleChange}
                                fullWidth
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="Remarks"
                                label="Product detail"
                                variant="outlined"
                                value={formData.Remarks}
                                onChange={handleChange}
                                fullWidth
                                rows={4}
                                multiline
                                size='small'
                            />
                        </Grid>
                        {formData.Status === 'Completed' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ overflow: 'hidden', width: '100%' }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="date"
                                            name="LoanPaidDate"
                                            label="Loan Paid Date"
                                            variant="outlined"
                                            value={paidLoanData.LoanPaidDate}
                                            onChange={handlePaidLoanChange}
                                            fullWidth
                                            size='small'
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="number"
                                            name="loanPaidAmount"
                                            label="Loan Paid Amount"
                                            variant="outlined"
                                            value={paidLoanData.loanPaidAmount}
                                            onChange={handlePaidLoanChange}
                                            fullWidth
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                            </motion.div>
                        )}
                        <Grid item xs={12} display={'flex'} justifyContent="center" alignItems="center" gap={1}>
                            <Button type="submit" variant="outlined" color="success" size="large">
                                <SaveIcon />{loading ? <>Submit <CircularProgress size={20} /></> : "Submit"}
                            </Button>
                            <Button variant="text" onClick={() => { navigate('/') }}>Back</Button>
                        </Grid>
                    </Grid>
                </form>
            </FormContainer>
        </>
    );
};

export default FormPage;
