import * as React from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { TopBar } from '../components/TopBar';
import WeatherCard from '../components/weatherCard';
import NewsFeed from '../components/newsFeed';
import { NavBar } from '../components/NavBar';

const drawerWidth = 240;

export default function Dashboard() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <TopBar title="Home" />
            <NavBar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Box sx={{ maxWidth: '92%', margin: 'auto' }}>
                    <WeatherCard />
                </Box>
                <br />
                <Divider>
                    <Typography variant="h3" gutterBottom textAlign="center">
                        News
                    </Typography>
                </Divider>
                <NewsFeed />
            </Box>
        </Box>
    );
}
