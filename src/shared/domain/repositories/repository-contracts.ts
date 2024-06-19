import { Entity } from '../entities/entity';

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void>;
  findById(id: string): Promise<E>;
  findAll(id?: string): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string, user_id?: string): Promise<void>;
}
