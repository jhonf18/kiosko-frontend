import { Repository } from '~/api/repository'
export default (ctx, inject) => {
  // inject the repository in the context (ctx.app.$repository)
  // And in the Vue instances (this.$repository in your components)
  const repositoryWithAxios = new Repository(ctx.$axios)
  inject(
    'branchOfficeRepository',
    repositoryWithAxios.getBranchOfficeRepository()
  )

  // You can reuse the repositoryWithAxios object:
  // inject("userRepository", repositoryWithAxios('/users'));
}
