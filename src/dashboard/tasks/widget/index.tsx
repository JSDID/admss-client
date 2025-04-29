import { useEffect, useRef, useState } from "react";
import { getCurrentUserTasks, setTaskStatus } from "http/services/tasks.service";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { Task, TaskStatus } from "common/models/tasks";
import { AddTaskDialog } from "dashboard/tasks/add-task-dialog";
import { TaskSummaryDialog } from "dashboard/tasks/task-summary";
import "./index.css";
import { renderTaskStatus } from "dashboard/tasks/common";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { useNavigate } from "react-router-dom";

const DEFAULT_TASK_COUNT = 4;

export const TasksWidget = observer(() => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigate = useNavigate();
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [showAddTaskDialog, setShowAddTaskDialog] = useState<boolean>(false);
    const [showEditTaskDialog, setShowEditTaskDialog] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [checkboxDisabled, setCheckboxDisabled] = useState<boolean>(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [checkboxStates, setCheckboxStates] = useState<{ [key: string]: boolean }>({});
    const [allTasksCount, setAllTasksCount] = useState<number>(0);

    const toast = useRef<Toast>(null);

    const getTasks = async (taskCount = DEFAULT_TASK_COUNT) => {
        try {
            const [totalCountResponse, tasksResponse] = await Promise.all([
                getCurrentUserTasks(authUser!.useruid, { total: 1 }),
                getCurrentUserTasks(authUser!.useruid, { top: taskCount }),
            ]);

            if (totalCountResponse && !Array.isArray(totalCountResponse)) {
                setAllTasksCount(totalCountResponse.total);
            }

            if (tasksResponse && Array.isArray(tasksResponse)) {
                setTasks(tasksResponse);
            }
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: error as string,
                life: 3000,
            });
        }
    };

    useEffect(() => {
        if (authUser) {
            getTasks();
        }
    }, []);

    const handleEditTask = (task: Task) => {
        setCurrentTask(task);
        setTimeout(() => setShowEditTaskDialog(true), 0);
    };

    const handleTaskStatusChange = async (taskuid: string) => {
        setCheckboxStates((prevStates) => ({
            ...prevStates,
            [taskuid]: true,
        }));
        setCheckboxDisabled(true);

        const response = await setTaskStatus(taskuid, TaskStatus.COMPLETED);
        if (response?.error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: response.error,
                life: 3000,
            });
        } else {
            toast.current?.show({
                severity: "info",
                summary: "Confirmed",
                detail: "The task marked as completed",
                life: 3000,
            });
            getTasks();
        }

        setCheckboxStates((prevStates) => ({
            ...prevStates,
            [taskuid]: false,
        }));
        setCheckboxDisabled(false);
    };

    const isLoggedUserTask = (): boolean =>
        !!currentTask &&
        (currentTask.parentuid === authUser!.useruid || currentTask.useruid === authUser!.useruid);

    const handleStatusChange = (task: Task) => {
        setCurrentTask(task);
        setShowConfirmModal(true);
    };

    return (
        <div className='tasks-widget'>
            <div className='tasks-widget-header flex justify-content-between align-items-center'>
                <h2 className='card-content__title uppercase m-0'>
                    Tasks
                    <span className={`tasks-widget-count ${!tasks.length ? "empty-list" : ""}`}>
                        ({allTasksCount})
                    </span>
                </h2>
                <Button
                    icon='pi pi-plus'
                    className='add-task-control'
                    onClick={() => setShowAddTaskDialog(true)}
                />
            </div>
            <ul className='list-none ml-0 pl-0'>
                {tasks.length ? (
                    tasks.map((task) => {
                        return (
                            <li
                                key={`${task.itemuid}-${task.index}`}
                                className='mb-2 tasks-widget__item'
                            >
                                <Checkbox
                                    name='task'
                                    disabled={checkboxDisabled}
                                    checked={checkboxStates[task.itemuid] || false}
                                    onChange={() => handleStatusChange(task)}
                                />
                                <label
                                    className='ml-2 cursor-pointer tasks-widget__label'
                                    onClick={() => handleEditTask(task)}
                                >
                                    {task.taskname ||
                                        `${task.description} ${
                                            task.username ?? `- ${task.username}`
                                        }`}
                                </label>
                                {renderTaskStatus(task.statuscode)}
                            </li>
                        );
                    })
                ) : (
                    <li className='mb-2 empty-list'>No tasks yet.</li>
                )}
                {allTasksCount > DEFAULT_TASK_COUNT && (
                    <li className='p-0'>
                        <Button
                            className='tasks-widget__button messages-more'
                            onClick={() => navigate("/dashboard/tasks")}
                            text
                        >
                            View more...
                        </Button>
                    </li>
                )}
            </ul>
            <div className='hidden'>
                <AddTaskDialog
                    visible={showAddTaskDialog}
                    onHide={() => setShowAddTaskDialog(false)}
                    onAction={getTasks}
                    header='Add Task'
                />
                {isLoggedUserTask() ? (
                    <AddTaskDialog
                        visible={showEditTaskDialog}
                        onHide={() => setShowEditTaskDialog(false)}
                        currentTask={currentTask as Task}
                        onAction={getTasks}
                        header='Edit Task'
                    />
                ) : (
                    <TaskSummaryDialog
                        visible={showEditTaskDialog}
                        onHide={() => setShowEditTaskDialog(false)}
                        currentTask={currentTask as Task}
                        header='Task summary'
                    />
                )}
                <ConfirmModal
                    position='top'
                    visible={showConfirmModal}
                    onHide={() => setShowConfirmModal(false)}
                    bodyMessage='Are you sure you want to mark this task as completed?'
                    title='Mark as done?'
                    confirmAction={() => handleTaskStatusChange(currentTask!.itemuid)}
                    rejectLabel='Cancel'
                    acceptLabel='Confirm'
                    icon='pi pi-check-circle'
                    className='tasks-widget__confirm-modal'
                />
            </div>

            <Toast ref={toast} />
        </div>
    );
});
