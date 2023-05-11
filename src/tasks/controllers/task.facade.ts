import { Injectable } from "@nestjs/common";
import { User } from "auth/entities/user.entity";
import { UpdateTaskStatusDto } from "tasks/dto/update-task-status-dto";
import { Task } from "tasks/entities/task.entity";
import { EmailService } from "tasks/services/email.service";
import { TasksService } from "tasks/services/tasks.service";
import { TaskStatus } from "tasks/task-status.enum";

@Injectable()
export class TaskFacade {
    constructor(
        private readonly taskService: TasksService,
        private readonly emailService: EmailService,
    ) { }

    async updateTaskStatusWithNotification(
        id: string,
        user: User,
        status: TaskStatus
    ): Promise<Task> {

        const updateTask = await this.taskService.updateTaskStatus(id, user, status);

        const emailSubject = 'Task Status Updated';
        const emailStatus = `New Status of your task is ${updateTask.status}`;

        await this.emailService.sendEmail(user.mail, emailSubject, emailStatus);
        return updateTask;
    }
}