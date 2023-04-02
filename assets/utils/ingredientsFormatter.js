export const ingredientsFormatter = (ingredients) => {
  const compareFn = (a) => {
    if (a.quantity) return -1

    return 0
  }

  const array1 = ingredients.filter((i) => i.type === 'PROTEÍNA')
  const array2 = ingredients.filter((i) => i.type === 'COSEPAN')
  const array3 = ingredients.filter((i) => i.type === 'OTROS')

  array1.sort(compareFn)
  array2.sort(compareFn)
  array3.sort(compareFn)

  return array1.concat(array2, array3)
}
