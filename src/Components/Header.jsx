// import React, { useState } from 'react';
// import {
//     CssBaseline,
//     AppBar,
//     Toolbar,
//     Typography,
//     IconButton,
//     Drawer,
//     List,
//     ListItem,
//     ListItemIcon,
//     ListItemText,
//     InputBase,
//     Divider,
//     Container,
//     Grid,
//     Paper,
// } from '@mui/material';
// import {
//     Menu,
//     Home,
//     PersonAdd,
//     Dashboard,
//     Search,
//     AccountCircle,
//     ArrowBack,
// } from '@mui/icons-material';
// import { styled, alpha } from '@mui/system';

// const StyledAppBar = styled(AppBar)(({ theme }) => ({
//     zIndex: theme.zIndex.drawer + 1,
// }));

// const DrawerContainer = styled('div')(({ theme }) => ({
//     width: 250,
//     flexShrink: 0,
//     [theme.breakpoints.down('md')]: {
//         display: 'none',
//     },
// }));

// const SidebarPaper = styled(Paper)(({ theme }) => ({
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.white,
//     height: '100%',
//     padding: theme.spacing(2),
// }));

// const Content = styled('div')(({ theme }) => ({
//     flexGrow: 1,
//     padding: theme.spacing(3),
// }));

// const Header = () => {
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     const toggleSidebar = () => {
//         setSidebarOpen(!sidebarOpen);
//     };

//     return (
//         <div>
//             <CssBaseline />
//             <StyledAppBar position="fixed">
//                 <Toolbar>
//                     <IconButton
//                         edge="start"
//                         color="inherit"
//                         aria-label="open drawer"
//                         onClick={toggleSidebar}
//                         sx={{
//                             marginRight: '36px',
//                             ...(sidebarOpen && { display: 'none' }),
//                         }}
//                     >
//                         {sidebarOpen ? <ArrowBack /> : <Menu />}
//                     </IconButton>
//                     <Typography variant="h6" noWrap>
//                         My App
//                     </Typography>
//                     <div style={{ flexGrow: 1 }} />
//                     <div>
//                         <InputBase
//                             placeholder="Search..."
//                             startAdornment={<Search />}
//                             sx={{ marginRight: 2, display: { xs: 'none', md: 'flex' } }}
//                         />
//                         <IconButton color="inherit">
//                             <AccountCircle />
//                         </IconButton>
//                     </div>
//                 </Toolbar>
//             </StyledAppBar>
//             <DrawerContainer>
//                 <Toolbar />
//                 <Divider />
//                 <SidebarPaper elevation={4}>
//                     <List>
//                         <ListItem button>
//                             <ListItemIcon>
//                                 <Home />
//                             </ListItemIcon>
//                             <ListItemText primary="Home" />
//                         </ListItem>
//                         <ListItem button>
//                             <ListItemIcon>
//                                 <PersonAdd />
//                             </ListItemIcon>
//                             <ListItemText primary="Add Customer" />
//                         </ListItem>
//                         <ListItem button>
//                             <ListItemIcon>
//                                 <Dashboard />
//                             </ListItemIcon>
//                             <ListItemText primary="Dashboard" />
//                         </ListItem>
//                     </List>
//                 </SidebarPaper>
//             </DrawerContainer>
//             <Drawer
//                 variant="temporary"
//                 anchor="left"
//                 open={sidebarOpen}
//                 onClose={toggleSidebar}
//                 ModalProps={{
//                     keepMounted: true,
//                 }}
//             >
//                 <List>
//                     <ListItem button>
//                         <ListItemIcon>
//                             <Home />
//                         </ListItemIcon>
//                         <ListItemText primary="Home" />
//                     </ListItem>
//                     <ListItem button>
//                         <ListItemIcon>
//                             <PersonAdd />
//                         </ListItemIcon>
//                         <ListItemText primary="Add Customer" />
//                     </ListItem>
//                     <ListItem button>
//                         <ListItemIcon>
//                             <Dashboard />
//                         </ListItemIcon>
//                         <ListItemText primary="Dashboard" />
//                     </ListItem>
//                 </List>
//             </Drawer>
//             <Content>
//                 {/* Content of the main page */}
//                 {/* ... */}
//             </Content>
//         </div>
//     );
// };

// export default Header;
