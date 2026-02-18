import React from 'react'
import Footer from './footer'

interface ContentWrapperProps {
  children: React.ReactNode
}

// Wrapper component to ensure consistent content + footer layout
const ContentWrapper = ({ children }: ContentWrapperProps) => {
  return (
    <div className="content-area-wrapper">
      <div className="content-main">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default ContentWrapper
