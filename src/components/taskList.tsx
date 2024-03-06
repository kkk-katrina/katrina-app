import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { format, parseISO } from 'date-fns';
import { listTasks } from '../graphql/queries';
import { deleteTask } from '../graphql/mutations';
import { Box, Card, Typography, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTasks } from './TaskContext';

interface Task {
    id: string;
    title: string;
    description?: string | null;
    status?: string | null;
    createdAt: string;
    updatedAt: string;
}

const TaskList: React.FC = () => {
    const client = generateClient();
    const { replaceTasks } = useTasks();
    const [loading, setLoading] = useState<boolean>(true);
    const [fetchedTasks, setFetchedTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const taskData = await client.graphql({ query: listTasks });
                const fetchedTasks: Task[] = taskData.data.listTasks.items;
                setFetchedTasks(fetchedTasks);
                replaceTasks(fetchedTasks);
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
            setLoading(false);
        };

        fetchTasks();
    }, [replaceTasks]);

    const handleDeleteTask = async (taskId: string) => {
        try {
            await client.graphql({
                query: deleteTask,
                variables: { input: { id: taskId } },
            });
            const updatedTasks = fetchedTasks.filter(
                (task) => task.id !== taskId,
            );
            setFetchedTasks(updatedTasks);
            replaceTasks(updatedTasks);
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fetchedTasks.map(
                ({ id, title, description, status, createdAt, updatedAt }) => (
                    <Card key={id} variant="outlined" sx={{ maxWidth: '90%' }}>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Grid item xs={11}>
                                <Box paddingX={2} paddingY={1}>
                                    {/* 卡片内容 */}
                                    <Typography variant="h5" gutterBottom>
                                        {title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Description: {description}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Status: {status}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Created:{' '}
                                        {format(
                                            parseISO(createdAt),
                                            "MMMM d, yyyy 'at' h:mm aaa",
                                        )}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Updated:{' '}
                                        {format(
                                            parseISO(updatedAt),
                                            "MMMM d, yyyy 'at' h:mm aaa",
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => handleDeleteTask(id)}
                                    sx={{ '& svg': { fontSize: 36 } }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Card>
                ),
            )}
        </Box>
    );
};

export default TaskList;
