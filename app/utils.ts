export const handleImageUpload = async (image) => {
  if (image) {
    const formData = new FormData()
    formData.append('image', image)

    try {
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        console.log(response)
        const data = await response.json()
        return data.image_url
      } else {
        return 'Error uploading image'
      }
    } catch (error) {
      return `Error uploading image ${error}`
    }
  } else {
    return 'No image selected'
  }
}
