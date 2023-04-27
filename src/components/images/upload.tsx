import { useEffect, useMemo, useRef, useState } from 'react'
import COS from 'cos-js-sdk-v5'
import LazyImage from './LazyImage'

const UploadImage = () => {
  const [file, setFile] = useState<File>()
  const [images, setImages] = useState<string[]>([])
  const [previewImage, setpreviewImage] = useState<string | null>()
  const [progress, setProgress] = useState(0)

  const cosRef = useRef<COS>()

  useEffect(() => {
    if (!images?.length) {
      setImages(JSON.parse(localStorage.getItem('local-images') || '[]'))
    }
  }, [images])

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
    const UUID = crypto.randomUUID()
    const Key = `images/${UUID}${file.name.slice(file.name.lastIndexOf('.'))}`

    cos.uploadFile(
      {
        Bucket: 'lihaha-cn-web-static-1256651264',
        Region: 'ap-shanghai',
        Key,
        Body: file,
        SliceSize: 1024 * 1024 * 3,
        onProgress: function (info) {
          var percent = parseInt(`${info.percent * 10000}`) / 100
          var speed = parseInt(`${(info.speed / 1024 / 1024) * 100}`) / 100
          console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;')
          setProgress(percent)
        },
        onTaskReady: function (taskId) {
          console.log(taskId)
        },
        onFileFinish: function (err, data, options) {
          console.log(options.Key + '上传' + (err ? '失败' : '完成'))
        },
      },
      (err, data) => {
        if (err) {
          console.log(err)
        } else {
          setImages(images => {
            const newImages = [`${domain}${Key}`, ...images]
            localStorage.setItem('local-images', JSON.stringify(newImages))
            return newImages
          })
          setFile(undefined)
          setpreviewImage(undefined)
        }
      },
    )
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(0)
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)

    const reader = new FileReader()

    reader.onload = function (event) {
      setpreviewImage(event?.target?.result?.toString() || null)
    }

    reader.readAsDataURL(selectedFile)
  }

  return (
    <div>
      <div className='flex w-full items-center justify-center'>
        <label
          htmlFor='dropzone-file'
          className='dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-1 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
        >
          {previewImage ? (
            <img className='m-1 h-full w-full rounded-lg' src={previewImage} />
          ) : (
            <>
              <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                <svg
                  aria-hidden='true'
                  className='mb-3 h-10 w-10 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  ></path>
                </svg>
                <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                  <span className='font-semibold'>Click to upload</span>
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  accept=image/*
                </p>
              </div>
              <input
                id='dropzone-file'
                type='file'
                className='hidden'
                onChange={handleInputChange}
                accept='image/*'
              />
            </>
          )}
        </label>
      </div>
      <br />
      <div className='h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
        <div
          className='h-2.5 rounded-full bg-blue-600'
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <br />
      <button
        onClick={handleFileUpload}
        type='button'
        className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        Upload
      </button>

      <div className='mt-6 grid flex-wrap gap-4 sm:grid-cols-post md:grid-cols-img3'>
        {images.map(url => {
          return (
            <a key={url} href={url} target='_blank'>
              <div className='break-all px-1 text-xs'>{url}</div>
              <div className='h-32 w-full overflow-hidden'>
                {/* <img className='h-full w-full' src={url} /> */}
                <LazyImage src={url} alt='' />
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default UploadImage
