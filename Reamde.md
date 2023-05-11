    import { Injectable } from '@nestjs/common';
    import { EmailService } from './services/email.service';

    @Injectable()
    export class EmailServiceAdapter {
    constructor(private readonly emailService: EmailService) { }

    async sendEmail(recipient: string, subject: string, body: string): Promise<void> {
        // Perform necessary transformations or mappings if needed
        await this.emailService.sendEmail(recipient, subject, body);
    }
   }
   
Clasa EmailServiceAdapter îndeplineşte funcţia de adaptor între metoda createTask și EmailService.
Metoda sendEmail din clasa adaptorului preia parametrii de e-mail necesari (destinatar, subiect, corp) și apelează metoda corespunzătoare (sendEmail) pe baza:

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
  
În cadrul metodei createTask, o instanță a EmailServiceAdapter este utilizată pentru a trimite o notificare prin e-mail.Metoda sendEmail este apelată pe instanța EmailServiceAdapter, trecând e-mailul, subiectul și corpul destinatarului.
Prin utilizarea EmailServiceAdapter, metoda createTask este capabilă să trimită e-mailuri folosind interfața EmailService, fără a se baza direct pe implementarea sa specifică. Adaptorul permite integrarea serviciului de e-mail existent în fluxul de lucru al metodei createTask.

  
În acest exemplu, clasa TasksFacade servește ca o interfață de nivel înalt care încapsulează interacțiunea dintre TasksService și EmailService. Metoda createTaskAndSendEmail combină logica creării unei sarcini și a trimiterii unui e-mail de notificare într-o singură metodă simplificată.

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

În acest controller deja utilizăm serviciul iniţializat mai sus. Având ca parametri id-ul utilizatorului şi deja ca body, noul statut al taskului nostru.
  
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatus: UpdateTaskStatusDto,
        @GetUser() user: User,
    ): Promise<Task> {
        const { status } = updateTaskStatus;
        // return this.tasksService.updateTaskStatus(id, user, status);
        return this.taskFcade.updateTaskStatusWithNotification(id, user, status);
    }
  
Al 3-lea pattern folosit este Decorator Pattern.
  
   import { createParamDecorator, ExecutionContext } from "@nestjs/common";
   import { User } from "./entities/user.entity";


   export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext): User => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    });

Scopul acestui decorator este de a extinde si de a utiliza functionalul clasei User in metodele noastre, pentru a gestiona restrictiile in dependenta de utilizator. 
