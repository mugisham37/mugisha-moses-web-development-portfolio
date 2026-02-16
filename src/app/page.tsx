import React from 'react'
import Hero from '../components/hero'
import WorkProduct from '../components/work_product'
import footer from '../components/footer'
import nav_bar from '../components/nav_bar'

const page = () => {
    return (
        <div id="main"
            data-framer-hydrate-v2='{"routeId":"KcCSXScMt","localeId":"default","pathVariables":{"DVyP1z9wW":"bookease-copy"},"breakpoints":[{"hash":"kppm2p","mediaQuery":"(min-width: 1200px)"},{"hash":"1gbxv9u","mediaQuery":"(min-width: 810px) and (max-width: 1199px)"},{"hash":"8mfzd3","mediaQuery":"(max-width: 809px)"},{"hash":"10mb1y6","mediaQuery":"(min-width: 1200px)"},{"hash":"hfs46s","mediaQuery":"(min-width: 810px) and (max-width: 1199.98px)"},{"hash":"182i2eb","mediaQuery":"(max-width: 809.98px)"}]}'
            data-framer-ssr-released-at="2025-10-10T00:35:35.953Z" data-framer-page-optimized-at="2025-10-10T17:52:44.376Z"
            data-framer-generated-page="">

            <div data-routeid="augiA20Il" className="framer-DpqqR framer-10mb1y6" data-layout-template="true"
                style={{ minHeight: '100vh', width: 'auto' }}>
                <div className="ssr-variant hidden-hfs46s hidden-10mb1y6">
                    <main className="framer-966u9a" data-framer-name="Left section" data-hide-scrollbars="true">
                        <div className="framer-agc1gp" data-framer-name="Container">
                            <nav_bar/>
                            <Hero />
                            <WorkProduct />
                            
                        </div>
                    </main>
                </div>
                <div data-framer-root="" className="framer-dWn3f framer-72rtr7"
                                style={{ minHeight: '100vh', width: 'auto', display: 'contents' }}>
                                <div className="framer-1lw7frw-container">
                                    <div className="framer-vm656 framer-ot9dfq framer-v-z0mcsa" data-framer-name="Phone"
                                        style={{ width: '100%', opacity: 1 }}>
                                        <div className="framer-1jf8nol-container" data-framer-name="Image Reel"
                                            style={{ opacity: 1 }}>
                                            <div className="framer-6mNN4 framer-rdxack framer-v-rdxack" data-border="true"
                                                data-framer-name="Variant 1" data-highlight="true"
                                                style={{ '--border-bottom-width': '1px', '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))', '--border-left-width': '1px', '--border-right-width': '1px', '--border-style': 'solid', '--border-top-width': '1px', height: '100%', width: '100%', borderRadius: '12px', opacity: 1 } as React.CSSProperties}>
                                                <div data-framer-background-image-wrapper="true"
                                                    style={{ position: 'absolute', borderRadius: 'inherit', inset: '0px' }}><img decoding="auto"
                                                        width="3000" height="2250" sizes="max(100vw - 24px, 1px)"
                                                        srcSet="https://framerusercontent.com/images/USIXQs540C78B1u5ZnBYH8fGZKU.png?scale-down-to=512 512w,https://framerusercontent.com/images/USIXQs540C78B1u5ZnBYH8fGZKU.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/USIXQs540C78B1u5ZnBYH8fGZKU.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/USIXQs540C78B1u5ZnBYH8fGZKU.png 3000w"
                                                        src="https://framerusercontent.com/images/USIXQs540C78B1u5ZnBYH8fGZKU.png?scale-down-to=2048"
                                                        alt=""
                                                        style={{ display: 'block', width: '100%', height: '100%', borderRadius: 'inherit', objectPosition: 'center center', objectFit: 'cover' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="overlay"></div>
                            <div className="framer-c5x4tb"></div>
                            <footer/>
            </div>
        </div>
    )
}

export default page