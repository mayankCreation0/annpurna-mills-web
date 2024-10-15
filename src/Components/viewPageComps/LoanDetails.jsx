import React, { useState } from 'react';
import { Typography, Box, Modal, IconButton, Button, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LoanAccordion from './LoanAccordion';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const LoanDetails = ({ customer, setCustomer, handleLoanUpdate, isLoading }) => {
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();


    const handleMediaClick = (mediaType, loan) => {
        if (loan.media && loan.media[mediaType]) {
            setSelectedMedia({
                type: mediaType,
                data: loan.media[mediaType]
            });
            setMediaModalOpen(true);
        }
    };

    const handleLoanDelete = (index) => {
        const updatedLoans = customer.Loans.filter((_, i) => i !== index);
        const updatedCustomer = { ...customer, Loans: updatedLoans };
        setCustomer(updatedCustomer);
        handleLoanUpdate(updatedCustomer);
    };
    const handleAddNewLoan = () => {
        navigate('/form', {
            state: {
                customerData: {
                    Name: customer.Name,
                    Gender: customer.Gender,
                    Address: customer.Address,
                    PhoneNumber: customer.PhoneNumber
                }
            }
        });
    };

    const ModernButton = styled(Button)(({ theme }) => ({
        background: 'transparent',
        border: `2px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        fontWeight: 600,
        padding: '10px 20px',
        borderRadius: '30px',
        transition: 'all 0.3s ease',
        boxShadow: 'none',
        textTransform: 'none', // Prevents all-caps text
        '&:hover': {
            background: theme.palette.primary.main,
            color: theme.palette.common.white,
            boxShadow: `0 4px 8px ${theme.palette.primary.main}40`,
        },
    }));

    const handleIndividualLoanUpdate = async (updatedCustomer) => {
        await handleLoanUpdate(updatedCustomer);
    };
    const renderMedia = () => {
        if (!selectedMedia || !selectedMedia.data) return null;
        if (selectedMedia.type === 'image') {
            return (
                <img
                    src={selectedMedia.data.url}
                    alt="Loan Item"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                />
            );
        } else if (selectedMedia.type === 'video') {
            return (
                <video controls style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}>
                    <source src={selectedMedia.data.url} type={`video/${selectedMedia.data.format}`} />
                    Your browser does not support the video tag.
                </video>
            );
        }
    };

    return (
        <Box sx={{ marginBottom: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h5" sx={{ color: theme.palette.primary.main }}>Loan Details</Typography>
                <ModernButton
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddNewLoan}
                >
                    Add New Loan
                </ModernButton>
            </Box>
            {customer.Loans.filter(loan => loan !== null).map((loan, index) => (
                <LoanAccordion
                    key={index}
                    loan={loan}
                    index={index}
                    customer={customer}
                    setCustomer={setCustomer}
                    handleLoanUpdate={handleIndividualLoanUpdate}
                    isLoading={isLoading}
                    handleMediaClick={handleMediaClick}
                    handleLoanDelete={handleLoanDelete}
                />
            ))}

            {/* Media Modal */}
            <Modal
                open={mediaModalOpen}
                onClose={() => setMediaModalOpen(false)}
                aria-labelledby="media-modal-title"
            >
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1300
                }}>
                    <IconButton
                        onClick={() => setMediaModalOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'white',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{
                        position: 'relative',
                        maxWidth: '90%',
                        maxHeight: '90%',
                        overflow: 'hidden',
                        borderRadius: 2,
                        boxShadow: 24,
                    }}>
                        {renderMedia()}
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default LoanDetails;