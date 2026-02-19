import React from 'react'
import ContentWrapper from '../../../../components/content-wrapper'

// Work detail content - shows the work details in bento grid layout
const WorkDetailContent = () => {
    return (
        <ContentWrapper>
            <div className="work-detail-container" id="work-details">
                {/* Row 1: Full-width hero image */}
                <img 
                    className="work-detail-item work-hero-image"
                    data-border="true"
                    decoding="auto"
                    width="2400" 
                    height="1600" 
                    sizes="calc(100vw - 24px)"
                    srcSet="https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png?scale-down-to=512 512w,https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png?scale-down-to=4096 4096w,https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png 4500w"
                    src="https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png" 
                    alt="BookEase App Hero"
                />

                {/* Row 2: Image (left) + About Card (right) */}
                <img 
                    className="work-detail-item work-secondary-image"
                    data-border="true"
                    decoding="auto"
                    sizes="calc(100vw - 24px)"
                    srcSet="https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png?scale-down-to=512 512w,https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png?scale-down-to=4096 4096w,https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png 4500w"
                    src="https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png"
                    alt="BookEase App Screenshot"
                />

                <div className="work-detail-item work-about-card">
                    <div className="work-text-card" data-border="true">
                        <div className="work-text-content">
                            <div className="work-text-section">
                                <h2 className="framer-text framer-styles-preset-1y43b4w">BookEase App</h2>
                                <p className="framer-text framer-styles-preset-f949vx">
                                    BookEase offers a comprehensive collection of books across genres and languages, 
                                    aimed at making book buying a satisfying and simple experience.
                                </p>
                            </div>
                            <div className="work-text-section">
                                <h3 className="framer-text framer-styles-preset-1y43b4w">About</h3>
                                <p className="framer-text framer-styles-preset-f949vx">Client: BookStores Inc.</p>
                                <p className="framer-text framer-styles-preset-f949vx">Contribution: UX Design, Web Development</p>
                                <p className="framer-text framer-styles-preset-f949vx">Year: 2022</p>
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
                    sizes="calc(100vw - 24px)"
                    srcSet="https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png?scale-down-to=512 512w,https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png?scale-down-to=4096 4096w,https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png 4500w"
                    src="https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png" 
                    alt="BookEase Process"
                />

                <div className="work-detail-item work-problem-card">
                    <div className="work-text-card" data-border="true">
                        <div className="work-text-content">
                            <div className="work-text-section">
                                <h3 className="framer-text framer-styles-preset-1y43b4w">The Problems to Solve</h3>
                                <p className="framer-text framer-styles-preset-f949vx">
                                    BookEase underwent a complete UX redesign, focusing on streamlined user paths and search efficiency. 
                                    Advanced search algorithms were implemented to guide users to the most relevant categories, 
                                    and an intelligent recommendation engine was developed.
                                </p>
                                <p className="framer-text framer-styles-preset-f949vx">
                                    The checkout process was also streamlined through a multi-step design, reducing load time 
                                    and effectively decreasing cart abandonment rates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="work-detail-item work-solution-card">
                    <div className="work-text-card" data-border="true">
                        <div className="work-text-content">
                            <div className="work-text-section">
                                <h3 className="framer-text framer-styles-preset-1y43b4w">Our Solution</h3>
                                <p className="framer-text framer-styles-preset-f949vx">
                                    BookEase underwent a complete UX redesign, focusing on streamlined user paths and search efficiency. 
                                    Advanced search algorithms were implemented to guide users to the most relevant categories, 
                                    and an intelligent recommendation engine was developed.
                                </p>
                                <p className="framer-text framer-styles-preset-f949vx">
                                    The checkout process was also streamlined through a multi-step design, reducing load time 
                                    and effectively decreasing cart abandonment rates.
                                </p>
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
                    width="2400" 
                    height="1600" 
                    sizes="calc(100vw - 24px)"
                    srcSet="https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png?scale-down-to=512 512w,https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png?scale-down-to=4096 4096w,https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png 4500w"
                    src="https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png" 
                    alt="BookEase Final"
                />
            </div>
        </ContentWrapper>
    )
}

export default WorkDetailContent
