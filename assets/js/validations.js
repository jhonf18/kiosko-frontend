export const isNotEmpty = (data, fields) => {
  let errors = { error: false, errors: [] }

  //validar que los campos no esten vacíos
  fields.forEach((field) => {
    if (
      typeof data[field] == 'undefined' ||
      (typeof data[field] === 'string' && data[field] === '') ||
      data[field].length === 0
    ) {
      errors.error = true
      errors.errors.push({
        message: `El campo ${field.toLowerCase()} no puede estar vacío`,
        type: `INPUT_${field.toUpperCase()}`,
      })
    }
  })

  return errors
}
