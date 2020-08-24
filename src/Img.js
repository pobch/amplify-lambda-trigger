import React, { useState, useEffect } from 'react'
import { Storage } from 'aws-amplify'
import { v4 as uuid } from 'uuid'

function Img() {
  const [images, setImages] = useState([])

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    const files = await Storage.list('')
    const signedFiles = await Promise.all(
      files.map(async (file) => {
        const signedFile = await Storage.get(file.key)
        return signedFile
      })
    )
    setImages(signedFiles)
  }

  async function onChange(e) {
    const file = e.target.files[0]
    console.log('File:', file)
    const fileType = file.name.split('.')[file.name.split('.').length - 1]
    await Storage.put(`${uuid()}.${fileType}`, file)
    fetchImages()
  }

  return (
    <div>
      <input type="file" onChange={onChange} />
      {images.map((image) => {
        return <img src={image} key={image} style={{ width: 500 }} alt="" />
      })}
    </div>
  )
}

export default Img
