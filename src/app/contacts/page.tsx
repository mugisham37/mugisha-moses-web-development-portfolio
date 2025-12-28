import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

// TypeScript declaration for CSS custom properties
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

const page = () => {
  return (
    <div id="main"
        data-framer-hydrate-v2="{&quot;routeId&quot;:&quot;fZ1F6lARf&quot;,&quot;localeId&quot;:&quot;default&quot;,&quot;breakpoints&quot;:[{&quot;hash&quot;:&quot;psciyp&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1920px)&quot;},{&quot;hash&quot;:&quot;r5jr8i&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1200px) and (max-width: 1919.98px)&quot;},{&quot;hash&quot;:&quot;uo4cln&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 810px) and (max-width: 1199.98px)&quot;},{&quot;hash&quot;:&quot;yzu0cc&quot;,&quot;mediaQuery&quot;:&quot;(max-width: 809.98px)&quot;}]}"
        data-framer-ssr-released-at="2025-12-17T18:12:03.442Z" data-framer-page-optimized-at="2025-12-20T02:02:56.359Z"
        data-framer-generated-page="">
        <style data-framer-html-style="" dangerouslySetInnerHTML={{
          __html: `
            html body {
                background: var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0));
            }

            html {
                font-size: 75%;
            }

            @media (min-width: 1920px) {
                html {
                    font-size: 93.75%;
                }
            }

            @media (min-width: 810px) and (max-width: 1199.98px) {
                html {
                    font-size: 87.5%;
                }
            }

            @media (max-width: 809.98px) {
                html {
                    font-size: 87.5%;
                }
            }
          `
        }} />
        <div data-framer-root="" className="framer-0UlxO framer-JQeFT framer-oOooP framer-2ve9rf"
            data-framer-cursor="9zdtuk" style={{minHeight: '100vh', width: 'auto'}}>
            <div className="framer-1gbk15u" data-framer-name="contact">
                <div className="framer-g3cvab" data-framer-name="nav">
                    <div className="framer-1aioayl hidden-120xsh4" data-framer-appear-id="1aioayl" data-framer-name="logo"
                        style={{opacity: 1, transform: 'none', willChange: 'transform'}}>
                        <div className="framer-1ofzk1z-container" id="logo-nav">
                            <Link href="/" title=""
                                style={{display: 'flex', placeContent: 'center', placeItems: 'center', width: '100%', height: '100%', padding: '0px'}}>
                                <Image src="https://framerusercontent.com/images/D2ewTLV8miOQ39l8w4yRHAeWc.svg?width=76&height=16"
                                    alt=""
                                    width={76}
                                    height={16}
                                    style={{maxWidth: '100%', maxHeight: '100%', borderRadius: '0px', WebkitUserDrag: 'none', userSelect: 'none'} as React.CSSProperties} />
                                <div style={{position: 'absolute', inset: '0px', pointerEvents: 'none', borderRadius: '0px'}}>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="framer-19bbbnz" data-framer-name="nav" style={{position: 'relative'}}>
                        <div className="framer-1115hq4" data-framer-appear-id="1115hq4" data-framer-name="index"
                            style={{opacity: 1, transform: 'none', willChange: 'transform', transition: '0.5s cubic-bezier(0.38, 0.1, 0, 0.99)'}}>
                            <div className="framer-iie8j1" data-framer-component-type="RichTextContainer"
                                style={{transform: 'none'}}>
                                <p className="framer-text"
                                    style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0))'}}>
                                    <Link className="framer-text framer-styles-preset-2iafg6" data-styles-preset="pHGd88_IS"
                                        href="/">Index</Link></p>
                            </div>
                        </div>
                        <div className="framer-7hpm39" data-framer-appear-id="7hpm39" data-framer-name="work"
                            style={{opacity: 1, transform: 'none', willChange: 'transform', transition: '0.5s cubic-bezier(0.38, 0.1, 0, 0.99)'}}>
                            <div className="framer-1ijw6xt" data-framer-component-type="RichTextContainer"
                                style={{transform: 'none'}}>
                                <p className="framer-text"
                                    style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0))'}}>
                                    <Link className="framer-text framer-styles-preset-2iafg6" data-styles-preset="pHGd88_IS"
                                        href="/work">Work</Link></p>
                            </div>
                        </div>
                        <div className="framer-9aspnm" data-framer-appear-id="9aspnm" data-framer-name="grid"
                            style={{opacity: 1, transform: 'none', willChange: 'transform', transition: '0.5s cubic-bezier(0.38, 0.1, 0, 0.99)'}}>
                            <div className="framer-13p1gpc" data-framer-component-type="RichTextContainer"
                                style={{transform: 'none'}}>
                                <p className="framer-text"
                                    style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0))'}}>
                                    <Link className="framer-text framer-styles-preset-2iafg6" data-styles-preset="pHGd88_IS"
                                        href="/grid">Grid</Link></p>
                            </div>
                        </div>
                        <div className="framer-oqacpj" data-framer-appear-id="oqacpj" data-framer-name="inquiries"
                            style={{opacity: 1, transform: 'none', willChange: 'transform', transition: '0.5s cubic-bezier(0.38, 0.1, 0, 0.99)'}}>
                            <div className="framer-40nqxq" data-framer-component-type="RichTextContainer"
                                style={{transform: 'none'}}>
                                <p className="framer-text"
                                    style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0))'}}>
                                    <Link className="framer-text framer-styles-preset-2iafg6" data-styles-preset="pHGd88_IS"
                                        href="/contacts"
                                        data-framer-page-link-current="true">Inquiries</Link></p>
                            </div>
                        </div>
                    </div>
                    <div className="framer-phx1pg hidden-120xsh4" data-framer-appear-id="phx1pg" data-framer-name="gru"
                        style={{opacity: 1, transform: 'none', willChange: 'transform'}}>
                        <div className="framer-tr0brz" data-framer-cursor="egh7w7" data-framer-name="gru-clock">
                            <div className="framer-1qc9snx" data-framer-component-type="RichTextContainer"
                                style={{transform: 'none'}}>
                                <p className="framer-text"
                                    style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))'}}>
                                    Guarulhos</p>
                            </div>
                            <div className="framer-1f8jasp-container">
                                <div
                                    style={{fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif', fontSize: 'calc(var(--framer-root-font-size, 1rem) * 1)', fontStyle: 'normal', fontWeight: '600', letterSpacing: '0em', lineHeight: '1em', color: 'var(--token-ca6856c1-9c1c-4bdc-8dc5-6eb703253edf, rgb(128, 128, 128))'}}>
                                    08:16</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="framer-5kf29h" data-border="true" data-framer-name="cols">
                    <div className="framer-1khm3c2" data-border="true" data-framer-name="col-1">
                        <div className="framer-18xai4d" data-framer-name="wrapper">
                            <div className="framer-vsdi05" data-framer-name="head">
                                <div className="framer-whpbwu" data-framer-name="text">
                                    <div className="framer-oyhpom" data-framer-name="1-col">
                                        <div className="framer-1z0cglv" data-framer-component-type="RichTextContainer"
                                            style={{transform: 'none'}}>
                                            <p className="framer-text"
                                                style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))'}}>
                                                Quick links</p>
                                        </div>
                                        <div className="framer-1uqgnsw" data-framer-name="2-col"
                                            style={{position: 'relative'}}>
                                            <div className="framer-qxaj5v" data-framer-name="linkedin">
                                                <div className="framer-1907qgf"
                                                    data-framer-component-type="RichTextContainer"
                                                    style={{transform: 'none'}}>
                                                    <p className="framer-text"
                                                        style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-ca6856c1-9c1c-4bdc-8dc5-6eb703253edf, rgb(128, 128, 128))'}}>
                                                        <a className="framer-text framer-styles-preset-107zmfp"
                                                            data-styles-preset="lYmM3ANLp"
                                                            href="https://savee.com/jarcoswork" target="_blank"
                                                            rel="noopener">Linkedin</a></p>
                                                </div>
                                            </div>
                                            <div className="framer-sjhq6n" data-framer-name="instagram">
                                                <div className="framer-imzfov"
                                                    data-framer-component-type="RichTextContainer"
                                                    style={{transform: 'none'}}>
                                                    <p className="framer-text"
                                                        style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-ca6856c1-9c1c-4bdc-8dc5-6eb703253edf, rgb(128, 128, 128))'}}>
                                                        <a className="framer-text framer-styles-preset-107zmfp"
                                                            data-styles-preset="lYmM3ANLp"
                                                            href="https://savee.com/jarcoswork" target="_blank"
                                                            rel="noopener">Instagram</a></p>
                                                </div>
                                            </div>
                                            <div className="framer-62bt2a" data-framer-name="savee">
                                                <div className="framer-12tz3ts"
                                                    data-framer-component-type="RichTextContainer"
                                                    style={{transform: 'none'}}>
                                                    <p className="framer-text"
                                                        style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-ca6856c1-9c1c-4bdc-8dc5-6eb703253edf, rgb(128, 128, 128))'}}>
                                                        <a className="framer-text framer-styles-preset-107zmfp"
                                                            data-styles-preset="lYmM3ANLp"
                                                            href="https://savee.com/jarcoswork" target="_blank"
                                                            rel="noopener">Savee</a></p>
                                                </div>
                                            </div>
                                            <div className="framer-u4r4qy" data-framer-name="email">
                                                <div className="framer-hscvma"
                                                    data-framer-component-type="RichTextContainer"
                                                    style={{transform: 'none'}}>
                                                    <p className="framer-text"
                                                        style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-ca6856c1-9c1c-4bdc-8dc5-6eb703253edf, rgb(128, 128, 128))'}}>
                                                        <a className="framer-text framer-styles-preset-107zmfp"
                                                            data-styles-preset="lYmM3ANLp"
                                                            href="https://savee.com/jarcoswork" target="_blank"
                                                            rel="noopener">Email</a></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="framer-feboow" data-framer-name="1-col">
                                        <div className="framer-siud76" data-framer-component-type="RichTextContainer"
                                            style={{transform: 'none'}}>
                                            <p className="framer-text"
                                                style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))'}}>
                                                Info</p>
                                        </div>
                                        <div className="framer-dg0v0w" data-framer-name="2-col" style={{position: 'relative'}}>
                                            <div className="framer-vfthb3" data-framer-name="email">
                                                <div className="framer-923frq"
                                                    data-framer-component-type="RichTextContainer"
                                                    style={{transform: 'none'}}>
                                                    <p className="framer-text"
                                                        style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-ca6856c1-9c1c-4bdc-8dc5-6eb703253edf, rgb(128, 128, 128))'}}>
                                                        <a className="framer-text framer-styles-preset-107zmfp"
                                                            data-styles-preset="lYmM3ANLp" href="mailto:hi@jarcos.work"
                                                            target="_blank" rel="noopener">hi@jarcos.work</a></p>
                                                </div>
                                            </div>
                                            <div className="framer-8uz0px" data-framer-name="telefone">
                                                <div className="framer-x8b3so"
                                                    data-framer-component-type="RichTextContainer"
                                                    style={{transform: 'none'}}>
                                                    <p className="framer-text"
                                                        style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-ca6856c1-9c1c-4bdc-8dc5-6eb703253edf, rgb(128, 128, 128))'}}>
                                                        <a className="framer-text framer-styles-preset-107zmfp"
                                                            data-styles-preset="lYmM3ANLp"
                                                            href="https://wa.me/5511948742029" target="_blank"
                                                            rel="noopener">55 11 948 742 029</a></p>
                                                </div>
                                            </div>
                                            <div className="framer-16vgl50" data-framer-name="brasil">
                                                <div className="framer-f0pwwi"
                                                    data-framer-component-type="RichTextContainer"
                                                    style={{transform: 'none'}}>
                                                    <p className="framer-text"
                                                        style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-ca6856c1-9c1c-4bdc-8dc5-6eb703253edf, rgb(128, 128, 128))'}}>
                                                        Brasil</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="framer-la2c2u" data-framer-name="col-2">
                        <div className="framer-1w400d1" data-framer-name="wrapper">
                            <div className="framer-18cwo4p" data-framer-name="headline">
                                <div className="framer-4h3v81" data-framer-component-type="RichTextContainer"
                                    style={{transform: 'none'}}>
                                    <p className="framer-text"
                                        style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-line-height': '1.3em', '--framer-text-color': 'var(--token-ca6856c1-9c1c-4bdc-8dc5-6eb703253edf, rgb(128, 128, 128))'}}>
                                        <span className="framer-text"
                                            style={{'--framer-text-color': 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))'}}>Drop
                                            me a line</span><span className="framer-text"
                                            style={{'--framer-text-color': 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))'}}>
                                                <br className="framer-text" /></span><br className="framer-text" />Whether it&apos;s a
                                        project, a collaboration, or just a question - don&apos;t be shy. I&apos;m an introvert
                                        too, so I get it.</p>
                                </div>
                            </div>
                            <div className="framer-1ifw8x9" data-framer-name="form">
                                <form className="framer-vyyns" data-framer-name="form-component">
                                    <div className="framer-pt1or0" data-framer-name="fields">
                                        <label className="framer-16gg741">
                                            <div className="framer-139tdbv" data-framer-component-type="RichTextContainer"
                                                style={{transform: 'none'}}>
                                                <p className="framer-text"
                                                    style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-text-color': 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))'}}>
                                                    Name</p>
                                            </div>
                                            <div className="framer-form-text-input framer-form-input-wrapper framer-1afwr5b">
                                                <input type="text" required={true} name="Name" placeholder="Enter your name"
                                                    className="framer-form-input framer-form-input-empty" defaultValue="" />
                                            </div>
                                        </label>
                                        <label className="framer-1jbwxo3">
                                            <div className="framer-1clrhke" data-framer-component-type="RichTextContainer"
                                                style={{transform: 'none'}}>
                                                <p className="framer-text"
                                                    style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-text-color': 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))'}}>
                                                    And your email so I can get back to you?</p>
                                            </div>
                                            <div className="framer-form-text-input framer-form-input-wrapper framer-152w21d">
                                                <input type="email" required={true} name="Email"
                                                    placeholder="Enter your email"
                                                    className="framer-form-input framer-form-input-empty" defaultValue="" />
                                            </div>
                                        </label>
                                        <label className="framer-5npzyf">
                                            <div className="framer-4u9chn" data-framer-component-type="RichTextContainer"
                                                style={{transform: 'none'}}>
                                                <p className="framer-text"
                                                    style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-text-color': 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))'}}>
                                                    How did you hear of me?</p>
                                            </div>
                                            <div className="framer-form-text-input framer-form-input-wrapper framer-1lnmxtw">
                                                <input type="text" required={true} name="Source"
                                                    placeholder="Enter your answer"
                                                    className="framer-form-input framer-form-input-empty" defaultValue="" />
                                            </div>
                                        </label>
                                        <label className="framer-hiek8u">
                                            <div className="framer-j0o7qy" data-framer-component-type="RichTextContainer"
                                                style={{transform: 'none'}}>
                                                <p className="framer-text"
                                                    style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-letter-spacing': '-0.01em', '--framer-text-color': 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))'}}>
                                                    Briefly, tell me about your project</p>
                                            </div>
                                            <div className="framer-form-text-input framer-form-input-wrapper framer-wonap7">
                                                <textarea required={true} name="Message" placeholder="Enter your answer"
                                                    className="framer-form-input"></textarea>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="framer-6sebq0" id="button-1">
                                        <div className="framer-1c6yq4q-container" data-framer-cursor="bg41hh">
                                            <button type="submit" className="framer-jL7A5 framer-14totus framer-v-14totus"
                                                data-framer-name="Default" data-reset="button" tabIndex={0}
                                                style={{'--border-bottom-width': '0px', '--border-color': 'rgba(0, 0, 0, 0)', '--border-left-width': '0px', '--border-right-width': '0px', '--border-style': 'solid', '--border-top-width': '0px', backgroundColor: 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))', height: '100%', borderRadius: '4px', opacity: 1}}>
                                                <div className="framer-7jl4bu" data-framer-name="hover-fill"
                                                    style={{backgroundColor: 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))', filter: 'blur(10px)', opacity: 1}}>
                                                </div>
                                                <div className="framer-1eccll2"
                                                    data-framer-component-type="RichTextContainer"
                                                    style={{'--extracted-r6o4lv': 'var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0))', '--framer-link-text-color': 'rgb(0, 153, 255)', '--framer-link-text-decoration': 'underline', filter: 'blur(2px)', opacity: 0, transform: 'translateY(-50%)'}}>
                                                    <p className="framer-text"
                                                        style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0)))'}}>
                                                        Sent! I&apos;ll follow up with you soon</p>
                                                </div>
                                                <div className="framer-rcjigl"
                                                    data-framer-component-type="RichTextContainer"
                                                    style={{'--extracted-r6o4lv': 'var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0))', '--framer-link-text-color': 'rgb(0, 153, 255)', '--framer-link-text-decoration': 'underline', opacity: 1, transform: 'translateY(-50%)'}}>
                                                    <p className="framer-text"
                                                        style={{'--font-selector': 'RlI7SW50ZXJEaXNwbGF5LVNlbWlCb2xk', '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif', '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)', '--framer-font-weight': '600', '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0)))'}}>
                                                        Send message</p>
                                                </div>
                                                <div className="framer-pfvpuo" data-framer-name="arrow-right"
                                                    style={{transform: 'translateY(-50%)', opacity: 1}}>
                                                    <div data-framer-component-type="SVG" data-framer-name="arrow-hover"
                                                        className="framer-xwy19m" aria-hidden="true"
                                                        style={{imageRendering: 'pixelated', flexShrink: 0, backgroundSize: '100% 100%', backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" viewBox=\\"0 0 8.766 8.213\\" overflow=\\"visible\\"><path d=\\"M 4.658 8.213 L 3.803 7.358 L 5.262 5.905 C 5.66 5.506 6.112 5.09 6.539 4.692 C 6.188 4.71 5.819 4.727 5.473 4.727 L 0 4.727 L 0 3.486 L 5.473 3.486 C 5.818 3.486 6.188 3.503 6.533 3.521 C 6.105 3.123 5.66 2.712 5.262 2.314 L 3.802 0.861 L 4.658 0 L 8.766 4.106 Z\\" fill=\\"rgb(0,0,0)\\"></path></svg>")', opacity: 1}}>
                                                    </div>
                                                    <div data-framer-component-type="SVG"
                                                        data-framer-name="arrow-default"
                                                        className="framer-1d0kro7" aria-hidden="true"
                                                        style={{imageRendering: 'pixelated', flexShrink: 0, backgroundSize: '100% 100%', backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" viewBox=\\"0 0 8.766 8.213\\" overflow=\\"visible\\"><path d=\\"M 4.658 8.213 L 3.803 7.358 L 5.262 5.905 C 5.66 5.506 6.112 5.09 6.539 4.692 C 6.188 4.71 5.819 4.727 5.473 4.727 L 0 4.727 L 0 3.486 L 5.473 3.486 C 5.818 3.486 6.188 3.503 6.533 3.521 C 6.105 3.123 5.66 2.712 5.262 2.314 L 3.802 0.861 L 4.658 0 L 8.766 4.106 Z\\" fill=\\"rgb(0,0,0)\\"></path></svg>")', opacity: 1}}>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    <input type="text" name="website" tabIndex={-1} autoComplete="one-time-code"
                                        aria-hidden="true" data-1p-ignore="true" data-lpignore="true"
                                        data-form-type="other" data-bwignore="true" defaultValue=""
                                        style={{position: 'absolute', transform: 'scale(0)'}} />
                                    <input type="text" name="company" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true"
                                        data-1p-ignore="true" data-lpignore="true" data-form-type="other"
                                        data-bwignore="true" defaultValue=""
                                        style={{position: 'absolute', transform: 'scale(0)'}} />
                                    <input type="text" name="message" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true"
                                        data-1p-ignore="true" data-lpignore="true" data-form-type="other"
                                        data-bwignore="true" defaultValue=""
                                        style={{position: 'absolute', transform: 'scale(0)'}} />
                                    <input type="text" name="subject" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true"
                                        data-1p-ignore="true" data-lpignore="true" data-form-type="other"
                                        data-bwignore="true" defaultValue=""
                                        style={{position: 'absolute', transform: 'scale(0)'}} />
                                    <input type="text" name="title" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true"
                                        data-1p-ignore="true" data-lpignore="true" data-form-type="other"
                                        data-bwignore="true" defaultValue=""
                                        style={{position: 'absolute', transform: 'scale(0)'}} />
                                    <input type="text" name="description" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true"
                                        data-1p-ignore="true" data-lpignore="true" data-form-type="other"
                                        data-bwignore="true" defaultValue=""
                                        style={{position: 'absolute', transform: 'scale(0)'}} />
                                    <input type="text" name="feedback" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true"
                                        data-1p-ignore="true" data-lpignore="true" data-form-type="other"
                                        data-bwignore="true" defaultValue=""
                                        style={{position: 'absolute', transform: 'scale(0)'}} />
                                    <input type="text" name="notes" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true"
                                        data-1p-ignore="true" data-lpignore="true" data-form-type="other"
                                        data-bwignore="true" defaultValue=""
                                        style={{position: 'absolute', transform: 'scale(0)'}} />
                                    <input type="text" name="details" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true"
                                        data-1p-ignore="true" data-lpignore="true" data-form-type="other"
                                        data-bwignore="true" defaultValue=""
                                        style={{position: 'absolute', transform: 'scale(0)'}} />
                                    <input type="text" name="remarks" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true"
                                        data-1p-ignore="true" data-lpignore="true" data-form-type="other"
                                        data-bwignore="true" defaultValue=""
                                        style={{position: 'absolute', transform: 'scale(0)'}} />
                                    <input type="text" name="comments" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true"
                                        data-1p-ignore="true" data-lpignore="true" data-form-type="other"
                                        data-bwignore="true" defaultValue="" style={{position: 'absolute', transform: 'scale(0)'}} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="framer-1dyjzz9-container hidden-120xsh4" data-code-component-plugin-id="84d4c1"></div>
        </div>
        <div id="overlay"></div>
    </div>
  )
}

export default page