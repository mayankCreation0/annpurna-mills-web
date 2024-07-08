import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define the modal style
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none', // Remove the border
    borderRadius: '8px', // Rounded corners
    boxShadow: 24,
    p: 4,
};

// Define a custom theme to blur the backdrop
const theme = createTheme({
    components: {
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(5px)', // Apply blur effect
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly transparent background
                },
            },
        },
    },
});

export default function TransitionsModal({ open, handleClose, handleConfirm }) {
    return (
        <ThemeProvider theme={theme}>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Confirm Deletion
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            Are you sure you want to delete this item?
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button variant="contained" color="error" onClick={handleConfirm}>
                                Yes, Delete
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ ml: 2 }}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </ThemeProvider>
    );
}
