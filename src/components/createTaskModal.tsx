import React, { useState } from 'react';
import { Modal, Box, TextField, MenuItem, Button } from '@mui/material';
import { generateClient } from 'aws-amplify/api';
import { createTask } from '../graphql/mutations';
import { useTasks } from './TaskContext';

const client = generateClient();
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const statuses = ['todo', 'in progress', 'complete'];

const CreateTaskModal: React.FC<{ open: boolean; handleClose: () => void }> = ({
    open,
    handleClose,
}) => {
    const { addTask } = useTasks();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');

    const handleSubmit = async () => {
        try {
            const taskDetails = { input: { title, description, status } };
            const response = await client.graphql({
                query: createTask,
                variables: taskDetails,
            });
            const newTask = {
                id: response.data.createTask.id,
                title,
                description,
                status,
                createdAt: response.data.createTask.createdAt,
                updatedAt: response.data.createTask.updatedAt,
            };
            addTask(newTask);
            handleClose();
            setTitle('');
            setDescription('');
            setStatus('todo');
        } catch (err) {
            console.error('error creating task', err);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-task-modal"
            aria-describedby="create-task-modal-form"
        >
            <Box sx={style} component="form" noValidate autoComplete="off">
                <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                />
                <TextField
                    select
                    fullWidth
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    margin="normal"
                >
                    {statuses.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    Submit
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateTaskModal;
