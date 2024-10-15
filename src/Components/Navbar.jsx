import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { handleAuth } from '../Store/Reducers/Reducer';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import blackLogo_xs from '../Assets/logo/blackLogo_xs.png';
import whiteLogo_xs from '../Assets/logo/lightLogo_xs.png';
import blackLogo_lg from '../Assets/logo/blackLogo_lg.png';
import whiteLogo_lg from '../Assets/logo/lightLogo_lg.png'; 
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';
import { useTheme, useMediaQuery, keyframes } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchModal from './SearchModal';
import Menu from '@mui/material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const logoStyle = {
    width: '100px',
    height: '3.5rem',
    cursor: 'pointer',
};

const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Customer List', icon: <ListIcon />, path: '/customerLists' },
    { text: 'Add Customer', icon: <AddIcon />, path: '/form' },
    { text: 'Transaction', icon: <ListIcon />, path: '/history' },
    { text: 'Staff', icon: <AddIcon />, path: '/staff' },
];

function Navbar({ sx }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const mode = useSelector(state => state.mode);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchModalOpen, setSearchModalOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };

    const handleLogout = () => {
        Cookies.remove('token', { path: '/' });
        dispatch(handleAuth(false));
        navigate('/login');
        handleClose();
    };
    const handleSearchClick = () => {
        setSearchModalOpen(true);
    };

    const handleSearchModalClose = () => {
        setSearchModalOpen(false);
    };
    let logoSrc = window.innerWidth < 900 ? (mode === 'dark' ? whiteLogo_xs : blackLogo_xs ) : (mode === 'dark' ? blackLogo_lg : whiteLogo_lg) ;

    React.useEffect(() => { }, [mode, isMobile]);

    const rgbAnimation = keyframes`
        0% { border-color: rgb(255, 0, 0); }
        33% { border-color: rgb(0, 255, 0); }
        66% { border-color: rgb(0, 0, 255); }
        100% { border-color: rgb(255, 0, 0); }
        `;

    const SearchButton = React.forwardRef((props, ref) => (
        <Button
            ref={ref}
            onClick={handleSearchClick}
            sx={{
                minWidth: 'auto',
                p: 0.5,
                bgcolor: 'applicationTheme.primary',
                color: 'applicationTheme.secondary',
                border: '2px solid',
                borderRadius: '50%',
                animation: `${rgbAnimation} 4s linear infinite`,
                '&:hover': {
                    bgcolor: 'applicationTheme.secondary',
                    color: 'applicationTheme.primary',
                    transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
            }}
            {...props}
        >
            <SearchIcon />
        </Button>
    ));

    const AnimatedSearchButton = motion(SearchButton);
    return (
        <>
            <Box display={{ xs: 'none', md: 'flex' }} sx={{ justifyItems: "start", alignItems: "center", gap: "20px", width: "100%", }}>
                <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', bgcolor: "applicationTheme.secondary", padding: '5px 10px', borderRadius: '30px', borderBottom: "1px solid lightgrey", ...sx }}>
                    <img
                        src={logoSrc}
                        style={logoStyle}
                        alt="logo of sitemark"
                        className='!w-[100px] !h-12 ml-4'
                        onClick={() => navigate('/')}
                    />
                    <Stack flexDirection={'row'} spacing={'20px'} justifyContent={'start'} alignItems={'center'} gap={"20px"}>
                        {menuItems.map((item, index) => (
                            <MenuItem
                                disableRipple={true}
                                key={index}
                                onClick={() => navigate(item.path)}
                                className='!m-0'
                                sx={{
                                    display: 'flex',
                                    flexDirection: "row",
                                    gap: "1px",
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'transparent',
                                    borderRadius: "0",
                                    ":hover": {
                                        backgroundColor: 'transparent',
                                    },
                                    ":focus": {
                                        backgroundColor: 'transparent',
                                    },
                                    padding: '10px 15px',
                                    position: 'relative',
                                }}
                            >
                                {location.pathname === item.path &&
                                    <Box component={motion.span}
                                        initial={{ left: '-100px', }}
                                        animate={{ left: '0px' }}
                                        transition={{ type: 'linear', duration: 0.5 }}
                                        sx={{ bgcolor: "applicationTheme.primary", position: 'absolute', top: '0', width: "100%", height: "100%", zIndex: '0', borderRadius: "30px", }}
                                    />
                                }
                                <Box component={'div'} sx={{ position: 'relative' }}>
                                    <Typography variant="p" component={"p"} sx={{ color: location.pathname === item.path ? 'applicationTheme.secondaryColor_1' : "applicationTheme.primaryColor_1", }} fontSize={"16px"}  >
                                        {item.text}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AnimatedSearchButton
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        />
                        <Button
                            onClick={handleClick}
                            endIcon={<ArrowDropDownIcon />}
                            sx={{
                                bgcolor: 'applicationTheme.primary',
                                color: 'applicationTheme.secondary',
                                '&:hover': {
                                    bgcolor: 'applicationTheme.primary',
                                },
                            }}
                        >
                            User
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleProfile}>
                                <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} /> Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
                <ThemeToggle />
            </Box>

            <Box display={{ xs: 'flex', md: 'none' }} component="div" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: "20px", width: "100%" ,height:'4vh'}}>
              <img
                    src={logoSrc}
                    style={logoStyle}
                    alt="logo of sitemark"
                    onClick={() => navigate('/')}
                /> 
                <Box component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "20px", height: "auto" }}>
                    <AnimatedSearchButton
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    />
                    <ThemeToggle />
                    <Button
                        onClick={handleClick}
                        endIcon={<ArrowDropDownIcon />}
                        sx={{
                            bgcolor: 'applicationTheme.primary',
                            color: 'applicationTheme.secondary',
                            '&:hover': {
                                bgcolor: 'applicationTheme.primary',
                            },
                        }}
                    >
                        User
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleProfile}>
                            <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1 }} /> Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
            <SearchModal open={searchModalOpen} handleClose={handleSearchModalClose} />
        </>
    );
}

export default Navbar;
