import React from 'react'
import { Metadata } from 'next'
import { MasonryGallery, GridFooter } from '../../components/Grid'

export const metadata: Metadata = {
  title: 'Grid - JARCOS',
  description: 'JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.',
  openGraph: {
    title: 'JARCOS',
    description: 'JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.',
    images: [
      {
        url: 'https://framerusercontent.com/images/KzbPKaxMBB9pggMU52SND3kyRtE.png',
        width: 1200,
        height: 630,
        alt: 'JARCOS Portfolio'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JARCOS',
    description: 'JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.',
    images: ['https://framerusercontent.com/images/KzbPKaxMBB9pggMU52SND3kyRtE.png']
  },
  robots: 'max-image-preview:large',
  alternates: {
    canonical: 'https://jarcos.work/grid'
  }
}

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