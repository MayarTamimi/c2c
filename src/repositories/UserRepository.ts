import { User } from '../models/User';
import { BaseRepository } from './BaseRepository';

export class UserRepo extends BaseRepository<User> {
  constructor() {
    super([
      { id: '1', name: 'Mohamed', age: 25, email: 'mo@example.com' },
      { id: '2', name: 'Sara', age: 22, email: 'sara@example.com' }
    ]);
  }
}
