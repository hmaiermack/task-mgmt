import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const tasks = this.tasksRepository.getTasks(filterDto, user);

    return tasks;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const query = await this.tasksRepository.createQueryBuilder('task');
    query.where({ user });
    query.andWhere({ id });
    const found = await query.getOne();
    console.log(found);

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const res = await this.tasksRepository.delete({ id, user });
    if (res.affected === 0) {
      throw new NotFoundException('Task not found.');
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    console.log(task);
    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}
