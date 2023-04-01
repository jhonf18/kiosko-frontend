import { Repository } from '~/api/repository'
export default (ctx, inject) => {
  const repositoryWithAxios = new Repository(ctx.$axios)
  inject(
    'branchOfficeRepository',
    repositoryWithAxios.getBranchOfficeRepository()
  )
  inject('userRepository', repositoryWithAxios.getUserRepository())
  inject('categoryRepository', repositoryWithAxios.getCategoryRepository())
  inject('ingredientRepository', repositoryWithAxios.getIngredientRepository())
  inject('ingredientRepository', repositoryWithAxios.getIngredientRepository())
  inject('productRepository', repositoryWithAxios.getProductRepository())
}
