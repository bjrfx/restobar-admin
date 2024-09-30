import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems, secondaryListItems } from './listItems';
import AccountMenu from './AccountMenu';
import ReservationList from './ReservationList';
import ArchiveList from './ArchiveList';
import DetailedLogs from './DetailedLogs'; 
import DashHome from './DashHome';
import SubscriptionList from './SubscriptionList';
import { db, addDoc, collection, onSnapshot } from '../../../firebase/firebaseConfig';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function Dash({ profileName, handleSignOut }) {
  const [open, setOpen] = React.useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = React.useState('Dashboard');
  const [logs, setLogs] = React.useState([]);

  // Fetch logs from Firestore in real-time
  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'logs'), (snapshot) => {
      const logsData = snapshot.docs.map((doc) => doc.data());
      setLogs(logsData);
    });

    return () => unsubscribe();
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const addLogEntry = async (entry) => {
    const timestamp = new Date().toLocaleString();
    try {
      await addDoc(collection(db, 'logs'), {
        timestamp,
        entry,
        profileName,
      });
    } catch (error) {
      console.error('Error storing log in Firestore:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              {profileName}'s Dashboard
            </Typography>
            <AccountMenu profileName={profileName} handleSignOut={handleSignOut} />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems(handleMenuItemClick)}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems(handleMenuItemClick)}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {selectedMenuItem === 'Dashboard' && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <DashHome profileName={profileName} /> {/* Render DashHome */}
                  </Paper>
                </Grid>
              )}
              {selectedMenuItem === 'Subscription List' && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <SubscriptionList profileName={profileName} addLogEntry={addLogEntry} /> {/* Render SubscriptionList */}
                  </Paper>
                </Grid>
              )}
              {selectedMenuItem === 'Reservations' && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <ReservationList addLogEntry={addLogEntry} profileName={profileName} /> {/* Render ReservationList */}
                  </Paper>
                </Grid>
              )}
              {selectedMenuItem === 'Archive List' && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <ArchiveList addLogEntry={addLogEntry} profileName={profileName} /> {/* Render ArchiveList */}
                  </Paper>
                </Grid>
              )}
              {selectedMenuItem === 'Log' && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6">Logs</Typography>
                    {logs.length === 0 ? (
                      <Typography>No logs available.</Typography>
                    ) : (
                      logs.map((log, index) => (
                        <Typography key={index}>
                          {log.entry} at {log.timestamp}
                        </Typography>
                      ))
                    )}
                  </Paper>
                </Grid>
              )}
              {selectedMenuItem === 'Detailed Logs' && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <DetailedLogs /> {/* Render Detailed Logs */}
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}