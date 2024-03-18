export type FieldsErros = {
  [field: string]: string[]
}

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErros
  validatedData: PropsValidated
  validate(data: any): boolean
}
