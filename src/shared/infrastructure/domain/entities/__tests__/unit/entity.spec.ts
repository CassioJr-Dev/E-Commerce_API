import { validate as uuidValidate } from 'uuid';
import { Entity } from '../../entity';

type StubProps = {
  prop1: string
  prop2: number
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {

  it('Should set props and id', () => {
    const props = { prop1: 'value1', prop2: 15 }
    const entity = new StubEntity(props)

    expect(entity.props).toStrictEqual(props)
    expect(entity.id).not.toBeNull()
    console.log(entity.id)
    expect(uuidValidate(entity.id)).toBeTruthy()
  })

  it('Should accept a valid uuid', () => {
    const props = { prop1: 'value1', prop2: 15 }
    const id = 'f52cf67c-0782-4aff-8154-b9f908b28bf2'
    const entity = new StubEntity(props, id)

    expect(uuidValidate(entity.id)).toBeTruthy()
    expect(entity.id).toBe(id)

  })

  it('Should convert a entity to a JavaScript Object', () => {
    const props = { prop1: 'value1', prop2: 15 }
    const date = new Date()
    date.setUTCHours(date.getUTCHours() - 3);
    const id = 'f52cf67c-0782-4aff-8154-b9f908b28bf2'
    const entity = new StubEntity(props, id, date, date)

    expect(entity.toJSON()).toStrictEqual({
      id,
      ...props,
      created_at: date,
      update_at: date
    })

    console.log(entity.toJSON())
  })

  it('Should set created_at and update_at', () => {
    const props = { prop1: 'value1', prop2: 15 }
    const entity = new StubEntity(props)

    expect(entity._created_at).not.toBeNull()
    expect(entity._update_at).not.toBeNull()
  })

})

