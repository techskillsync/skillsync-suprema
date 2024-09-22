/*
 * We put PreviewResume.tsx in a Shadow DOM so that tailwindcss's default styles cannot effect it.
 * If we dont do this then the downloaded version and the preview will be different.
 */
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import PreviewResume from "./PreviewResume"


 function ShadowDOMPreviewResume({ resume_data}) {
   const shadowHostRef = useRef(null)

   useEffect(() => {
     if (shadowHostRef.current) {
       const shadowRoot = shadowHostRef.current.attachShadow({ mode: 'open' })

       const container = document.createElement("div")
       shadowRoot.appendChild(container)

       ReactDOM.render(<PreviewResume {...resume_data} />, container)
     }
   }, [resume_data])

   return <div ref={shadowHostRef} id="shadow-host" />
 }

 export default ShadowDOMPreviewResume
