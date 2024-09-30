import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, ButtonGroup, Button, Card, CardContent, IconButton } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

const DetailedLogs = () => {
  const [deletedReservations, setDeletedReservations] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // View mode: 'table' or 'grid'

  useEffect(() => {
    fetchDeletedReservations();
  }, []);

  const fetchDeletedReservations = async () => {
    const querySnapshot = await getDocs(collection(db, 'deletedReservations'));
    const logs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDeletedReservations(logs);
  };

  return (
    <Box>
      {/* Switch between table and card view */}
      <ButtonGroup sx={{ mb: 2 }}>
        <Button onClick={() => setViewMode('table')} variant={viewMode === 'table' ? 'contained' : 'outlined'}>
          <ViewListIcon />
        </Button>
        <Button onClick={() => setViewMode('grid')} variant={viewMode === 'grid' ? 'contained' : 'outlined'}>
          <GridViewIcon />
        </Button>
      </ButtonGroup>

      <Typography variant="h6" sx={{ padding: 2 }}>
        Detailed Deleted Reservation Logs: {deletedReservations.length}
      </Typography>

      {viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Persons</TableCell>
                <TableCell>Deleted By</TableCell>
                <TableCell>Deleted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deletedReservations.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.Name}</TableCell>
                  <TableCell>{log["Phone Number"]}</TableCell>
                  <TableCell>{log["Start Date"]}</TableCell>
                  <TableCell>{log["Start Time"]}</TableCell>
                  <TableCell>{log.Persons}</TableCell>
                  <TableCell>{log.deletedBy}</TableCell>
                  <TableCell>{log.deletedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {deletedReservations.map((log) => (
            <Card key={log.id} sx={{ width: 300 }}>
              <CardContent>
                <Typography variant="h6">{log.Name}</Typography>
                <Typography variant="body2">Phone: {log["Phone Number"]}</Typography>
                <Typography variant="body2">Date: {log["Start Date"]}</Typography>
                <Typography variant="body2">Time: {log["Start Time"]}</Typography>
                <Typography variant="body2">Persons: {log.Persons}</Typography>
                <Typography variant="body2">Deleted By: {log.deletedBy}</Typography>
                <Typography variant="body2">Deleted At: {log.deletedAt}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DetailedLogs;