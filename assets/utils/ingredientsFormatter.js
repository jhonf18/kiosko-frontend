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

export const getPrettyIngredients = (ingredients) => {
  const formatter = new Intl.ListFormat('es', {
    style: 'long',
    type: 'conjunction',
  })

  const ingredientsFormated = ingredientsFormatter(ingredients)

  const ingredientsNames = ingredientsFormated.map((ingredient) => {
    let ingredientName = ''
    if (ingredient.quantity) {
      ingredientName += `${ingredient.quantity} `
    }
    ingredientName += ingredient.name

    return ingredientName
  })

  return `${formatter.format(ingredientsNames)}.`
}
