export default (ctx, inject) => {
  const imagesRepository = imagesRepo(ctx.$cloudinary)
  inject('uploadImages', imagesRepository.uploadToCloudinary)
}

const imagesRepo = ($cloudinary) => ({
  uploadToCloudinary(imageFile) {
    return new Promise(async (resolve, reject) => {
      try {
        const instance = await $cloudinary.upload(imageFile, {
          uploadPreset: 'kiosko_dev',
          public_id: `product-image-${new Date().getTime()}`,
        })
        resolve(instance.secure_url)
      } catch (error) {
        reject(error)
      }
    })
  },
})
