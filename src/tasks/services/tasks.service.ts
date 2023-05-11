import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';
import { CreateTaskDto } from '../dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { GetTasksFilterDto } from 'tasks/dto/get-task-filter.dto';
import { User } from 'auth/entities/user.entity';
import { EmailService } from './email.service';
import { EmailServiceAdapter } from 'tasks/emailServiceAdapter';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        private readonly emailServiceAdapter: EmailServiceAdapter,
    ) { }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.tasksRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user,
        });

        await this.tasksRepository.save(task);

        const emailSubject = 'New Task Created';
        const emailBody = `A new task with title "${task.title}" has been created.`;
        const recipientEmail = user.mail;
        await this.emailServiceAdapter.sendEmail(recipientEmail, emailSubject, emailBody);
        return task;
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.tasksRepository.findOne({ where: { id, user } });
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }

    async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;

        const queryBuilder = this.tasksRepository.createQueryBuilder('task');
        queryBuilder.where({ user });

        if (status) {
            queryBuilder.andWhere('task.status = :status', { status });
        }

        if (search) {
            queryBuilder.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }
        const tasks = await queryBuilder.getMany();

        return tasks;
    }

    async deleteTaskById(id: string): Promise<void> {
        const found = await this.tasksRepository.delete(id);
        if (!found) {
            throw new NotFoundException(`Task with this '${id}' don't exist.`)
        }
        else {
            console.log('Task was successfully deleted!');
        }
    }

    async updateTaskStatus(
        id: string,
        user: User,
        status: TaskStatus,
    ): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = status;
        await this.tasksRepository.save(task);

        return task;
    }
}
