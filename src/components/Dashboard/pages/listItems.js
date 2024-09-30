import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import ArchiveIcon from '@mui/icons-material/Archive';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryIcon from '@mui/icons-material/History';

export const mainListItems = (handleMenuItemClick) => (
  <React.Fragment>
    <ListItemButton onClick={() => handleMenuItemClick('Dashboard')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton onClick={() => handleMenuItemClick('Reservations')}>
      <ListItemIcon>
        <AssignmentTurnedInIcon />
      </ListItemIcon>
      <ListItemText primary="Reservations" />
    </ListItemButton>
    <ListItemButton onClick={() => handleMenuItemClick('Subscription List')}>
      <ListItemIcon>
        <ListIcon />
      </ListItemIcon>
      <ListItemText primary="Subscription List" />
    </ListItemButton>
    <ListItemButton onClick={() => handleMenuItemClick('Archive List')}>
      <ListItemIcon>
        <ArchiveIcon />
      </ListItemIcon>
      <ListItemText primary="Archive List" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (handleMenuItemClick) => (
  <React.Fragment>
    <ListItemButton onClick={() => handleMenuItemClick('Log')}>
      <ListItemIcon>
        <HistoryIcon />
      </ListItemIcon>
      <ListItemText primary="Logs" />
    </ListItemButton>
    <ListItemButton onClick={() => handleMenuItemClick('Detailed Logs')}>
      <ListItemIcon>
        <HistoryIcon />
      </ListItemIcon>
      <ListItemText primary="Detailed Logs" />
    </ListItemButton>
  </React.Fragment>
);