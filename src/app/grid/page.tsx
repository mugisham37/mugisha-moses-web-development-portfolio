import React from 'react'
import { Metadata } from 'next'
import { MasonryGallery, GridFooter } from '../../components/Grid'

const GridPage = () => {
  return (
    <div className="framer-9Bkvf framer-liW5Z framer-oOooP framer-v2l889" 
         data-framer-cursor="9zdtuk" 
         style={{ minHeight: '100vh', width: 'auto' }}>
      
      <MasonryGallery />
      <GridFooter />
      
      <div id="overlay"></div>
    </div>
  )
}

export default GridPage