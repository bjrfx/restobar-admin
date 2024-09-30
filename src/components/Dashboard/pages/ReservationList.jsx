import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Box, TextField, Card, CardContent, Switch, FormControlLabel, ButtonGroup, Button } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingReservation, setEditingReservation] = useState(null);
  const [editedData, setEditedData] = useState({
    Name: '',
    "Phone Number": '',
    "Start Date": '',
    "Start Time": '',
    Persons: '',
  });
  const [showEdit, setShowEdit] = useState(false);  // Switch state
  const [viewMode, setViewMode] = useState('list');  // View mode: 'list' or 'grid'

  useEffect(() => {
    fetchReservations();
  }, []);

  // Fetch the current reservations from Airtable
  const fetchReservations = async () => {
    const response = await fetch('https://api.airtable.com/v0/appcRUV4NMy7IsDFI/tblqkjaFo2onOs9Tm?view=Grid%20view', {
      headers: {
        Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
      },
    });
    const data = await response.json();
    if (data.records) {
      const activeReservations = data.records.map(record => ({
        id: record.id,
        Name: record.fields.Name,
        "Phone Number": record.fields["Phone Number"],
        "Start Date": record.fields["Start Date"],
        "Start Time": record.fields["Start Time"],
        Persons: record.fields.Persons,
      }));
      setReservations(activeReservations);
    }
  };

  // Handle editing reservations
  const handleEdit = (reservation) => {
    setEditingReservation(reservation.id);
    setEditedData({
      Name: reservation.Name,
      "Phone Number": reservation["Phone Number"],
      "Start Date": reservation["Start Date"],
      "Start Time": reservation["Start Time"],
      Persons: reservation.Persons,
    });
  };

  const handleSave = async () => {
    const updatedData = {
      Name: editedData.Name,
      "Phone Number": editedData["Phone Number"],
      "Start Date": editedData["Start Date"],
      "Start Time": editedData["Start Time"],
      Persons: parseInt(editedData.Persons, 10),
    };

    await fetch(`https://api.airtable.com/v0/appcRUV4NMy7IsDFI/tblqkjaFo2onOs9Tm/${editingReservation}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
      },
      body: JSON.stringify({ fields: updatedData }),
    });

    setEditingReservation(null);
    fetchReservations();
  };

  // Archive reservations from two days ago or earlier
  const handleArchiveOld = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to 00:00:00

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2); // Set to two days ago

    const reservationsToArchive = reservations.filter(reservation => {
      const reservationDate = new Date(reservation["Start Date"]);
      reservationDate.setHours(0, 0, 0, 0); // Set reservation time to 00:00:00 for comparison

      // Archive only if reservation date is two days ago or earlier
      return reservationDate.getTime() <= twoDaysAgo.getTime(); 
    });

    for (let reservation of reservationsToArchive) {
      await archiveReservation(reservation);  // Archive each old reservation
      await deleteReservation(reservation.id);  // Delete from current table
    }

    fetchReservations();  // Refresh after archiving
  };

  // Move a reservation to the archive table
  const archiveReservation = async (reservation) => {
    const archivedData = {
      fields: {
        Name: reservation.Name,
        "Phone Number": reservation["Phone Number"],
        "Start Date": reservation["Start Date"],
        "Start Time": reservation["Start Time"],
        Persons: reservation.Persons,
      },
    };

    await fetch('https://api.airtable.com/v0/appR9pTEld4i3NTFJ/tblm0Bfb2n9HlvjdJ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
      },
      body: JSON.stringify(archivedData),
    });
  };

  // Delete the reservation from the current table
  const deleteReservation = async (id) => {
    await fetch(`https://api.airtable.com/v0/appcRUV4NMy7IsDFI/tblqkjaFo2onOs9Tm/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
      },
    });
  };

  // Filter reservations based on search term
  const filteredReservations = reservations.filter((reservation) =>
    reservation.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation["Phone Number"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation["Start Date"].includes(searchTerm) ||
    reservation["Start Time"].includes(searchTerm) ||
    reservation.Persons.toString().includes(searchTerm)
  );

  return (
    <TableContainer component={Paper}>
      <Box>
        {/* Top controls: Archive old button, Edit switch, and View mode */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
          <Button onClick={handleArchiveOld} variant="contained" color="primary">
            Archive Old
          </Button>

          <FormControlLabel
            control={<Switch checked={showEdit} onChange={(e) => setShowEdit(e.target.checked)} />}
            label="Show Edit"
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
          Current Reservations: {filteredReservations.length}
        </Typography>

        <TextField
          label="Search Reservations"
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
                <TableCell>Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Persons</TableCell>
                {showEdit && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  {editingReservation === reservation.id ? (
                    <>
                      <TableCell>
                        <TextField
                          value={editedData.Name}
                          onChange={(e) => setEditedData({ ...editedData, Name: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedData["Phone Number"]}
                          onChange={(e) => setEditedData({ ...editedData, "Phone Number": e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="date"
                          value={editedData["Start Date"]}
                          onChange={(e) => setEditedData({ ...editedData, "Start Date": e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="time"
                          value={editedData["Start Time"]}
                          onChange={(e) => setEditedData({ ...editedData, "Start Time": e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={editedData.Persons}
                          onChange={(e) => setEditedData({ ...editedData, Persons: e.target.value })}
                        />
                      </TableCell>
                      {showEdit && (
                        <TableCell>
                          <IconButton onClick={handleSave}>
                            Save
                          </IconButton>
                        </TableCell>
                      )}
                    </>
                  ) : (
                    <>
                      <TableCell>{reservation.Name}</TableCell>
                      <TableCell>{reservation["Phone Number"]}</TableCell>
                      <TableCell>{reservation["Start Date"]}</TableCell>
                      <TableCell>{reservation["Start Time"]}</TableCell>
                      <TableCell>{reservation.Persons}</TableCell>
                      {showEdit && (
                        <TableCell>
                          <IconButton onClick={() => handleEdit(reservation)}><FaEdit /></IconButton>
                        </TableCell>
                      )}
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} sx={{ width: '300px' }}>
                <CardContent>
                  <Typography variant="h6">{reservation.Name}</Typography>
                  <Typography variant="body2">Phone: {reservation["Phone Number"]}</Typography>
                  <Typography variant="body2">Date: {reservation["Start Date"]}</Typography>
                  <Typography variant="body2">Time: {reservation["Start Time"]}</Typography>
                  <Typography variant="body2">Persons: {reservation.Persons}</Typography>
                  {showEdit && (
                    <IconButton onClick={() => handleEdit(reservation)}><FaEdit /></IconButton>
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

export default ReservationList;