import React from 'react'
import ContentWrapper from '../../../components/content-wrapper'
import Link from 'next/link'

// Works data
const works = [
  {
    id: 'bookease-copy',
    title: 'BookEase App',
    description: 'Intuitive platform for seamless online book shopping.',
    image: 'https://framerusercontent.com/images/I3WJm2mv67qLCa3IapaovJh6EmU.webp'
  },
  {
    id: 'produli',
    title: 'Produli',
    description: 'IoT-enabled kitchen chopping board.',
    image: 'https://framerusercontent.com/images/ORiNmQF0Pu1sP6MUbOKf4J4f2UA.png'
  },
  {
    id: 'travelease',
    title: 'TravelEase',
    description: 'A rebranded travel agency site aimed at millennials.',
    image: 'https://framerusercontent.com/images/5Ut9ib9l2kwjn6ThlsPt54yiA.png'
  },
  {
    id: 'edukids',
    title: 'EduKids',
    description: 'Educational platform offering interactive learning for kids.',
    image: 'https://framerusercontent.com/images/pybLPiPdzHp1iq9ezjjFGw9IJQ.png'
  },
  {
    id: 'fitbod',
    title: 'FitBod',
    description: 'Web-based fitness tracking and meal planning.',
    image: 'https://framerusercontent.com/images/wIVnZ13oYsjU5mC3b5BAMDYPBY.png'
  },
  {
    id: 'photomingle',
    title: 'PhotoMingle',
    description: 'Social media platform focused on photography enthusiasts.',
    image: 'https://framerusercontent.com/images/dynunyDW5G2prn1TjiYIiuAU.png'
  },
  {
    id: 'bookease-branding',
    title: 'BookEase Branding',
    description: 'Comprehensive branding and identity design.',
    image: 'https://framerusercontent.com/images/I3WJm2mv67qLCa3IapaovJh6EmU.webp'
  }
]

// Works page content - displays grid of work cards
const WorksContent = () => {
  return (
    <ContentWrapper>
      <div className="works-grid-container">
        <div className="works-grid">
          {works.map((work) => (
            <div key={work.id} className="work-card-container">
              <Link
                href={`/works/${work.id}#work-details`}
                className="work-card"
                data-border="true"
              >
                <div className="work-card-content">
                  <div className="work-card-photo">
                    <div className="work-card-image-wrapper">
                      <img
                        decoding="auto"
                        sizes="64px"
                        src={work.image}
                        alt={work.title}
                      />
                    </div>
                  </div>
                  <div className="work-card-info">
                    <div className="work-card-title">
                      <h2 className="framer-text framer-styles-preset-1y43b4w">
                        {work.title}
                      </h2>
                    </div>
                    <div className="work-card-description">
                      <p className="framer-text framer-styles-preset-13sghr">
                        {work.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </ContentWrapper>
  )
}

export default WorksContent
