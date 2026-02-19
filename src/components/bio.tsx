import React from 'react'

const STYLES = {
    imageWrapper: { 
        position: 'absolute' as const, 
        borderRadius: 'inherit', 
        inset: '0px' 
    },
    image: { 
        display: 'block', 
        width: '100%', 
        height: '100%', 
        borderRadius: 'inherit', 
        objectPosition: 'center center' as const, 
        objectFit: 'cover' as const 
    },
    avatar: { 
        borderRadius: '101.82px' 
    },
    subtitle: { 
        '--extracted-r6o4lv': 'var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad, rgb(133, 133, 133))'
    } as React.CSSProperties,
    subtitleText: { 
        '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad, rgb(133, 133, 133)))' 
    } as React.CSSProperties,
    description: { 
        '--extracted-r6o4lv': 'var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122))' 
    } as React.CSSProperties,
    descriptionText: { 
        '--framer-text-alignment': 'center', 
        '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122)))' 
    } as React.CSSProperties
}

const Bio = () => {
    return (
        <div className="framer-1x6xwdf-container">
            <div className="framer-eqjhZ framer-pPjcC framer-M4SXU framer-LHxgI framer-hjedka framer-v-hjedka">
                <div className="framer-8n9uni">
                    <div className="framer-1cqkper" style={STYLES.avatar}>
                        <div data-framer-background-image-wrapper="true" style={STYLES.imageWrapper}>
                            <img
                                decoding="auto"
                                width="287"
                                height="218"
                                src="/Moses.png"
                                alt="Moses Mugisha"
                                style={STYLES.image}
                            />
                        </div>
                    </div>
                    <div className="framer-1xvoydz">
                        <div className="framer-iq3qqg">
                            <div className="framer-wcws2k" data-framer-component-type="RichTextContainer">
                                <p className="framer-text framer-styles-preset-1pt2aqn" data-styles-preset="lYOLFlQp7">
                                    Moses Mugisha
                                </p>
                            </div>
                            <div className="framer-6r9v0b" data-framer-component-type="RichTextContainer" style={STYLES.subtitle}>
                                <p className="framer-text framer-styles-preset-13sghr" data-styles-preset="oFmnpzi_h" style={STYLES.subtitleText}>
                                    Full-Stack Software Engineer
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="framer-1q5e0wt" data-framer-component-type="RichTextContainer" style={STYLES.description}>
                    <p className="framer-text framer-styles-preset-f949vx" data-styles-preset="hpASjuyu0" style={STYLES.descriptionText}>
                        Full-stack Software Engineer with 3+ years of experience building scalable web applications using Next.js, NestJS, and PostgreSQL. Based in Kigali, Rwanda.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Bio