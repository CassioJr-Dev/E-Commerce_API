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
    //console.log(entity.id)
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
    const id = 'f52cf67c-0782-4aff-8154-b9f908b28bf2'
    const entity = new StubEntity(props, id)

    expect(entity.toJSON()).toStrictEqual({
      id,
      ...props
    })

    console.log(entity.toJSON())
  })
})

