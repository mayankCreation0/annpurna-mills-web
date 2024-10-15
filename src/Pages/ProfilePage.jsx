import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Loading from '../Components/Loading';
import { getActiveDevices } from '../Api/Apis';

const ProfilePage = ({ mode }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [activeDevices, setActiveDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                setError(null);

                const storedUserData = localStorage.getItem('userData');
                if (storedUserData) {
                    setUserProfile(JSON.parse(storedUserData));
                }

                const devicesData = await getActiveDevices(dispatch, navigate);
                setActiveDevices(devicesData);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setError('Failed to load profile data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [dispatch, navigate]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>User Profile</Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                <Typography>Name: {userProfile?.name}</Typography>
                <Typography>Username: {userProfile?.username}</Typography>
                {/* Add more user details as needed */}
            </Paper>

            <Typography variant="h5" gutterBottom>Active Devices</Typography>
            <Paper elevation={3}>
                <List>
                    {activeDevices.length > 0 ? (
                        activeDevices.map((device, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemText
                                        primary={device.deviceName}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2">
                                                    IP: {device.ipAddress}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2">
                                                    Last Login: {new Date(device.lastLogin).toLocaleString()}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2">
                                                    Location: {device.location?.city}, {device.location?.country}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < activeDevices.length - 1 && <Divider />}
                            </React.Fragment>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No active devices" />
                        </ListItem>
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default ProfilePage;