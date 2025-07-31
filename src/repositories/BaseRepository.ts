import { IRepository } from './IRepository';

export class BaseRepository<T extends { id: string }> implements IRepository<T> { // to get any  interface that has id as a property
  protected items: T[]; // store the data in an array

  constructor(initialItems: T[]) {
    this.items = initialItems;
  }

  async getAll(): Promise<T[]> {
    return this.items;
  }

  async getDataByID(id: string): Promise<T | undefined> {
    return this.items.find(item => item.id === id);
  }

  async create(item: T): Promise<T> {
    this.items.push(item);
    return item;
  }

  async delete(item: T): Promise<T> {
    // we should check if the item exists before deleting it
    const index = this.items.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.items.splice(index, 1);
      return item;
    } else {
      throw new Error('Item not found');
    }
  }

  async update(item: T): Promise<T> {
    // as we did in the delete method we shoudl also check if the item exists
    const index = this.items.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.items[index] = item;
      return item;
    } else {
      throw new Error('Item not found');
    }
  }

  async find(filter: Partial<T>): Promise<T[]> {
    return this.items.filter(item =>
      Object.entries(filter).every( //  convert the filter object to an array of key-value pairs
        ([key, value]) => item[key as keyof T] === value
      )
    );
  }

  async clear(): Promise<void> {
    this.items = [];
  }

  async count(): Promise<number> {
    return this.items.length;
  }

}
