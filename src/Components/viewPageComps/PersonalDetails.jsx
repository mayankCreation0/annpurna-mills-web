import React from 'react';
import {
    Typography,
    Grid,
    Box,
    Stack,
    IconButton,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    CircularProgress,
    Avatar,
    Button
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import MaleImg from '../../Assets/Profile/Ava_Male.jpg';
import FemaleImg from '../../Assets/Profile/Ava_Female.jpg';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 80,
    height: 80,
    border: `4px solid ${theme.palette.background.paper}`,
    boxShadow: theme.shadows[3],
}));

const PersonalDetails = ({ customer, isEdit, setIsEdit, handleUpdate, isLoading, setCustomer }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                marginBottom: 4,
                backgroundColor: theme.palette.background.paper,
                padding: 2,
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                position: 'relative',
            }}
        >
            {/* Heading and Edit Icon */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ color: theme.palette.primary.main }}>
                    Customer Details
                </Typography>
                <IconButton
                    onClick={() => setIsEdit(!isEdit)}
                    sx={{ color: theme.palette.primary.main }}
                >
                    {isEdit ? <CloseIcon /> : <CreateIcon />}
                </IconButton>
            </Box>

            <Grid container spacing={3} alignItems="center">
                {/* Avatar Section */}
                <Grid item xs={12} sm={12} md={6} display="flex" alignItems="center" gap={2}>
                    <StyledAvatar src={customer.Gender === 'male' ? MaleImg : FemaleImg} />
                    {/* Name and Phone Section */}
                    <Grid item xs={12} sm={9}>
                        <Stack spacing={1}>
                            {isEdit ? (
                                <TextField
                                    label="Name"
                                    value={customer.Name}
                                    onChange={(e) => setCustomer({ ...customer, Name: e.target.value })}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                />
                            ) : (
                                <Typography variant="h4" sx={{ fontWeight: '600', textTransform: 'capitalize', mt: 2, mb: 1, color: theme.palette.text.primary }}>
                                    {customer.Name}
                                </Typography>
                            )}
                            {isEdit ? (
                                <TextField
                                    label="Phone"
                                    value={customer.PhoneNumber}
                                    onChange={(e) => setCustomer({ ...customer, PhoneNumber: e.target.value })}
                                    fullWidth
                                    variant="outlined"
                                />
                            ) : (
                                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                    <strong>PhNo:</strong> {customer.PhoneNumber}
                                </Typography>
                            )}
                        </Stack>
                    </Grid>
                </Grid>

               
            </Grid>

            {/* Address and Gender */}
            <Box sx={{ mt: 3 }}>
                {isEdit ? (
                    <>
                        <TextField
                            label="Address"
                            value={customer.Address}
                            onChange={(e) => setCustomer({ ...customer, Address: e.target.value })}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={2}
                            sx={{ mb: 2 }}
                        />
                        <ToggleButtonGroup
                            value={customer.Gender}
                            exclusive
                            onChange={(e, value) => setCustomer({ ...customer, Gender: value })}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            <ToggleButton value="male">
                                <MaleIcon sx={{ mr: 1 }} /> Male
                            </ToggleButton>
                            <ToggleButton value="female">
                                <FemaleIcon sx={{ mr: 1 }} /> Female
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </>
                ) : (
                    <>
                        <Typography variant="body1" className='capitalize' sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                            <strong>Address:</strong> {customer.Address}
                        </Typography>
                        <Typography variant="body1" className='capitalize' sx={{ color: theme.palette.text.secondary }}>
                            <strong>Gender:</strong> {customer.Gender}
                        </Typography>
                    </>
                )}
            </Box>

            {/* Update Button */}
            {isEdit && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                        onClick={handleUpdate}
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                        sx={{
                            padding: '6px 24px',
                            '&:disabled': {
                                backgroundColor: theme.palette.action.disabledBackground,
                            },
                        }}
                    >
                        {isLoading ? 'Updating...' : 'Update'}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default PersonalDetails;
