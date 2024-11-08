import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Book as BookIcon,
    UserPlus as PersonAddIcon,
    Users as PeopleIcon,
    LogOut as LogOutIcon,
    Receipt as ReceiptIcon,
    Bookmark as BookmarkIcon
} from 'lucide-react';

const drawerWidth = 240;

function DashboardLayout({ children, title }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Define menu items based on user role
    const getMenuItems = () => {
        const items = [];

        if (userRole === 'ADMIN') {
            items.push(
                { text: 'Dashboard', icon: <HomeIcon className="w-6 h-6" />, path: '/admin' },
                { text: 'Register Staff', icon: <PersonAddIcon className="w-6 h-6" />, path: '/admin/staff-register' },
                { text: 'Manage Users', icon: <PeopleIcon className="w-6 h-6" />, path: '/admin/users' },
                { text: 'Manage Books', icon: <BookIcon className="w-6 h-6" />, path: '/admin/books' },
                { text: 'View Loans', icon: <ReceiptIcon className="w-6 h-6" />, path: '/admin/loans' },
                { text: 'Manage Reservations', icon: <BookmarkIcon className="w-6 h-6" />, path: '/admin/reservations' }
            );
        } else if (userRole === 'LIBRARIAN') {
            items.push(
                { text: 'Dashboard', icon: <HomeIcon className="w-6 h-6" />, path: '/librarian' },
                { text: 'Register Member', icon: <PersonAddIcon className="w-6 h-6" />, path: '/librarian/member-register' },
                { text: 'Manage Books', icon: <BookIcon className="w-6 h-6" />, path: '/librarian/books' },
                { text: 'Manage Loans', icon: <ReceiptIcon className="w-6 h-6" />, path: '/librarian/loans' },
                { text: 'Manage Reservations', icon: <BookmarkIcon className="w-6 h-6" />, path: '/librarian/reservations' }
            );
        } else {
            items.push(
                { text: 'Dashboard', icon: <HomeIcon className="w-6 h-6" />, path: '/member' },
                { text: 'Browse Books', icon: <BookIcon className="w-6 h-6" />, path: '/member/books' },
                { text: 'My Loans', icon: <ReceiptIcon className="w-6 h-6" />, path: '/member/loans' },
                { text: 'My Reservations', icon: <BookmarkIcon className="w-6 h-6" />, path: '/member/reservations' }
            );
        }

        return items;
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Library System
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {getMenuItems().map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => navigate(item.path)}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogOutIcon className="w-6 h-6" />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon className="w-6 h-6" />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {userRole}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better mobile performance
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh'
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}

export default DashboardLayout;