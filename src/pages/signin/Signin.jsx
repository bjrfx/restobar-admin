import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../../firebase/firebaseConfig'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://bdotsoftware.com">
                BDOT Software
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Sign in user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            setSuccess('Login successful! Redirecting to dashboard...');
            setEmail('');
            setPassword('');

            // Redirect to the Dashboard
            navigate('/dashboard'); // Adjust the path based on your routing configuration
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Error logging in. Please try again.');
        }
    };

    const handleClose = () => {
        navigate('/'); // Redirect to the home page
    };
    const [isLinkDisabled, setIsLinkDisabled] = useState(true); // Change this to control the link state

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative', // Ensure the close button is positioned correctly
                    }}
                >
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handleChange}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to='/forgot-password'>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                {/* <Link to='/signup' variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link> */}
                                {isLinkDisabled ? (
                                    <Typography variant="body2" style={{ color: 'gray', cursor: 'not-allowed' }}>
                                        {"Don't have an account? Sign Up"}
                                    </Typography>
                                ) : (
                                    <Link to='/signup' variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                    {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                    {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}