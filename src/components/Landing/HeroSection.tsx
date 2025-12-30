const HeroSection = () => {
  return (
    <div 
      className="framer-1xgw1dx" 
      data-framer-name="sticky-nav"
      style={{
        willChange: 'transform, opacity, filter',
        zIndex: 8,
        opacity: 0,
        filter: 'blur(10px)',
        transform: 'translateX(-50%) translateY(55px) scale(0.9)'
      }}
    >
      <div className="framer-1fgo7cv-container" id="button">
        <div style={{
          display: 'inline-flex'
        }}>
          <div style={{
            position: 'relative',
            display: 'inline-flex',
            backgroundColor: '#fff',
            borderRadius: '8px',
            gap: '8px',
            padding: '5px'
          }}>
            <div style={{
              position: 'absolute',
              backgroundColor: 'rgb(255, 255, 255)',
              borderRadius: '4px',
              transition: '300ms ease-in-out',
              zIndex: 1,
              left: '67px',
              width: '49px',
              height: '37px'
            }}>
            </div>
            <a 
              href="https://jarcos.work/work?ref=land-book.com"
              style={{
                position: 'relative',
                padding: '10px 12px',
                fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
                fontWeight: 600,
                letterSpacing: 0,
                fontStyle: 'normal',
                borderRadius: '8px',
                color: '#000',
                textDecoration: 'none',
                zIndex: 10,
                filter: 'invert(1)',
                mixBlendMode: 'difference',
                cursor: 'pointer'
              }}
            >
              Work
            </a>
            <a 
              href="https://jarcos.work/grid?ref=land-book.com"
              style={{
                position: 'relative',
                padding: '10px 12px',
                fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
                fontWeight: 600,
                letterSpacing: 0,
                fontStyle: 'normal',
                borderRadius: '8px',
                color: '#000',
                textDecoration: 'none',
                zIndex: 10,
                filter: 'invert(1)',
                mixBlendMode: 'difference',
                cursor: 'pointer'
              }}
            >
              Grid
            </a>
            <a 
              href="https://jarcos.work/contact?ref=land-book.com"
              style={{
                position: 'relative',
                padding: '10px 12px',
                fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
                fontWeight: 600,
                letterSpacing: 0,
                fontStyle: 'normal',
                borderRadius: '8px',
                color: '#000',
                textDecoration: 'none',
                zIndex: 10,
                filter: 'invert(1)',
                mixBlendMode: 'difference',
                cursor: 'pointer'
              }}
            >
              Inquiries
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection