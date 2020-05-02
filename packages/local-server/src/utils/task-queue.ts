import { Collection } from '@tuture/core';
import { saveCollection, loadCollection } from './collection';

export type Task = (c: Collection) => Collection;
export type TaskWithCallback = {
  task: (c: Collection) => Collection;
  callback: Function;
};

export default class TaskQueue {
  collection: Collection;
  tasks: (Task | TaskWithCallback)[];
  flushTimeout: NodeJS.Timeout | null;

  constructor() {
    this.collection = loadCollection();
    this.tasks = [];
    this.flushTimeout = null;
  }

  private resetFlushTimeout(ms: number = 1000) {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
    }

    this.flushTimeout = setTimeout(() => this.flush(), ms);
  }

  readCollection() {
    return this.collection;
  }

  isEmpty() {
    return this.tasks.length === 0;
  }

  addTask(task: Task | TaskWithCallback, delay?: number) {
    this.tasks.push(task);
    this.resetFlushTimeout(delay);
  }

  flush() {
    while (!this.isEmpty()) {
      const task = this.tasks.shift();
      if (task && typeof task === 'function') {
        this.collection = task(this.collection);
      } else if (task && typeof task === 'object') {
        this.collection = task.task(this.collection);
      }

      saveCollection(this.collection);

      if (task && typeof task === 'object') {
        task.callback(this.collection);
      }
    }
  }
}
