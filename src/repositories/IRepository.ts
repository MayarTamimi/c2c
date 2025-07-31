export interface IRepository<T extends { id: string }> {
  getAll(): Promise<T[]>;
  getDataByID(id: string): Promise<T | undefined>;
  create(item: T): Promise<T>;
  delete(item: T): Promise<T>;
  update(item: T): Promise<T>;
  find(filter: Partial<T>): Promise<T[]>;
  clear() : Promise<void>;
  count() : Promise<number>;
}
