import React from 'react'
import Navbar from '../../components/navbar'
import Bio from '../../components/bio'
import Main from '../../components/main'

// Default sidebar fallback - shows home sidebar
const DefaultSidebar = () => {
  return (
    <main className="framer-966u9a sidebar-container" data-framer-name="Left section" data-hide-scrollbars="true">
      <div className="framer-agc1gp sidebar-content" data-framer-name="Container">
        <Navbar />
        <Bio />
        <Main />
      </div>
    </main>
  )
}

export default DefaultSidebar
