import React from 'react'
import { Metadata } from 'next'
import ProjectsShowcase from '../../components/Work/ProjectsShowcase'
import JarcosFooter from '../../components/Work/JarcosFooter'
import AboutSection from '../../components/Work/AboutSection'

export const metadata: Metadata = {
  title: 'Work - JARCOS',
  description: 'JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.',
  openGraph: {
    type: 'website',
    title: 'JARCOS',
    description: 'JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.',
    images: [
      {
        url: 'https://framerusercontent.com/images/KzbPKaxMBB9pggMU52SND3kyRtE.png',
        width: 1200,
        height: 630,
        alt: 'JARCOS Work'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JARCOS',
    description: 'JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.',
    images: ['https://framerusercontent.com/images/KzbPKaxMBB9pggMU52SND3kyRtE.png']
  }
}

const WorkPage = () => {
  return (
    <div id="main" 
         data-framer-hydrate-v2='{"routeId":"fZ1F6lARf","localeId":"default","breakpoints":[{"hash":"psciyp","mediaQuery":"(min-width: 1920px)"},{"hash":"r5jr8i","mediaQuery":"(min-width: 1200px) and (max-width: 1919.98px)"},{"hash":"uo4cln","mediaQuery":"(min-width: 810px) and (max-width: 1199.98px)"},{"hash":"yzu0cc","mediaQuery":"(max-width: 809.98px)"}]}'
         data-framer-ssr-released-at="2025-12-17T18:12:03.442Z" 
         data-framer-page-optimized-at="2025-12-20T02:02:56.359Z"
         data-framer-generated-page="">
      
      <ProjectsShowcase />
      <JarcosFooter />
      <AboutSection />
      
    </div>
  )
}

export default WorkPage