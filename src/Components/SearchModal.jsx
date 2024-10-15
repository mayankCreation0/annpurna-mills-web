import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal, Box, TextField, Autocomplete, CircularProgress, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getList } from '../Api/Apis';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

const SearchModal = ({ open, handleClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const customers = useSelector(state => state.getData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const inputRef = useRef(null);

    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 0);
        }
    }, [open]);

    async function fetchData() {
        setLoading(true);
        try {
            await getList(dispatch, navigate);
        } catch (error) {
            console.error("Error fetching customer data:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!customers || customers.length === 0) {
            fetchData();
        }
    }, [customers]);

    useEffect(() => {
        if (!open) {
            setSearchTerm('');
        }
    }, [open]);

    const searchResults = useMemo(() => {
        if (!searchTerm || searchTerm.length < 1 || !customers || customers.length === 0) {
            return [];
        }

        const searchLower = searchTerm.toLowerCase();
        return customers.filter(customer =>
            customer.Name.toLowerCase().includes(searchLower) ||
            customer.PhoneNumber.includes(searchTerm) ||
            (customer.Address && customer.Address.toLowerCase().includes(searchLower))
        ).sort((a, b) => {
            const aExactMatch = [a.Name, a.PhoneNumber, a.Address].some(field => field && field.toLowerCase() === searchLower);
            const bExactMatch = [b.Name, b.PhoneNumber, b.Address].some(field => field && field.toLowerCase() === searchLower);

            if (aExactMatch && !bExactMatch) return -1;
            if (!aExactMatch && bExactMatch) return 1;
            return a.Name.localeCompare(b.Name);
        });
    }, [searchTerm, customers]);

    const highlightMatch = (text, query) => {
        if (!query || !text) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ?
                <mark key={index} style={{ backgroundColor: 'yellow', padding: 0 }}>{part}</mark> : part
        );
    };

    const handleAddNewLoan = (customer) => {
        navigate('/form', { state: { customerData: customer } });
        handleClose();
    };

    const handleViewDetails = (customerId) => {
        navigate(`/view/${customerId}`);
        handleClose();
    };

    const NoResultsFound = () => (
        <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h6" gutterBottom>
                No customers found
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Would you like to add a new customer?
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                    navigate('/form');
                    handleClose();
                }}
                sx={{ mt: 2 }}
            >
                Add New Customer
            </Button>
        </Box>
    );

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="search-modal-title"
            aria-describedby="search-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '90%' : 600,
                maxHeight: '80vh',
                overflowY: 'auto',
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                p: isMobile ? 2 : 4,
            }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <SearchIcon sx={{ mr: 1 }} />
                    Search Customers
                </Typography>
                <Autocomplete
                    freeSolo
                    options={searchResults}
                    getOptionLabel={(option) => `${option.Name} - ${option.PhoneNumber}`}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            inputRef={inputRef}
                            label="Search by name or phone no."
                            variant="outlined"
                            fullWidth
                            autoFocus
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} key={option._id} sx={{
                            '&:hover': { bgcolor: 'action.hover' },
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'flex-start' : 'center',
                            p: 1.5,  // Reduced padding
                        }}>
                            <Box sx={{ flexGrow: 1, width: '100%' }}>
                                <Typography variant="body2" sx={{ fontSize: '14px' }}>
                                    {highlightMatch(option.Name, searchTerm)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                                    {highlightMatch(option.PhoneNumber, searchTerm)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                                    {highlightMatch(option.Address, searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                                mt: isMobile ? 1 : 0,
                                width: isMobile ? '100%' : 'auto',
                                justifyContent: isMobile ? 'space-between' : 'flex-end',
                                alignItems: 'center',
                            }}>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    sx={{
                                        padding: '4px 8px',
                                        fontSize: '12px'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddNewLoan(option);
                                    }}
                                >
                                    Add New Loan
                                </Button>
                                <Button
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    sx={{
                                        padding: '4px 8px',
                                        fontSize: '12px'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDetails(option._id);
                                    }}
                                >
                                    View loan
                                </Button>
                            </Box>
                        </Box>
                    )}
                    loading={loading}
                    loadingText="Fetching customers..."
                    noOptionsText={
                        searchTerm.length < 3
                            ? "Enter at least 3 characters"
                            : searchTerm.length >= 3 && searchResults.length === 0
                                ? <NoResultsFound />
                                : null
                    }
                    filterOptions={(x) => x} // Disable built-in filtering
                />
                {searchTerm.length >= 3 && searchResults.length === 0 && !loading && (
                    <NoResultsFound />
                )}
            </Box>
        </Modal>
    );
};

export default SearchModal;
