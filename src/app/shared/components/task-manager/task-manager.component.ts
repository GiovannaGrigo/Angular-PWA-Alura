import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskItem } from './task-item';
import { v4 as uuidv4 } from 'uuid';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IndexedDBService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    CommonModule,
    TaskListComponent,
    ReactiveFormsModule
  ],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent {

  taskForm: FormGroup;
  hasShowForm = false;

  tasks: TaskItem[] = [];
  taskItemSelected: TaskItem | null = null;

  constructor(
    private fb: FormBuilder,
    private indexedDBService: IndexedDBService
  ) {
    this.taskForm = this.fb.group({
      description: ['', Validators.required]
    });
  }

  onAddTaskClick(): void {
    this.hasShowForm = true;
    this.taskForm.reset();
  }

  onTaskListClick(taskItem: TaskItem): void {
    this.tasks = this.tasks.map((task: TaskItem) => ({
      ...task,
      isActive: task.uuid === taskItem.uuid ? true : false
    }));

    this.taskItemSelected = taskItem;
  }

  onSaveTask(): void {
    const { description } = this.taskForm.value;

    const taskItem = {
      uuid: uuidv4(),
      description: description,
      isActive: false
    };

    this.tasks.push(taskItem);

    this.indexedDBService.addTask(taskItem).subscribe();

    this.hasShowForm = false;
  }

  onCleanTasksClick(): void {
    this.tasks = [];
    this.taskItemSelected = null;
  }

  onCancelBtnClick(): void {
    this.hasShowForm = false;
  }
}
