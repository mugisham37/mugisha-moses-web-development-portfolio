import { Metadata } from 'next';
import HeroSection from '@/components/Landing/HeroSection';
import InfoSection from '@/components/Landing/InfoSection';
import ProjectsSection from '@/components/Landing/ProjectsSection';
import AboutSection from '@/components/Landing/AboutSection';

export default function Home() {
  return (
    <div id="main" 
         data-framer-hydrate-v2='{"routeId":"fZ1F6lARf","localeId":"default","breakpoints":[{"hash":"psciyp","mediaQuery":"(min-width: 1920px)"},{"hash":"r5jr8i","mediaQuery":"(min-width: 1200px) and (max-width: 1919.98px)"},{"hash":"uo4cln","mediaQuery":"(min-width: 810px) and (max-width: 1199.98px)"},{"hash":"yzu0cc","mediaQuery":"(max-width: 809.98px)"}]}'
         data-framer-ssr-released-at="2025-12-17T18:12:03.442Z" 
         data-framer-page-optimized-at="2025-12-20T02:02:56.359Z"
         data-framer-generated-page="">
      
      <style dangerouslySetInnerHTML={{
        __html: `
          html body {
            background: var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0));
          }
          html {
            font-size: 75%;
          }
          @media (min-width: 1920px) {
            html {
              font-size: 100%;
            }
          }
          @media (min-width: 810px) and (max-width: 1199.98px) {
            html {
              font-size: 87.5%;
            }
          }
          @media (max-width: 809.98px) {
            html {
              font-size: 87.5%;
            }
          }
        `
      }} />
      
      <div data-framer-root="" 
           className="framer-YRYrN framer-liW5Z framer-oOooP framer-r5jr8i"
           data-framer-cursor="9zdtuk" 
           style={{minHeight: '100vh', width: 'auto'}}>
        
        {/* Sticky Navigation */}
        <div className="framer-1xgw1dx" data-framer-name="sticky-nav"
             style={{
               willChange: 'transform, opacity, filter',
               zIndex: 8,
               opacity: 0,
               filter: 'blur(10px)',
               transform: 'translateX(-50%) translateY(55px) scale(0.9)'
             }}>
          <div className="framer-1fgo7cv-container" id="button">
            <div style={{display: 'inline-flex'}}>
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
                }}></div>
                <a href="/work" style={{
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
                }}>Work</a>
                <a href="/grid" style={{
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
                }}>Grid</a>
                <a href="/contacts" style={{
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
                }}>Inquiries</a>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <HeroSection />

        {/* Hold Hero Spacer */}
        <div className="framer-16bc6t6 hidden-yzu0cc" data-framer-name="hold-hero" id="hold-hero"></div>

        {/* Info Section */}
        <InfoSection />

        {/* Projects Section */}
        <ProjectsSection />

        {/* About Section */}
        <AboutSection />

        {/* Footer Spacer */}
        <div className="framer-13z09h7 hidden-yzu0cc" data-framer-name="s5-footer" id="s5"></div>
        
        <div className="framer-n468d9-container">
          <div style={{display: 'none'}} aria-hidden="true"></div>
        </div>
      </div>
      
      <div id="overlay"></div>
    </div>
  );
}
