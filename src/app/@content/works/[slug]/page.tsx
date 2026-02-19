import ContentWrapper from '../../../../components/content-wrapper'
import { getWorkBySlug, getAllWorkSlugs } from '../data'
import { notFound } from 'next/navigation'

interface WorkDetailContentProps {
    params: Promise<{
        slug: string
    }>
}

// Generate static params for all work slugs
export async function generateStaticParams() {
    const slugs = getAllWorkSlugs()
    return slugs.map((slug) => ({
        slug: slug,
    }))
}

// Work detail content - shows the work details in bento grid layout
const WorkDetailContent = async ({ params }: WorkDetailContentProps) => {
    const { slug } = await params
    const work = getWorkBySlug(slug)

    // If work not found, show 404
    if (!work) {
        notFound()
    }

    return (
        <ContentWrapper>
            <div className="work-detail-container" id="work-details">
                {/* Row 1: Full-width hero image */}
                <img 
                    className="work-detail-item work-hero-image"
                    data-border="true"
                    decoding="auto"
                    width={work.heroImage.width} 
                    height={work.heroImage.height} 
                    sizes={work.heroImage.sizes}
                    srcSet={work.heroImage.srcSet}
                    src={work.heroImage.src} 
                    alt={work.heroImage.alt}
                />

                {/* Row 2: Image (left) + About Card (right) */}
                <img 
                    className="work-detail-item work-secondary-image"
                    data-border="true"
                    decoding="auto"
                    sizes={work.secondaryImage.sizes}
                    srcSet={work.secondaryImage.srcSet}
                    src={work.secondaryImage.src}
                    alt={work.secondaryImage.alt}
                />

                <div className="work-detail-item work-about-card">
                    <div className="work-text-card" data-border="true">
                        <div className="work-text-content">
                            <div className="work-text-section">
                                <h2 className="framer-text framer-styles-preset-1y43b4w">{work.title}</h2>
                                <p className="framer-text framer-styles-preset-f949vx">
                                    {work.fullDescription}
                                </p>
                            </div>
                            <div className="work-text-section">
                                <h3 className="framer-text framer-styles-preset-1y43b4w">About</h3>
                                <p className="framer-text framer-styles-preset-f949vx">Client: {work.about.client}</p>
                                <p className="framer-text framer-styles-preset-f949vx">Contribution: {work.about.contribution}</p>
                                <p className="framer-text framer-styles-preset-f949vx">Year: {work.about.year}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: Image (left) + Two stacked text cards (right) */}
                <img 
                    className="work-detail-item work-process-image"
                    data-border="true"
                    decoding="auto"
                    loading="lazy" 
                    sizes={work.processImage.sizes}
                    srcSet={work.processImage.srcSet}
                    src={work.processImage.src} 
                    alt={work.processImage.alt}
                />

                <div className="work-detail-item work-problem-card">
                    <div className="work-text-card" data-border="true">
                        <div className="work-text-content">
                            <div className="work-text-section">
                                <h3 className="framer-text framer-styles-preset-1y43b4w">{work.problemTitle}</h3>
                                {work.problemDescription.map((paragraph, index) => (
                                    <p key={index} className="framer-text framer-styles-preset-f949vx">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="work-detail-item work-solution-card">
                    <div className="work-text-card" data-border="true">
                        <div className="work-text-content">
                            <div className="work-text-section">
                                <h3 className="framer-text framer-styles-preset-1y43b4w">{work.solutionTitle}</h3>
                                {work.solutionDescription.map((paragraph, index) => (
                                    <p key={index} className="framer-text framer-styles-preset-f949vx">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 4: Full-width closing image */}
                <img 
                    className="work-detail-item work-closing-image"
                    data-border="true"
                    decoding="auto"
                    loading="lazy" 
                    width={work.closingImage.width} 
                    height={work.closingImage.height} 
                    sizes={work.closingImage.sizes}
                    srcSet={work.closingImage.srcSet}
                    src={work.closingImage.src} 
                    alt={work.closingImage.alt}
                />
            </div>
        </ContentWrapper>
    )
}

export default WorkDetailContent
