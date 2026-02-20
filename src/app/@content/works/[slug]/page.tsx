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
                {/* Row 1: Full-width hero image with external link button */}
                <div className="work-detail-item work-hero-image-wrapper">
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
                    {work.externalLink && (
                        <a 
                            href={work.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="work-external-link-button"
                            aria-label="Visit live site"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    )}
                </div>

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
                                {work.externalLink && (
                                    <a 
                                        href={work.externalLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="work-external-link-text"
                                    >
                                        Visit Live Site
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                    </a>
                                )}
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
                                {work.externalLink && (
                                    <a 
                                        href={work.externalLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="work-external-link-text"
                                    >
                                        Visit Live Site
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 4: Full-width closing image with external link button */}
                <div className="work-detail-item work-closing-image-wrapper">
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
                    {work.externalLink && (
                        <a 
                            href={work.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="work-external-link-button"
                            aria-label="Visit live site"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </ContentWrapper>
    )
}

export default WorkDetailContent
