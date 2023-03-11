// valid that the field is not empty
export const isEmpty = (value, blur) => {
  if (value.length === 0 && blur) return 'empty'
}

export const isInvalidName = (name, blur) => {
  const expRegexName = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s ]*$/
  if (!expRegexName.test(name) && blur) return 'invalid'
}

export const isInvalidEmail = (email, blur) => {
  const expRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!expRegex.test(email) && email.length !== 0 && blur) return 'invalid'
}

export const isInvalidPassword = (password) => {
  // eslint-disable-next-line prefer-regex-literals
  const expRegexPassword = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
  )
  if (!expRegexPassword.test(password) && password.length !== 0)
    return 'invalid'
}

export const isNotEqualPasswords = (value, password) => {
  if (value !== password && value !== '') return 'not-equal'
}
