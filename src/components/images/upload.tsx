import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import COS from 'cos-js-sdk-v5'

const UploadImage = () => {
  const [file, setFile] = useState<File>()
  const [images, setImages] = useState<string[]>(
    JSON.parse(localStorage.getItem('local-images') || '[]'),
  )
  const cosRef = useRef<COS>()

  useEffect(() => {
    cosRef.current = new COS({
      getAuthorization: function (options, callback) {
        const url = 'https://api.lihaha.cn/api/v1/auth/cos/secret/tmp'

        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json()
          })
          .then(data => {
            const credentials = data.credentials
            if (!data || !credentials) {
              console.error(
                'credentials invalid:\n' + JSON.stringify(data, null, 2),
              )
              return
            }
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              SecurityToken: credentials.sessionToken,
              StartTime: data.startTime,
              ExpiredTime: data.expiredTime,
            })
          })
          .catch(error => {
            console.error('Error:', error)
          })
      },
    })
  }, [])

  const handleFileUpload = () => {
    if (!file || !cosRef.current) return
    const cos = cosRef.current

    const domain = 'https://static.lihaha.cn/'
    const Key = `images/${+new Date()}${file.name.slice(
      file.name.lastIndexOf('.'),
    )}`

    cos.putObject(
      {
        Bucket: 'lihaha-cn-web-static-1256651264',
        Region: 'ap-shanghai',
        Key,
        Body: file,
      },
      (err, data) => {
        if (err) {
          console.log(err)
        } else {
          console.log(data)
          setImages(images => {
            const newImages = [...images, `${domain}${Key}`]
            localStorage.setItem('local-images', JSON.stringify(newImages))
            return newImages
          })
        }
      },
    )
  }

  return (
    <div>
      <div>
        <input
          type='file'
          onChange={event => {
            const selectedFile = event.target.files?.[0]
            setFile(selectedFile)
          }}
          accept='image/*'
        />

        <span>
          <button
            onClick={handleFileUpload}
            type='button'
            className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Upload
          </button>
        </span>
      </div>

      <div className='mt-6 grid flex-wrap gap-4 md:grid-cols-img3'>
        {images.map(url => {
          return (
            <div key={url} className=''>
              <div className='break-all px-1 text-xs'>{url}</div>
              <div className='h-32 w-full overflow-hidden'>
                <img className='h-full w-full' src={url} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UploadImage
