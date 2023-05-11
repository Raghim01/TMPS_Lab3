import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { AuthModule } from 'auth/auth.module';
import { EmailServiceAdapter } from './emailServiceAdapter';
import { EmailService } from './services/email.service';
import { TaskFacade } from './controllers/task.facade';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService, EmailServiceAdapter, EmailService, TaskFacade],
})
export class TasksModule { }
