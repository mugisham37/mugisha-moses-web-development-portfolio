import React from 'react'
import Navbar from '../../../components/navbar'

// About Me sidebar - shows scrollable about content
const AboutMeSidebar = () => {
  return (
    <main className="framer-966u9a sidebar-container" data-framer-name="Left section" data-hide-scrollbars="true">
      <div className="framer-agc1gp sidebar-content" data-framer-name="Container">
        <Navbar />
        <div className="about-me-wrapper">
          <div className="framer-11xim48-container">
            <div className="framer-siQt0 framer-M4SXU framer-LHxgI framer-E4PKR framer-6styqx framer-v-6styqx"
              data-framer-name="Variant 1">
              {/* Photo Section */}
              <div className="framer-iebpgd" data-border="true" data-framer-name="Photo"
                style={{
                  '--border-bottom-width': '1px',
                  '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
                  '--border-left-width': '1px',
                  '--border-right-width': '1px',
                  '--border-style': 'solid',
                  '--border-top-width': '1px',
                  borderRadius: '12px',
                  opacity: 1,
                  overflow: 'hidden'
                } as React.CSSProperties}>
                <div data-framer-background-image-wrapper="true"
                  style={{ position: 'relative', borderRadius: 'inherit', width: '100%', height: 'auto' }}>
                  <img
                    decoding="async"
                    loading="lazy"
                    width={1276}
                    height={1173}
                    sizes="max(100vw - 24px, 1px)"
                    srcSet="https://framerusercontent.com/images/frHllE94fKArkEFjP3xpg8wX34g.jpg?scale-down-to=512 512w,https://framerusercontent.com/images/frHllE94fKArkEFjP3xpg8wX34g.jpg?scale-down-to=1024 1024w,https://framerusercontent.com/images/frHllE94fKArkEFjP3xpg8wX34g.jpg 1276w"
                    src="https://framerusercontent.com/images/frHllE94fKArkEFjP3xpg8wX34g.jpg"
                    alt="Profile"
                    style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 'inherit' }}
                  />
                </div>
              </div>

              {/* About Me + Experience Section */}
              <div className="framer-1mazigv" data-border="true" data-framer-name="About me + Jobs"
                style={{
                  '--border-bottom-width': '1px',
                  '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
                  '--border-left-width': '1px',
                  '--border-right-width': '1px',
                  '--border-style': 'solid',
                  '--border-top-width': '1px',
                  backgroundColor: 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))',
                  borderRadius: '12px',
                  opacity: 1
                } as React.CSSProperties}>
                <div className="framer-q7hd8n" data-framer-name="About me">
                  <p className="framer-text framer-styles-preset-13sghr">About Me</p>
                  <p className="framer-text framer-styles-preset-f949vx">
                    Hi, I'm James Anderson, a passionate multi-disciplinary Product Designer
                    with a strong focus on no-code and visual development solutions. I thrive on
                    taking ideas from concept to completion, and I currently serve as the Design
                    Lead at Revolution. Want to know more? Scroll down!
                  </p>
                </div>

                {/* Experience Section */}
                <div className="framer-p9xrox" data-framer-name="Experience">
                  <p className="framer-text framer-styles-preset-13sghr">Experience</p>
                  <br />

                  <p className="framer-text framer-styles-preset-13sghr">Design Lead @ XYZ</p>
                  <p className="framer-text framer-styles-preset-13sghr">Sep 2019 - Present</p>
                  <ul className="framer-text framer-styles-preset-f949vx">
                    <li className="framer-text">Add highlights of your work experience.</li>
                    <li className="framer-text">Implemented no-code solutions, saving 30% in development time and costs.</li>
                    <li className="framer-text">Tools: Framer, Adobe XD, Webflow</li>
                  </ul>
                  <br />

                  <p className="framer-text framer-styles-preset-13sghr">Product Designer @ CDF</p>
                  <p className="framer-text framer-styles-preset-13sghr">Jul 2015 - Aug 2019</p>
                  <ul className="framer-text framer-styles-preset-f949vx">
                    <li className="framer-text">Add highlights of your work experience.</li>
                    <li className="framer-text">Conducted user research to align design strategies with customer needs.</li>
                    <li className="framer-text">Tools: Sketch, InVision, Figma</li>
                  </ul>
                  <br />

                  <p className="framer-text framer-styles-preset-13sghr">Product Designer @ ABC</p>
                  <p className="framer-text framer-styles-preset-13sghr">Jan 2012 - Mar 2015</p>
                  <ul className="framer-text framer-styles-preset-f949vx">
                    <li className="framer-text">Add highlights of your work experience.</li>
                    <li className="framer-text">Achieved a 20% increase in user engagement through UI/UX improvements.</li>
                    <li className="framer-text">Tools: Adobe Illustrator, Adobe Photoshop, Marvel</li>
                  </ul>
                </div>

                {/* Education Section */}
                <div className="framer-i5kgy5" data-framer-name="Education">
                  <p className="framer-text framer-styles-preset-13sghr">Education</p>
                  <br />
                  <p className="framer-text framer-styles-preset-13sghr">University of Technology Sydney</p>
                  <p className="framer-text framer-styles-preset-13sghr">Feb 2008 - Oct 2011</p>
                  <p className="framer-text framer-styles-preset-13sghr">Bachelor of Design in Visual Communication</p>
                </div>
              </div>

              {/* Skills + Interests Section */}
              <div className="framer-61rpwf" data-border="true" data-framer-name="Skills + Interest"
                style={{
                  '--border-bottom-width': '1px',
                  '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
                  '--border-left-width': '1px',
                  '--border-right-width': '1px',
                  '--border-style': 'solid',
                  '--border-top-width': '1px',
                  backgroundColor: 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))',
                  borderRadius: '12px',
                  boxShadow: 'rgba(107, 100, 100, 0.1) 0px 1px 3px 0px',
                  opacity: 1
                } as React.CSSProperties}>
                <div className="framer-k32yf2" data-framer-name="Skills">
                  <div className="framer-198shbe" data-framer-name="Text">
                    <p className="framer-text framer-styles-preset-13sghr">Skills</p>
                  </div>
                  <div className="framer-21hv8n" data-framer-name="Text">
                    <div className="framer-ajme51">
                      <p className="framer-text framer-styles-preset-13sghr">Framer</p>
                      <p className="framer-text framer-styles-preset-13sghr">Prototyping</p>
                      <p className="framer-text framer-styles-preset-13sghr">Wireframing</p>
                      <p className="framer-text framer-styles-preset-13sghr">User Research</p>
                    </div>
                    <div className="framer-ziz13t">
                      <p className="framer-text framer-styles-preset-13sghr">Web Design</p>
                      <p className="framer-text framer-styles-preset-13sghr">UI Design</p>
                      <p className="framer-text framer-styles-preset-13sghr">UX Design</p>
                      <p className="framer-text framer-styles-preset-13sghr">Interviews</p>
                    </div>
                  </div>
                </div>

                <div className="framer-157mepl" data-framer-name="Interest">
                  <div className="framer-9do8o1" data-framer-name="Text">
                    <p className="framer-text framer-styles-preset-13sghr">Interests</p>
                  </div>
                  <div className="framer-16pdcm0" data-framer-name="Text">
                    <div className="framer-j43na3">
                      <p className="framer-text framer-styles-preset-13sghr">Illustration</p>
                      <p className="framer-text framer-styles-preset-13sghr">No Code Tools</p>
                      <p className="framer-text framer-styles-preset-13sghr">3D Modelling</p>
                      <p className="framer-text framer-styles-preset-13sghr">Motion Graphics</p>
                    </div>
                    <div className="framer-su4wtg">
                      <p className="framer-text framer-styles-preset-13sghr">Gaming</p>
                      <p className="framer-text framer-styles-preset-13sghr">Bike Riding</p>
                      <p className="framer-text framer-styles-preset-13sghr">Reading</p>
                      <p className="framer-text framer-styles-preset-13sghr">Football</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="framer-1bhifnh" data-framer-name="Social media">
                  <div className="framer-1elf2bt" data-framer-name="Social">
                    <div className="framer-1c4kmbx" data-framer-name="Title">
                      <p className="framer-text framer-styles-preset-13sghr">
                        <a className="framer-text framer-styles-preset-1wicq5s"
                          href="https://linkedin.com/"
                          target="_blank"
                          rel="noopener noreferrer">
                          Linkedin
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="framer-sl4dr" data-framer-name="Social">
                    <div className="framer-db3jkp" data-framer-name="Title">
                      <p className="framer-text framer-styles-preset-13sghr">
                        <a className="framer-text framer-styles-preset-1wicq5s"
                          href="https://twitter.com/"
                          target="_blank"
                          rel="noopener noreferrer">
                          Twitter
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="framer-5s1wja" data-framer-name="Social media">
                    <div className="framer-judk7u" data-framer-name="Title">
                      <p className="framer-text framer-styles-preset-13sghr">
                        <a className="framer-text framer-styles-preset-1wicq5s"
                          href="https://instagram.com/"
                          target="_blank"
                          rel="noopener noreferrer">
                          Instagram
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="framer-xxdrzh" data-framer-name="Mail">
                    <p className="framer-text framer-styles-preset-13sghr">
                      <a className="framer-text framer-styles-preset-1wicq5s"
                        href="mailto:hello@jamesander.com"
                        target="_blank"
                        rel="noopener noreferrer">
                        hello@jamesander.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AboutMeSidebar