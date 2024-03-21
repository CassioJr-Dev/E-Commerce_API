import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity, UserProps } from "../../user.entity"
import { EntityValidationError } from "@/shared/domain/errors/validation-error"

describe('UserEntity integration tests', () => {

  describe('Constructor method', () => {
    it('Should throw an error when creatting a user with invalid name', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        name: null
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: '',
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: 10 as any,
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: 'a'.repeat(256),
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('Should throw an error when creatting a user with invalid isSeller', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        isSeller: null
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        isSeller: '' as any,
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: 10 as any,
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('Should throw an error when creatting a user with invalid email', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        email: null
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        email: '',
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        email: 10 as any,
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        email: 'a'.repeat(256),
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('Should throw an error when creatting a user with invalid password', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        password: null
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        password: '',
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        password: 10 as any,
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        password: 'a'.repeat(16),
      }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('Should valid a user', () => {
      expect.assertions(1)
      let props: UserProps = {
        ...UserDataBuilder({})
      }
      expect(() => new UserEntity(props)).not.toThrowError(EntityValidationError)
    })
  })

  describe('UpdateName method', () => {
    let props: UserProps
    let sut: UserEntity
    let argument: any
    beforeEach(() => {
      props = UserDataBuilder({})
      sut = new UserEntity(props)
    })
    it('Should throw an error when update a user with invalid name', () => {
      argument = null
      expect(() => sut.updateName(argument)).toThrowError(EntityValidationError)

      argument = ''
      expect(() => sut.updateName(argument)).toThrowError(EntityValidationError)

      argument = 10
      expect(() => sut.updateName(argument)).toThrowError(EntityValidationError)

      argument = 'a'.repeat(256)
      expect(() => sut.updateName(argument)).toThrowError(EntityValidationError)

    })

    it('Should valid user updateName', () => {
      expect.assertions(1)
      argument = UserDataBuilder({}).name
      expect(() => sut.updateName(argument)).not.toThrowError(EntityValidationError)
    })
  })

  describe('UpdateIsSeller method', () => {
    let props: UserProps
    let sut: UserEntity
    let argument: any
    beforeEach(() => {
      props = UserDataBuilder({})
      sut = new UserEntity(props)
    })
    it('Should throw an error when update a user with invalid name', () => {
      argument = null
      expect(() => sut.updateIsSeller(argument)).toThrowError(EntityValidationError)

      argument = ''
      expect(() => sut.updateIsSeller(argument)).toThrowError(EntityValidationError)

      argument = 10
      expect(() => sut.updateIsSeller(argument)).toThrowError(EntityValidationError)

    })

    it('Should valid user updateIsSeller', () => {
      expect.assertions(1)
      argument = UserDataBuilder({}).isSeller
      expect(() => sut.updateIsSeller(argument)).not.toThrowError(EntityValidationError)
    })
  })

  describe('UpdateEmail method', () => {
    let props: UserProps
    let sut: UserEntity
    let argument: any
    beforeEach(() => {
      props = UserDataBuilder({})
      sut = new UserEntity(props)
    })
    it('Should throw an error when update a user with invalid name', () => {
      argument = null
      expect(() => sut.updateEmail(argument)).toThrowError(EntityValidationError)

      argument = ''
      expect(() => sut.updateEmail(argument)).toThrowError(EntityValidationError)

      argument = 10
      expect(() => sut.updateEmail(argument)).toThrowError(EntityValidationError)

      argument = 'a'.repeat(256)
      expect(() => sut.updateEmail(argument)).toThrowError(EntityValidationError)

    })

    it('Should valid user updateEmail', () => {
      expect.assertions(1)
      argument = UserDataBuilder({}).email
      expect(() => sut.updateEmail(argument)).not.toThrowError(EntityValidationError)
    })
  })

  describe('UpdatePassword method', () => {
    let props: UserProps
    let sut: UserEntity
    let argument: any
    beforeEach(() => {
      props = UserDataBuilder({})
      sut = new UserEntity(props)
    })
    it('Should throw an error when update a user with invalid name', () => {
      argument = null
      expect(() => sut.updatePassword(argument)).toThrowError(EntityValidationError)

      argument = ''
      expect(() => sut.updatePassword(argument)).toThrowError(EntityValidationError)

      argument = 10
      expect(() => sut.updatePassword(argument)).toThrowError(EntityValidationError)

      argument = 'a'.repeat((16))
      expect(() => sut.updatePassword(argument)).toThrowError(EntityValidationError)

    })

    it('Should valid user updatePassword', () => {
      expect.assertions(1)
      argument = UserDataBuilder({}).password
      expect(() => sut.updatePassword(argument)).not.toThrowError(EntityValidationError)
    })
  })
})
