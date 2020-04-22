import { Collection } from '@tuture/core';
import { saveCollection, loadCollection } from './collection';

export type Task = (c: Collection) => Collection;

export default class TaskQueue {
  collection: Collection;
  tasks: Task[];
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

  addTask(task: Task, delay?: number) {
    this.tasks.push(task);
    this.resetFlushTimeout(delay);
  }

  flush() {
    while (!this.isEmpty()) {
      const task = this.tasks.shift();
      if (task) {
        this.collection = task(this.collection);
      }
    }

    saveCollection(this.collection);
  }
}
