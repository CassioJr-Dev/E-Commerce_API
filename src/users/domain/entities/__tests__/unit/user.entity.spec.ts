import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity, UserProps } from "../../user.entity"

describe('UserEntity unit tests', () => {
  let props: UserProps
  let sut: UserEntity
  beforeEach(() => {
    props = UserDataBuilder({})
    sut = new UserEntity(props)
  })

  it('Constructor method test', () => {
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.isSeller).toEqual(props.isSeller)
    expect(sut.props.email).toEqual(props.email)
    expect(sut.props.password).toEqual(props.password)
    console.log(props)
  })

  it('Getter of name field', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.name).toBe('string')
  })

  it('Getter of isSeller field', () => {
    expect(sut.isSeller).toBeDefined()
    expect(sut.isSeller).toEqual(props.isSeller)
    expect(typeof sut.isSeller).toBe('boolean')
  })

  it('Getter of email field', () => {
    expect(sut.email).toBeDefined()
    expect(sut.email).toEqual(props.email)
    expect(typeof sut.email).toBe('string')
  })

  it('Getter of password field', () => {
    expect(sut.password).toBeDefined()
    expect(sut.password).toEqual(props.password)
    expect(typeof sut.password).toBe('string')
  })

})
