import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, IconButton, InputAdornment, Stack } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ThemeToggle from '../Components/ThemeToggle';
import { signupApi } from '../Api/Apis'; // Import your signup API function

function Copyright(props) {
    return (
        <Typography variant="p" {...props} sx={{ color: "applicationTheme.primaryColor_2" }}>
            {'Copyright © '}
            <Link variant='p' href="https://annpurna-mills.vercel.app/" sx={{ color: "applicationTheme.primaryColor_2", textDecoration: "none" }}>
                Annpurna Mills
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function SignupPage() {
    const [showPassword, setShowPassword] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(state => state.loading);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmitSignup = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const payload = {
            name: data.get('name'),
            username: data.get('username'),
            password: data.get('password'),
        }
        await signupApi(payload, dispatch, navigate);
    };

    return (
        <Grid container sx={{ height: '100vh', width: "100%", bgcolor: "applicationTheme.primary" }} spacing={0}>
          <Grid item display="block" xs={12} md={6} lg={6} xl={7} className={`h-52 min-[900px]:h-auto relative XsloginBg`}>
                <img src="https://app.svgator.com/assets/svgator.webapp/log-in-girl.svg" alt="" className='h-[100vh] w-full object-fill hidden min-[900px]:block' style={{ background: "radial-gradient(circle, #202047 0, #020917 100%)" }} />

                <img src="https://app.svgator.com/assets/svgator.webapp/log-in-girl.svg" alt="img" style={{ height: 'inherit', width: '100vw', background: "radial-gradient(circle, #202047 0, #020917 100%)" }} className="sm:hidden block" />
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={5} className='h-auto min-[900px]:h-[100vh]' sx={{ width: "100%", paddingBottom: { xs: '0px', md: '30px' }, bgcolor: "applicationTheme.primary" }}>
                <ThemeToggle sx={{ position: 'fixed', right: '10px', top: '10px', zIndex: '50' }} />
                <Stack flexDirection={'column'} justifyContent={{ xs: 'start', md: 'space-around' }} alignItems={'center'} width={"100%"} height={'100%'} spacing={{ xs: 10, md: 0 }} className='h-screen'>
                    <Container className='!w-full min-[500px]:!w-[450px]' component="main" sx={{ bgcolor: "transparent" }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'start',
                            }}
                        >
                            <Typography component="h1" variant="h1" sx={{ color: "applicationTheme.secondaryColor_1", mt: 3, mb: 2, textAlign: "left" }}>
                                Hey
                                <Typography component="h1" variant="h1" sx={{ color: "applicationTheme.main" }} >
                                    there!
                                </Typography>
                            </Typography>
                            <Typography component="h5" variant="h5" sx={{ color: "applicationTheme.secondaryColor_1", fontWeight: "400" }}>
                                Sign Up
                            </Typography>
                            <Box component="form" onSubmit={handleSubmitSignup} noValidate sx={{ mt: 1, mb: 6 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    name="name"
                                    autoComplete="name"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="new-password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff sx={{ color: "applicationTheme.primaryColor_2" }} /> : <Visibility sx={{ color: "applicationTheme.primaryColor_2" }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mb: 3, padding: "12px 0px", fontSize: "19px" }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Stack>
            </Grid>
        </Grid>
    );
}
