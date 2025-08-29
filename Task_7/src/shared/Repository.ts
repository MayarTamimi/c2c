import crypto from "crypto";

export class repository<
  T extends { id: string; createdAt: Date; updatedAt: Date }
> {
  private items: T[] = [];

  findAll(): T[] {
    return this.items;
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(item: Omit<T, "id" | "createdAt" | "updatedAt">): T {
    const newItem: T = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;
    this.items.push(newItem);
    return newItem;
  }

  update(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
  ): T | undefined {
    const item = this.findById(id);
    if (!item) return undefined;
    Object.assign(item, data);
    item.updatedAt = new Date();
    return item;
  }

  delete(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}
