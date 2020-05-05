import { Collection } from '@tuture/core';
import { saveCollection, loadCollection } from './collection';

export type Task = (c: Collection) => Collection;
export type TaskWithCallback = {
  task: (c: Collection) => Collection;
  callback: Function;
};

export default class TaskQueue {
  tasks: (Task | TaskWithCallback)[];
  flushTimeout: NodeJS.Timeout | null;

  constructor() {
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
    return loadCollection();
  }

  isEmpty() {
    return this.tasks.length === 0;
  }

  addTask(task: Task | TaskWithCallback, delay?: number) {
    this.tasks.push(task);
    this.resetFlushTimeout(delay);
  }

  flush() {
    let collection = loadCollection();

    while (!this.isEmpty()) {
      const task = this.tasks.shift();

      if (!task) break;

      if (typeof task === 'function') {
        collection = task(collection);
      } else if (typeof task === 'object') {
        collection = task.task(collection);
      }

      saveCollection(collection);

      if (typeof task === 'object') {
        task.callback(collection);
      }
    }
  }
}
