import React from 'react'

// Reusable style objects
const STYLES = {
    footerContainer: {
        width: "100%",
        flex: "none"
    },
    footer: {
        width: "100%",
        opacity: "1"
    },
    contactBox: {
        "--border-bottom-width": "1px",
        "--border-color": "var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))",
        "--border-left-width": "1px",
        "--border-right-width": "1px",
        "--border-style": "solid",
        "--border-top-width": "1px",
        backgroundColor: "var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))",
        borderRadius: "12px",
        opacity: "1"
    },
    textContainer: {
        opacity: "1"
    },
    title: {
        transform: "none",
        opacity: "1"
    },
    description: {
        "--extracted-r6o4lv": "var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122))",
        transform: "none",
        opacity: "1"
    },
    descriptionText: {
        "--framer-text-color": "var(--extracted-r6o4lv, var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122)))"
    },
    socialColumn: {
        opacity: "1"
    },
    socialContainer: {
        opacity: "1"
    },
    socialLink: {
        height: "100%",
        borderRadius: "14px",
        opacity: "1"
    },
    socialCard: {
        "--border-bottom-width": "1px",
        "--border-color": "var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))",
        "--border-left-width": "1px",
        "--border-right-width": "1px",
        "--border-style": "solid",
        "--border-top-width": "1px",
        backgroundColor: "var(--token-88b568e1-e6f8-4980-bc8c-36e51a98442d, rgb(255, 255, 255))",
        borderRadius: "11.5px",
        opacity: "1"
    },
    iconContainer: {
        opacity: "0.8"
    },
    icon: {
        opacity: "1"
    },
    imageWrapper: {
        position: "absolute",
        borderRadius: "inherit",
        inset: "0px"
    },
    image: {
        display: "block",
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        objectPosition: "center center",
        objectFit: "cover"
    },
    copyrightContainer: {
        "--extracted-r6o4lv": "var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122))",
        transform: "none",
        opacity: "1"
    },
    copyrightText: {
        "--framer-text-alignment": "left",
        "--framer-text-color": "var(--extracted-r6o4lv, var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122)))"
    }
} as const

// Social media links configuration
const SOCIAL_LINKS = [
    {
        containerClass: "framer-1xdyvll-container",
        href: "https://github.com/mugisham37",
        imgSrc: "https://framerusercontent.com/images/tj1rxqGKe07QDYz1u1ETp3rMYwM.png",
        alt: "GitHub"
    },
    {
        containerClass: "framer-p8l2ew-container",
        href: "https://www.instagram.com/mgshmoses",
        imgSrc: "https://framerusercontent.com/images/VfdvoTY1jM0YlQfclYA0uRah8MQ.png",
        alt: "Instagram"
    },
    {
        containerClass: "framer-e7zgmv-container",
        href: "https://www.linkedin.com/in/mugisha-moses",
        imgSrc: "https://framerusercontent.com/images/l9YivlZa7CHZzJuXomTN8AYx5kY.png",
        alt: "LinkedIn"
    },
    {
        containerClass: "framer-1rwfixy-container",
        href: "https://youtube.com",
        imgSrc: "https://framerusercontent.com/images/TM6luwhgV84nkKy72IPGKMLFQ.png",
        alt: "YouTube"
    }
]

// Social link component
const SocialLink = ({ containerClass, href, imgSrc, alt }: typeof SOCIAL_LINKS[0]) => (
    <div className={containerClass} style={STYLES.socialContainer as React.CSSProperties}>
        <a
            className="framer-hjnqN framer-12r1jn2 framer-v-12r1jn2 framer-1yuywft"
            data-framer-name="Variant 1"
            href={href}
            target="_blank"
            rel="noopener"
            style={STYLES.socialLink as React.CSSProperties}
        >
            <div className="framer-1pru9e6" style={STYLES.textContainer as React.CSSProperties}>
                <div
                    className="framer-9wbe8q"
                    data-border="true"
                    data-framer-name="Card/Project"
                    style={STYLES.socialCard as React.CSSProperties}
                >
                    <div className="framer-zxr3e-container" style={STYLES.iconContainer as React.CSSProperties}>
                        <div
                            className="framer-dNIfb framer-1n00dmi framer-v-7qsfcq"
                            data-framer-name="2XS - 16x16"
                            style={STYLES.icon as React.CSSProperties}
                        >
                            <div
                                data-framer-background-image-wrapper="true"
                                style={STYLES.imageWrapper as React.CSSProperties}
                            >
                                <img
                                    decoding="auto"
                                    width="512"
                                    height="512"
                                    sizes="100vw"
                                    src={imgSrc}
                                    alt={alt}
                                    style={STYLES.image as React.CSSProperties}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
)

const Footer = () => {
    return (
        <div className="footer-container" style={STYLES.footerContainer as React.CSSProperties}>
            <footer
                className="framer-ikq6M framer-M4SXU framer-E4PKR framer-3Wby5 framer-x3qah6 framer-v-1wtjzwr"
                data-framer-name="Footer Small"
                style={STYLES.footer as React.CSSProperties}
            >
                <div
                    className="framer-1lu5t8w"
                    data-border="true"
                    data-framer-name="Contact"
                    style={STYLES.contactBox as React.CSSProperties}
                >
                    <div className="framer-5hxk0b" data-framer-name="Text" style={STYLES.textContainer as React.CSSProperties}>
                        <div
                            className="framer-1ykoo4l"
                            data-framer-name="Title"
                            data-framer-component-type="RichTextContainer"
                            style={STYLES.title as React.CSSProperties}
                        >
                            <p className="framer-text framer-styles-preset-13sghr" data-styles-preset="oFmnpzi_h">
                                Let's talk!
                            </p>
                        </div>
                        <div
                            className="framer-ld0tu4"
                            data-framer-name="Description"
                            data-framer-component-type="RichTextContainer"
                            style={STYLES.description as React.CSSProperties}
                        >
                            <p
                                className="framer-text framer-styles-preset-13sghr"
                                data-styles-preset="oFmnpzi_h"
                                style={STYLES.descriptionText as React.CSSProperties}
                            >
                                <a
                                    className="framer-text framer-styles-preset-1wicq5s"
                                    data-styles-preset="ro7OPezbn"
                                    href="mailto:mugisham505@gmail.com"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    mugisham505@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                    <div
                        className="framer-1t177bx"
                        data-framer-name="Social Media Column"
                        style={STYLES.socialColumn as React.CSSProperties}
                    >
                        {SOCIAL_LINKS.map((link, index) => (
                            <SocialLink key={index} {...link} />
                        ))}
                    </div>
                </div>
                <div className="framer-blpivt" data-framer-name="Container" style={STYLES.textContainer as React.CSSProperties}>
                    <div
                        className="framer-j3gzi9"
                        data-framer-name="© 2023 Balance"
                        data-framer-component-type="RichTextContainer"
                        style={STYLES.copyrightContainer as React.CSSProperties}
                    >
                        <p
                            className="framer-text framer-styles-preset-13sghr"
                            data-styles-preset="oFmnpzi_h"
                            style={STYLES.copyrightText as React.CSSProperties}
                        >
                            © 2025 Moses Mugisha | Full-Stack Software Engineer
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
