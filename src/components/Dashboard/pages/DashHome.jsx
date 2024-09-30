// src/components/Dashboard/pages/DashHome.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const DashHome = ({profileName}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard, {profileName}!
      </Typography>
      <Typography>
        This is the home page of your dashboard. You can view graphs, stats, or any other relevant information here.
      </Typography>
    </Box>
  );
};

export default DashHome;