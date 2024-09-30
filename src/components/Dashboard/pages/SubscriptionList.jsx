// src/components/Dashboard/pages/SubscriptionList.jsx
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Box, TextField, Card, CardContent, Switch, FormControlLabel, ButtonGroup, Button } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const SubscriptionList = ({ addLogEntry, profileName }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');  // View mode: 'list' or 'grid'
  const [showEditDelete, setShowEditDelete] = useState(false);  // Switch for edit and delete

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('https://api.airtable.com/v0/appnTHlJCaYJJOfhN/tblLpBnM72RerRDjY', {
        headers: {
          Authorization: 'Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e',
        },
      });
      const data = await response.json();
      if (data.records) {
        setSubscriptions(data.records.map(record => ({
          id: record.id,
          email: record.fields.Email || '',
        })));
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleDelete = async (id) => {
    // Delete subscription from Airtable and log action
    try {
      await fetch(`https://api.airtable.com/v0/appnTHlJCaYJJOfhN/tblLpBnM72RerRDjY/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e',
        },
      });
      setSubscriptions(subscriptions.filter(subscription => subscription.id !== id));
      addLogEntry(`${profileName} deleted subscription: ${id}`);
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const handleEdit = (subscription) => {
    // Log edit action (actual edit logic can be implemented here)
    addLogEntry(`${profileName} edited subscription: ${subscription.email}`);
  };

  const filteredSubscriptions = subscriptions.filter((subscription) =>
    subscription.email && subscription.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TableContainer component={Paper}>
      <Box>
        {/* Top controls: Switch for edit/delete and view mode */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
          <FormControlLabel
            control={<Switch checked={showEditDelete} onChange={(e) => setShowEditDelete(e.target.checked)} />}
            label="Show Edit/Delete"
          />

          <ButtonGroup>
            <Button onClick={() => setViewMode('list')} variant={viewMode === 'list' ? 'contained' : 'outlined'}>
              <ViewListIcon />
            </Button>
            <Button onClick={() => setViewMode('grid')} variant={viewMode === 'grid' ? 'contained' : 'outlined'}>
              <GridViewIcon />
            </Button>
          </ButtonGroup>
        </Box>

        <Typography variant="h6" sx={{ padding: 2 }}>
          Active Subscriptions: {filteredSubscriptions.length}
        </Typography>

        <TextField
          label="Search Subscriptions"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Render Table or Grid based on viewMode */}
        {viewMode === 'list' ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                {showEditDelete && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>{subscription.email}</TableCell>
                  {showEditDelete && (
                    <TableCell>
                      <IconButton onClick={() => handleEdit(subscription)}><FaEdit /></IconButton>
                      <IconButton onClick={() => handleDelete(subscription.id)}><FaTrashAlt /></IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {filteredSubscriptions.map((subscription) => (
              <Card key={subscription.id} sx={{ width: '300px' }}>
                <CardContent>
                  <Typography variant="h6">{subscription.email}</Typography>
                  {showEditDelete && (
                    <>
                      <IconButton onClick={() => handleEdit(subscription)}><FaEdit /></IconButton>
                      <IconButton onClick={() => handleDelete(subscription.id)}><FaTrashAlt /></IconButton>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </TableContainer>
  );
};

export default SubscriptionList;