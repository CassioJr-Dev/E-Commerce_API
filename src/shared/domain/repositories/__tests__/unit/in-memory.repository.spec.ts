import { Entity } from '@/shared/domain/entities/entity';
import { InMemoryRepository } from '../../in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it('Should inserts a new entity', async () => {
    const entity = new StubEntity({ name: 'test name', price: 50 });
    await sut.insert(entity);
    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });

  it('Should throw error when entity not found', async () => {
    await expect(sut.findById('fakeid')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should find an entity by id', async () => {
    const entity = new StubEntity({ name: 'test name', price: 50 });
    await sut.insert(entity);
    const result = await sut.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(result.toJSON());
  });

  it('Should find all entities', async () => {
    const entity = new StubEntity({ name: 'test name', price: 50 });
    await sut.insert(entity);
    const result = await sut.findAll();
    expect(result).toStrictEqual([entity]);
  });

  it('Should throw error on update when entity not found', async () => {
    const entity = new StubEntity({ name: 'test name', price: 50 });
    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should update an entity', async () => {
    const entity = new StubEntity({ name: 'test name', price: 50 });
    await sut.insert(entity);
    const entityUpdated = new StubEntity(
      { name: 'updated', price: 70 },
      entity.id,
    );
    await sut.update(entityUpdated);

    expect(entity.toJSON()).not.toStrictEqual(sut.items[0].toJSON());
    expect(entityUpdated.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });
});
