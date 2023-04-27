// import React, { useRef, useState, useEffect } from 'react'

// interface LazyImageProps {
//   src: string
//   alt: string
// }

// const LazyImage: React.FC<LazyImageProps> = ({ src, alt }) => {
//   const [isVisible, setIsVisible] = useState(false)
//   const ref = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         setIsVisible(true)
//         observer.disconnect()
//       }
//     })
//     if (ref.current) {
//       observer.observe(ref.current)
//     }
//   }, [])

//   if (!src) {
//     return null // 如果 src 为空则返回 null
//   }

//   return (
//     <div style={{ position: 'relative', display: 'inline-block' }} ref={ref}>
//       {!isVisible && (
//         <svg
//           style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//           }}
//           xmlns='http://www.w3.org/2000/svg'
//           width='24'
//           height='24'
//           viewBox='0 0 24 24'
//         >
//           <path d='M22.84 11.7c-.17-4.57-3.96-8.28-8.54-8.3a8.26 8.26 0 0 0-8.27 8.25 8.26 8.26 0 0 0 8.26 8.25 8.26 8.26 0 0 0 8.26-8.25c0-.28-.02-.56-.05-.85zM3.16 11.7c.17 4.57 3.96 8.28 8.54 8.3a8.26 8.26 0 0 0 8.27-8.25 8.26 8.26 0 0 0-8.26-8.25 8.26 8.26 0 0 0-8.26 8.25c0 .28.02.56.05.85z' />
//           <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
//         </svg>
//       )}
//       <img
//         className='h-full w-full'
//         src={isVisible ? src : ''}
//         alt={alt}
//         style={{ opacity: isVisible ? 1 : 0 }}
//       />
//     </div>
//   )
// }

// export default LazyImage

// import React, { useRef, useState, useEffect } from 'react'

// interface LazyImageProps {
//   src: string
//   alt: string
// }

// const LazyImage: React.FC<LazyImageProps> = ({ src, alt }) => {
//   const [isVisible, setIsVisible] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const ref = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         setIsVisible(true)
//         observer.disconnect()
//       }
//     })
//     if (ref.current) {
//       observer.observe(ref.current)
//     }
//   }, [])

//   if (!src) {
//     return null // 如果 src 为空则返回 null
//   }

//   return (
//     <div style={{ position: 'relative', display: 'inline-block' }} ref={ref}>
//       {!isVisible && (
//         <svg
//           style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//           }}
//           xmlns='http://www.w3.org/2000/svg'
//           width='24'
//           height='24'
//           viewBox='0 0 24 24'
//         >
//           <path d='M22.84 11.7c-.17-4.57-3.96-8.28-8.54-8.3a8.26 8.26 0 0 0-8.27 8.25 8.26 8.26 0 0 0 8.26 8.25 8.26 8.26 0 0 0 8.26-8.25c0-.28-.02-.56-.05-.85zM3.16 11.7c.17 4.57 3.96 8.28 8.54 8.3a8.26 8.26 0 0 0 8.27-8.25 8.26 8.26 0 0 0-8.26-8.25 8.26 8.26 0 0 0-8.26 8.25c0 .28.02.56.05.85z' />
//           <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
//         </svg>
//       )}
//       <img
//         className='h-full w-full'
//         src={isVisible ? src : ''}
//         alt={alt}
//         onLoad={() => setIsLoading(false)}
//         style={{
//           opacity: isVisible ? (isLoading ? 0.5 : 1) : 0,
//           transition: 'opacity 0.3s ease-in-out',
//         }}
//       />
//     </div>
//   )
// }

// export default LazyImage

import React, { useRef, useState, useEffect } from 'react'

interface LazyImageProps {
  src: string
  alt: string
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    })
    if (ref.current) {
      observer.observe(ref.current)
    }
  }, [])

  return (
    <div ref={ref}>
      {!isVisible && (
        <span className='h-full w-full text-center align-baseline'>
          加载中...
        </span>
      )}
      <img
        className='h-full w-full'
        src={isVisible ? src : ''}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        style={{
          opacity: isVisible ? (isLoading ? 0.5 : 1) : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        decoding='async'
      />
    </div>
  )
}

export default LazyImage
