import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Task {
    id: string;
    title: string;
    description?: string | null;
    status?: string | null;
    createdAt: string;
    updatedAt: string;
}

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Task) => void;
    replaceTasks: (newTasks: Task[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const addTask = (task: Task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
    };

    const replaceTasks = (newTasks: Task[]) => {
        setTasks(newTasks);
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, replaceTasks }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
