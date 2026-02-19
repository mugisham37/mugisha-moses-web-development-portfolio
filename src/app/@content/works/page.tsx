import ContentWrapper from '../../../components/content-wrapper'
import Link from 'next/link'
import { worksData } from './data'

// Works page content - displays grid of work cards
const WorksContent = () => {
  return (
    <ContentWrapper>
      <div className="works-grid-container">
        <div className="works-grid">
          {worksData.map((work) => (
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
