import React, { useState } from 'react';
import { Button, Box, Toolbar, CssBaseline } from '@mui/material';
import { NavBar } from '../components/NavBar';
import { TopBar } from '../components/TopBar';
import CreateTaskModal from '../components/createTaskModal';
import TaskList from '../components/taskList';
import { TaskProvider } from '../components/TaskContext';

export default function Tasks() {
    const drawerWidth = 240;
    const [openModal, setOpenModal] = useState(false);
    return (
        <TaskProvider>
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
                    <br />
                    <Button
                        variant="contained"
                        onClick={() => setOpenModal(true)}
                    >
                        Create Task
                    </Button>
                    <CreateTaskModal
                        open={openModal}
                        handleClose={() => setOpenModal(false)}
                    />
                    <Box sx={{ maxWidth: '92%', marginTop: '40px' }}>
                        <TaskList />
                    </Box>
                </Box>
            </Box>
        </TaskProvider>
    );
}
