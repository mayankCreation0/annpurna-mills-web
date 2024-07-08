import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import { addStaff, updateStaff } from '../Api/AttendanceApis';
import { useDispatch } from 'react-redux';

const AddStaffModal = ({ open, handleClose, staff, isEdit }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEdit && staff) {
      setName(staff.name);
      setRole(staff.role);
    } else {
      setName('');
      setRole('');
    }
  }, [isEdit, staff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateStaff({ ...staff, name, role }, dispatch);
      } else {
        await addStaff({ name, role }, dispatch);
      }
      handleClose();
    } catch (error) {
      console.error('Error adding/updating staff', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEdit ? 'Edit Staff' : 'Add New Staff'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '16px' }}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginBottom: '16px' }}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>Close</Button>
        <Button onClick={handleSubmit} color="secondary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : (isEdit ? 'Update' : 'Add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStaffModal;
