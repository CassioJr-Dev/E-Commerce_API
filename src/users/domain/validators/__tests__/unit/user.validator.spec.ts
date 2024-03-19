import { UserProps } from "@/users/domain/entities/user.entity";
import { UserRules, UserValidator, UserValidatorFactory } from "../../user-validator";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";

let sut: UserValidator
let props: UserProps

describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create()
    props = UserDataBuilder({})
  })

  it('Invalidation cases for name field', () => {
    let isValid = sut.validate(null)
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual([
      'name should not be empty',
      'name must be a string',
      'name must be shorter than or equal to 255 characters'
    ])

    isValid = sut.validate({ ...props, name: '' })
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual(['name should not be empty'])

    isValid = sut.validate({ ...props, name: 10 as any})
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual([
      'name must be a string',
      'name must be shorter than or equal to 255 characters'
    ])
  })

  it('Invalidation cases for isSeller field', () => {
    let isValid = sut.validate(null)
    expect(isValid).toBeFalsy()
    expect(sut.errors['isSeller']).toStrictEqual([
      'isSeller should not be empty',
      'isSeller must be a boolean value'
    ])

    isValid = sut.validate({ ...props, isSeller: '' as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['isSeller']).toStrictEqual([
      'isSeller should not be empty',
      'isSeller must be a boolean value'
    ])

    isValid = sut.validate({ ...props, isSeller: 10 as any})
    expect(isValid).toBeFalsy()
    expect(sut.errors['isSeller']).toStrictEqual([
      'isSeller must be a boolean value'
    ])
  })

  it('Invalidation cases for email field', () => {
    let isValid = sut.validate(null)
    expect(isValid).toBeFalsy()
    expect(sut.errors['email']).toStrictEqual([
      'email should not be empty',
      'email must be an email',
      'email must be a string',
      'email must be shorter than or equal to 255 characters'
    ])

    isValid = sut.validate({ ...props, email: '' })
    expect(isValid).toBeFalsy()
    expect(sut.errors['email']).toStrictEqual([
      'email should not be empty',
      'email must be an email'
    ])

    isValid = sut.validate({ ...props, email: 10 as any})
    expect(isValid).toBeFalsy()
    expect(sut.errors['email']).toStrictEqual([
      'email must be an email',
      'email must be a string',
      'email must be shorter than or equal to 255 characters'
    ])
  })

  it('Invalidation cases for password field', () => {
    let isValid = sut.validate(null)
    expect(isValid).toBeFalsy()
    expect(sut.errors['password']).toStrictEqual([
      'password should not be empty',
      'password must be a string',
      'password must be shorter than or equal to 15 characters'
    ])

    isValid = sut.validate({ ...props, password: '' })
    expect(isValid).toBeFalsy()
    expect(sut.errors['password']).toStrictEqual(['password should not be empty'])

    isValid = sut.validate({ ...props, password: 10 as any})
    expect(isValid).toBeFalsy()
    expect(sut.errors['password']).toStrictEqual([
      'password must be a string',
      'password must be shorter than or equal to 15 characters'
    ])
  })

  it('Valid case for user rules', () => {
    const isValid = sut.validate(props)
    expect(isValid).toBeTruthy()
    expect(sut.validatedData).toStrictEqual(new UserRules(props))
  })
})
