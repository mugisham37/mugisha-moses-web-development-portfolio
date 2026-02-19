'use client';

import React from 'react'
import ThemeToggle from './theme-toggle'

const navbar = () => {
    return (
        <div className="framer-zp3z1x-container">
            <div className="framer-ixQHd framer-M4SXU framer-E4PKR framer-t4vk4g framer-v-t4vk4g"
                data-framer-name="Default" style={{ width: '100%', opacity: 1 }}>
                <nav className="framer-1tf43wt" data-border="true" data-framer-name="menubar"
                    style={{ '--border-bottom-width': '1px', '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(233, 233, 236))', '--border-left-width': '1px', '--border-right-width': '1px', '--border-style': 'solid', '--border-top-width': '1px', backgroundColor: 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))', borderRadius: '11.5px', opacity: 1 } as React.CSSProperties}>
                    <div className="framer-180jz68" style={{ opacity: 1 }}>
                        <div className="framer-o6xkua" data-framer-name="Text"
                            data-framer-component-type="RichTextContainer"
                            style={{ '--extracted-r6o4lv': 'var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad, rgb(133, 133, 133))', transform: 'none', opacity: 1 } as React.CSSProperties}>
                            <p className="framer-text framer-styles-preset-13sghr"
                                data-styles-preset="oFmnpzi_h"
                                style={{ '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad, rgb(133, 133, 133)))' } as React.CSSProperties}>
                                <a className="framer-text framer-styles-preset-1wicq5s"
                                    data-styles-preset="ro7OPezbn" href="/"
                                    data-framer-page-link-current="true">Home</a></p>
                        </div>
                        <div className="framer-1ru0n5c" data-framer-name="Text"
                            data-framer-component-type="RichTextContainer"
                            style={{ '--extracted-r6o4lv': 'var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad, rgb(133, 133, 133))', transform: 'none', opacity: 1 } as React.CSSProperties}>
                            <p className="framer-text framer-styles-preset-13sghr"
                                data-styles-preset="oFmnpzi_h"
                                style={{ '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad, rgb(133, 133, 133)))' } as React.CSSProperties}>
                                <a className="framer-text framer-styles-preset-1wicq5s"
                                    data-styles-preset="ro7OPezbn" href="/about-me">About me</a></p>
                        </div>
                    </div>
                    <ThemeToggle />
                    <div className="framer-1ei1l5m-container" style={{ opacity: 1 }}>
                        <div className="framer-KgaEc framer-M4SXU framer-1kwfhba framer-v-1kwfhba"
                            data-framer-name="Primary"
                            style={{ backgroundColor: 'var(--token-1b643c06-7077-4640-a4e0-f80d2586db4b, rgba(255, 255, 255, 0))', height: '100%', borderRadius: '10px', opacity: 1 }}>
                            <a className="framer-15bg04t framer-lqpu31" data-framer-name="Button"
                                href="/contact"
                                style={{ backgroundColor: 'var(--token-41b4cf43-af77-4c56-83e3-6ebd53762080, rgb(39, 39, 42))', borderRadius: '8px', boxShadow: 'rgba(107, 100, 100, 0.1) 0px 1px 3px 0px', opacity: 1 }}>
                                <div className="framer-kn4tkw" data-framer-name="Text"
                                    data-framer-component-type="RichTextContainer"
                                    style={{ '--extracted-r6o4lv': 'var(--token-eea27fed-e360-4e51-8e28-fa8a2ed2144a, rgb(250, 250, 250))', transform: 'none', opacity: 1 } as React.CSSProperties}>
                                    <p className="framer-text framer-styles-preset-13sghr"
                                        data-styles-preset="oFmnpzi_h"
                                        style={{ '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-eea27fed-e360-4e51-8e28-fa8a2ed2144a, rgb(250, 250, 250)))' } as React.CSSProperties}>
                                        Contact</p>
                                </div>
                            </a></div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default navbar