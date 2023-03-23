export const formatErrorMessages = (messages) => {
  if (Array.isArray(messages)) {
    const message = messages[0]
    const type = message.type.split('_')[1]
    return `${capitalizeFirstLetter(type)}: ${message.message}`
  } else return messages
}

const capitalizeFirstLetter = (string) => {
  string = string.toLowerCase()
  return string.charAt(0).toUpperCase() + string.slice(1)
}
