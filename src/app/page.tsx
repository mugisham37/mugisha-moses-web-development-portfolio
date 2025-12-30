import React from 'react'
import HeroSection from '../components/Landing/HeroSection'
import AboutSection from '../components/Landing/AboutSection'
import InfoSection from '../components/Landing/InfoSection'
import ProjectsSection from '../components/Landing/ProjectsSection'
import BioSection from '../components/Landing/BioSection'

const page = () => {
  return (
    <div id="main"
      data-framer-hydrate-v2="{&quot;routeId&quot;:&quot;fZ1F6lARf&quot;,&quot;localeId&quot;:&quot;default&quot;,&quot;breakpoints&quot;:[{&quot;hash&quot;:&quot;psciyp&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1920px)&quot;},{&quot;hash&quot;:&quot;r5jr8i&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1200px) and (max-width: 1919.98px)&quot;},{&quot;hash&quot;:&quot;uo4cln&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 810px) and (max-width: 1199.98px)&quot;},{&quot;hash&quot;:&quot;yzu0cc&quot;,&quot;mediaQuery&quot;:&quot;(max-width: 809.98px)&quot;}]}"
      data-framer-ssr-released-at="2025-12-17T18:12:03.442Z" data-framer-page-optimized-at="2025-12-20T02:02:56.359Z"
      data-framer-generated-page=""><!--$-->
      <style data-framer-html-style="">
        html body {
          background: var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0));
            }

        html {
          font - size: 75%;
            }

        @media (min-width: 1920px) {
          html {
          font - size: 100%;
                }
            }

        @media (min-width: 810px) and (max-width: 1199.98px) {
          html {
          font - size: 87.5%;
                }
            }

        @media (max-width: 809.98px) {
          html {
          font - size: 87.5%;
                }
            }
      </style><!--$-->
      <div data-framer-root="" class="framer-YRYrN framer-liW5Z framer-oOooP framer-r5jr8i"
        data-framer-cursor="9zdtuk" style="min-height:100vh;width:auto"><!--$-->
        <HeroSection/>
        <AboutSection/>
        <div class="framer-16bc6t6 hidden-yzu0cc" data-framer-name="hold-hero" id="hold-hero"></div>
        <InfoSection/>
        <ProjectsSection/>
        <BioSection/>
        <div class="framer-13z09h7 hidden-yzu0cc" data-framer-name="s5-footer" id="s5"></div>
        <div class="framer-n468d9-container"><!--$-->
          <div style="display:none" aria-hidden="true"></div><!--/$-->
        </div>
      </div><!--/$-->
      <div id="overlay"></div><!--/$-->
    </div>
  )
}

export default page