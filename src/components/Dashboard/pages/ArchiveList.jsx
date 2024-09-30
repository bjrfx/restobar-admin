import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Box, TextField, Card, CardContent, Switch, FormControlLabel, ButtonGroup, Button, Checkbox } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { db, addDoc, collection } from '../../../firebase/firebaseConfig'; // Firebase Firestore imports

const ArchiveList = ({ profileName, addLogEntry }) => {
  const [archivedReservations, setArchivedReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');  // View mode: 'list' or 'grid'
  const [showCheckbox, setShowCheckbox] = useState(false);  // Switch state for showing checkboxes
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [showEditDelete, setShowEditDelete] = useState(false);  // Switch for edit and delete

  useEffect(() => {
    fetchArchivedReservations();
  }, []);

  const fetchArchivedReservations = async () => {
    const response = await fetch('https://api.airtable.com/v0/appR9pTEld4i3NTFJ/tblm0Bfb2n9HlvjdJ?view=Grid%20view', {
      headers: {
        Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
      },
    });
    const data = await response.json();
    if (data.records) {
      const archived = data.records.map(record => ({
        id: record.id,
        Name: record.fields.Name,
        "Phone Number": record.fields["Phone Number"],
        "Start Date": record.fields["Start Date"],
        "Start Time": record.fields["Start Time"],
        Persons: record.fields.Persons,
      }));
      setArchivedReservations(archived);
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedReservations.includes(id)) {
      setSelectedReservations(selectedReservations.filter(reservationId => reservationId !== id));
    } else {
      setSelectedReservations([...selectedReservations, id]);
    }
  };

  const handleMoveToCurrent = async () => {
    for (let id of selectedReservations) {
      const reservation = archivedReservations.find(res => res.id === id);
      if (reservation) {
        await moveToCurrent(reservation);
        await deleteFromArchive(id);  // Remove from archive after moving
        addLogEntry(`${profileName} moved reservation to current database: ${reservation.Name}`);
      }
    }
    fetchArchivedReservations();  // Refresh the archived list after moving
  };

  const moveToCurrent = async (reservation) => {
    const currentData = {
      fields: {
        Name: reservation.Name,
        "Phone Number": reservation["Phone Number"],
        "Start Date": reservation["Start Date"],
        "Start Time": reservation["Start Time"],
        Persons: reservation.Persons,
      },
    };

    await fetch('https://api.airtable.com/v0/appcRUV4NMy7IsDFI/tblqkjaFo2onOs9Tm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
      },
      body: JSON.stringify(currentData),
    });
  };

  const deleteFromArchive = async (id) => {
    await fetch(`https://api.airtable.com/v0/appR9pTEld4i3NTFJ/tblm0Bfb2n9HlvjdJ/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
      },
    });
  };

  const handleDelete = async (reservation) => {
    await deleteFromArchive(reservation.id);
    addLogEntry(`${profileName} deleted reservation: ${reservation.Name}`);

    // Store deleted reservation data in Firestore
    try {
      await addDoc(collection(db, 'deletedReservations'), {
        Name: reservation.Name,
        "Phone Number": reservation["Phone Number"],
        "Start Date": reservation["Start Date"],
        "Start Time": reservation["Start Time"],
        Persons: reservation.Persons,
        deletedBy: profileName,
        deletedAt: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Error saving deleted reservation to Firestore:', error);
    }

    fetchArchivedReservations();
  };

  const handleEdit = (reservation) => {
    addLogEntry(`${profileName} edited reservation: ${reservation.Name}`);
    // Edit functionality would go here
  };

  const filteredArchivedReservations = archivedReservations.filter((reservation) =>
    reservation.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation["Phone Number"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation["Start Date"].includes(searchTerm) ||
    reservation["Start Time"].includes(searchTerm) ||
    reservation.Persons.toString().includes(searchTerm)
  );

  return (
    <TableContainer component={Paper}>
      <Box>
        {/* Top controls: Switch for checkbox, Move to Current, View mode */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
          <FormControlLabel
            control={<Switch checked={showCheckbox} onChange={(e) => setShowCheckbox(e.target.checked)} />}
            label="Show Checkbox"
          />
          <FormControlLabel
            control={<Switch checked={showEditDelete} onChange={(e) => setShowEditDelete(e.target.checked)} />}
            label="Show Edit/Delete"
          />

          {showCheckbox && (
            <Button onClick={handleMoveToCurrent} variant="contained" color="primary">
              Move to Current Database
            </Button>
          )}

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
          Archived Reservations: {filteredArchivedReservations.length}
        </Typography>

        <TextField
          label="Search Archived Reservations"
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
                {showCheckbox && <TableCell>Checkbox</TableCell>}
                <TableCell>Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Persons</TableCell>
                {showEditDelete && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredArchivedReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  {showCheckbox && (
                    <TableCell>
                      <Checkbox
                        checked={selectedReservations.includes(reservation.id)}
                        onChange={() => handleCheckboxChange(reservation.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{reservation.Name}</TableCell>
                  <TableCell>{reservation["Phone Number"]}</TableCell>
                  <TableCell>{reservation["Start Date"]}</TableCell>
                  <TableCell>{reservation["Start Time"]}</TableCell>
                  <TableCell>{reservation.Persons}</TableCell>
                  {showEditDelete && (
                    <TableCell>
                      <IconButton onClick={() => handleEdit(reservation)}><FaEdit /></IconButton>
                      <IconButton onClick={() => handleDelete(reservation)}><FaTrashAlt /></IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {filteredArchivedReservations.map((reservation) => (
              <Card key={reservation.id} sx={{ width: '300px' }}>
                <CardContent>
                  <Typography variant="h6">{reservation.Name}</Typography>
                  <Typography variant="body2">Phone: {reservation["Phone Number"]}</Typography>
                  <Typography variant="body2">Date: {reservation["Start Date"]}</Typography>
                  <Typography variant="body2">Time: {reservation["Start Time"]}</Typography>
                  <Typography variant="body2">Persons: {reservation.Persons}</Typography>
                  {showCheckbox && (
                    <Checkbox
                      checked={selectedReservations.includes(reservation.id)}
                      onChange={() => handleCheckboxChange(reservation.id)}
                    />
                  )}
                  {showEditDelete && (
                    <>
                      <IconButton onClick={() => handleEdit(reservation)}><FaEdit /></IconButton>
                      <IconButton onClick={() => handleDelete(reservation)}><FaTrashAlt /></IconButton>
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

export default ArchiveList;