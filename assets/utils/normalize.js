export const normalizeText = (str) => {
  const from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç'
  const to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc'
  const mapping = {}

  for (let i = 0, j = from.length; i < j; i++)
    mapping[from.charAt(i)] = to.charAt(i)

  const ret = []
  for (let i = 0, j = str.length; i < j; i++) {
    const c = str.charAt(i)
    // eslint-disable-next-line no-prototype-builtins
    if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c])
    else ret.push(c)
  }
  return ret.join('')
}
