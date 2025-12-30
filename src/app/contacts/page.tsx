import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

// TypeScript declaration for CSS custom properties
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

export default function ContactsPage() {
  return (
    <>
      <div id="main"
        data-framer-hydrate-v2='{"routeId":"fZ1F6lARf","localeId":"default","breakpoints":[{"hash":"psciyp","mediaQuery":"(min-width: 1920px)"},{"hash":"r5jr8i","mediaQuery":"(min-width: 1200px) and (max-width: 1919.98px)"},{"hash":"uo4cln","mediaQuery":"(min-width: 810px) and (max-width: 1199.98px)"},{"hash":"yzu0cc","mediaQuery":"(max-width: 809.98px)"}]}'
        data-framer-ssr-released-at="2025-12-17T18:12:03.442Z" 
        data-framer-page-optimized-at="2025-12-20T02:02:56.359Z"
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
      
      {/* Scripts converted to React-compatible format */}
      <script dangerouslySetInnerHTML={{
        __html: `(() => { function u() { function n(t, e, i) { let r = document.createElement("a"); r.href = t, r.target = i, r.rel = e, document.body.appendChild(r), r.click(), r.remove() } function o(t) { if (this.dataset.hydrated) { this.removeEventListener("click", o); return } t.preventDefault(), t.stopPropagation(); let e = this.getAttribute("href"); if (!e) return; if (/Mac|iPod|iPhone|iPad/u.test(navigator.userAgent) ? t.metaKey : t.ctrlKey) return n(e, "", "_blank"); let r = this.getAttribute("rel") ?? "", c = this.getAttribute("target") ?? ""; n(e, r, c) } function a(t) { if (this.dataset.hydrated) { this.removeEventListener("auxclick", o); return } t.preventDefault(), t.stopPropagation(); let e = this.getAttribute("href"); e && n(e, "", "_blank") } function s(t) { if (this.dataset.hydrated) { this.removeEventListener("keydown", s); return } if (t.key !== "Enter") return; t.preventDefault(), t.stopPropagation(); let e = this.getAttribute("href"); if (!e) return; let i = this.getAttribute("rel") ?? "", r = this.getAttribute("target") ?? ""; n(e, i, r) } document.querySelectorAll("[data-nested-link]").forEach(t => { t instanceof HTMLElement && (t.addEventListener("click", o), t.addEventListener("auxclick", a), t.addEventListener("keydown", s)) }) } return u })()()`
      }} />
      
      <script dangerouslySetInnerHTML={{
        __html: `(() => { function i() { for (let e of document.querySelectorAll("[data-framer-original-sizes]")) { let t = e.getAttribute("data-framer-original-sizes"); t === "" ? e.removeAttribute("sizes") : e.setAttribute("sizes", t), e.removeAttribute("data-framer-original-sizes") } } function a() { window.__framer_onRewriteBreakpoints = i } return a })()()`
      }} />
      
      <script data-preserve-internal-params="" dangerouslySetInnerHTML={{
        __html: `!function () {
            var l = "framer_variant"; function u(a, r) { let n = r.indexOf("#"), e = n === -1 ? r : r.substring(0, n), o = n === -1 ? "" : r.substring(n), t = e.indexOf("?"), m = t === -1 ? e : e.substring(0, t), d = t === -1 ? "" : e.substring(t), s = new URLSearchParams(d), h = new URLSearchParams(a); for (let [i, g] of h) s.has(i) || i !== l && s.append(i, g); let c = s.toString(); return c === "" ? e + o : m + "?" + c + o } var w = 'div#main a[href^="#"],div#main a[href^="/"],div#main a[href^="."]', f = "div#main a[data-framer-preserve-params]", p = document.currentScript?.hasAttribute("data-preserve-internal-params"); if (window.location.search && !navigator.webdriver && !/bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(navigator.userAgent)) { let a = document.querySelectorAll(p ? \`\${w},\${f}\` : f); for (let r of a) { let n = u(window.location.search, r.href); r.setAttribute("href", n) } }
        }()`
      }} />
      
      <script dangerouslySetInnerHTML={{
        __html: `var animator = (() => { var k = (e, t, r) => r > t ? t : r < e ? e : r; var F = () => { }; function W(e) { let t; return () => (t === void 0 && (t = e()), t) } var j = e => e; var w = e => e * 1e3, v = e => e / 1e3; function X(e, t) { return t ? e * (1e3 / t) : 0 } var Y = e => Array.isArray(e) && typeof e[0] == "number"; var q = { value: null, addProjectionMetrics: null }; var Z = { layout: 0, mainThread: 0, waapi: 0 }; var z = (e, t, r = 10) => { let o = "", s = Math.max(Math.round(t / r), 2); for (let n = 0; n < s; n++)o += Math.round(e(n / (s - 1)) * 1e4) / 1e4 + ", "; return \`linear(\${o.substring(0, o.length - 2)})\` }; function $(e) { let t = 0, r = 50, o = e.next(t); for (; !o.done && t < 2e4;)t += r, o = e.next(t); return t >= 2e4 ? 1 / 0 : t } function pe(e, t = 100, r) { let o = r({ ...e, keyframes: [0, t] }), s = Math.min($(o), 2e4); return { type: "keyframes", ease: n => o.next(s * n).value / t, duration: v(s) } } var Ee = 5; function me(e, t, r) { let o = Math.max(t - Ee, 0); return X(r - e(o), t - o) } var l = { stiffness: 100, damping: 10, mass: 1, velocity: 0, duration: 800, bounce: .3, visualDuration: .3, restSpeed: { granular: .01, default: 2 }, restDelta: { granular: .005, default: .5 }, minDuration: .01, maxDuration: 10, minDamping: .05, maxDamping: 1 }; var H = .001; function fe({ duration: e = l.duration, bounce: t = l.bounce, velocity: r = l.velocity, mass: o = l.mass }) { let s, n; F(e <= w(l.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit"); let i = 1 - t; i = k(l.minDamping, l.maxDamping, i), e = k(l.minDuration, l.maxDuration, v(e)), i < 1 ? (s = m => { let p = m * i, c = p * e, u = p - r, d = L(m, i), g = Math.exp(-c); return H - u / d * g }, n = m => { let c = m * i * e, u = c * r + r, d = Math.pow(i, 2) * Math.pow(m, 2) * e, g = Math.exp(-c), y = L(Math.pow(m, 2), i); return (-s(m) + H > 0 ? -1 : 1) * ((u - d) * g) / y }) : (s = m => { let p = Math.exp(-m * e), c = (m - r) * e + 1; return -H + p * c }, n = m => { let p = Math.exp(-m * e), c = (r - m) * (e * e); return p * c }); let f = 5 / e, a = Ce(s, n, f); if (e = w(e), isNaN(a)) return { stiffness: l.stiffness, damping: l.damping, duration: e }; { let m = Math.pow(a, 2) * o; return { stiffness: m, damping: i * 2 * Math.sqrt(o * m), duration: e } } } var Pe = 12; function Ce(e, t, r) { let o = r; for (let s = 1; s < Pe; s++)o = o - e(o) / t(o); return o } function L(e, t) { return e * Math.sqrt(1 - t * t) } var Ie = ["duration", "bounce"], Ke = ["stiffness", "damping", "mass"]; function ce(e, t) { return t.some(r => e[r] !== void 0) } function Be(e) { let t = { velocity: l.velocity, stiffness: l.stiffness, damping: l.damping, mass: l.mass, isResolvedFromDuration: !1, ...e }; if (!ce(e, Ke) && ce(e, Ie)) if (e.visualDuration) { let r = e.visualDuration, o = 2 * Math.PI / (r * 1.2), s = o * o, n = 2 * k(.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(s); t = { ...t, mass: l.mass, stiffness: s, damping: n } } else { let r = fe(e); t = { ...t, ...r, mass: l.mass }, t.isResolvedFromDuration = !0 } return t } function D(e = l.visualDuration, t = l.bounce) { let r = typeof e != "object" ? { visualDuration: e, keyframes: [0, 1], bounce: t } : e, { restSpeed: o, restDelta: s } = r, n = r.keyframes[0], i = r.keyframes[r.keyframes.length - 1], f = { done: !1, value: n }, { stiffness: a, damping: m, mass: p, duration: c, velocity: u, isResolvedFromDuration: d } = Be({ ...r, velocity: -v(r.velocity || 0) }), g = u || 0, y = m / (2 * Math.sqrt(a * p)), h = i - n, T = v(Math.sqrt(a / p)), B = Math.abs(h) < 5; o || (o = B ? l.restSpeed.granular : l.restSpeed.default), s || (s = B ? l.restDelta.granular : l.restDelta.default); let b; if (y < 1) { let x = L(T, y); b = A => { let S = Math.exp(-y * T * A); return i - S * ((g + y * T * h) / x * Math.sin(x * A) + h * Math.cos(x * A)) } } else if (y === 1) b = x => i - Math.exp(-T * x) * (h + (g + T * h) * x); else { let x = T * Math.sqrt(y * y - 1); b = A => { let S = Math.exp(-y * T * A), G = Math.min(x * A, 300); return i - S * ((g + y * T * h) * Math.sinh(G) + x * h * Math.cosh(G)) / x } } let V = { calculatedDuration: d && c || null, next: x => { let A = b(x); if (d) f.done = x >= c; else { let S = x === 0 ? g : 0; y < 1 && (S = x === 0 ? w(g) : me(b, x, A)); let G = Math.abs(S) <= o, ke = Math.abs(i - A) <= s; f.done = G && ke } return f.value = f.done ? i : A, f }, toString: () => { let x = Math.min($(V), 2e4), A = z(S => V.next(x * S).value, x, 30); return x + "ms " + A }, toTransition: () => { } }; return V } D.applyToOptions = e => { let t = pe(e, 100, D); return e.ease = t.ease, e.duration = w(t.duration), e.type = "keyframes", e }; var ue = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"], _ = new Set(ue); var le = {}; function de(e, t) { let r = W(e); return () => le[t] ?? r() } var xe = de(() => { try { document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" }) } catch { return !1 } return !0 }, "linearEasing"); var O = ([e, t, r, o]) => \`cubic-bezier(\${e}, \${t}, \${r}, \${o})\`; var Q = { linear: "linear", ease: "ease", easeIn: "ease-in", easeOut: "ease-out", easeInOut: "ease-in-out", circIn: O([0, .65, .55, 1]), circOut: O([.55, 0, 1, .45]), backIn: O([.31, .01, .66, -.59]), backOut: O([.33, 1.53, .69, .99]) }; function J(e, t) { if (e) return typeof e == "function" ? xe() ? z(e, t) : "ease-out" : Y(e) ? O(e) : Array.isArray(e) ? e.map(r => J(r, t) || Q.easeOut) : Q[e] } function R(e, t, r, { delay: o = 0, duration: s = 300, repeat: n = 0, repeatType: i = "loop", ease: f = "easeOut", times: a } = {}, m = void 0) { let p = { [t]: r }; a && (p.offset = a); let c = J(f, s); Array.isArray(c) && (p.easing = c), q.value && Z.waapi++; let u = { delay: o, duration: s, easing: Array.isArray(c) ? "linear" : c, fill: "both", iterations: n + 1, direction: i === "reverse" ? "alternate" : "normal" }; m && (u.pseudoElement = m); let d = e.animate(p, u); return q.value && d.finished.finally(() => { Z.waapi-- }), d } var ge = e => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(); var ee = "framerAppearId", ye = "data-" + ge(ee); function Ae(e) { return e.props[ye] } var M = new Map, E = new Map; var P = (e, t) => { let r = _.has(t) ? "transform" : t; return \`\${e}: \${r}\` }; function te(e, t, r) { let o = P(e, t), s = M.get(o); if (!s) return null; let { animation: n, startTime: i } = s; function f() { window.MotionCancelOptimisedAnimation?.(e, t, r) } return n.onfinish = f, i === null || window.MotionHandoffIsComplete?.(e) ? (f(), null) : i } var N, C, re = new Set; function Ge() { re.forEach(e => { e.animation.play(), e.animation.startTime = e.startTime }), re.clear() } function oe(e, t, r, o, s) { if (window.MotionIsMounted) return; let n = e.dataset[ee]; if (!n) return; window.MotionHandoffAnimation = te; let i = P(n, t); C || (C = R(e, t, [r[0], r[0]], { duration: 1e4, ease: "linear" }), M.set(i, { animation: C, startTime: null }), window.MotionHandoffAnimation = te, window.MotionHasOptimisedAnimation = (a, m) => { if (!a) return !1; if (!m) return E.has(a); let p = P(a, m); return !!M.get(p) }, window.MotionHandoffMarkAsComplete = a => { E.has(a) && E.set(a, !0) }, window.MotionHandoffIsComplete = a => E.get(a) === !0, window.MotionCancelOptimisedAnimation = (a, m, p, c) => { let u = P(a, m), d = M.get(u); d && (p && c === void 0 ? p.postRender(() => { p.postRender(() => { d.animation.cancel() }) }) : d.animation.cancel(), p && c ? (re.add(d), p.render(Ge)) : (M.delete(u), M.size || (window.MotionCancelOptimisedAnimation = void 0))) }, window.MotionCheckAppearSync = (a, m, p) => { let c = Ae(a); if (!c) return; let u = window.MotionHasOptimisedAnimation?.(c, m), d = a.props.values?.[m]; if (!u || !d) return; let g = p.on("change", y => { d.get() !== y && (window.MotionCancelOptimisedAnimation?.(c, m), g()) }); return g }); let f = () => { C.cancel(); let a = R(e, t, r, o); N === void 0 && (N = performance.now()), a.startTime = N, M.set(i, { animation: a, startTime: N }), s && s(a) }; E.set(n, !1), C.ready ? C.ready.then(f).catch(j) : f() } var ne = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"], ze = { x: "translateX", y: "translateY", z: "translateZ", transformPerspective: "perspective" }, $e = { translateX: "px", translateY: "px", translateZ: "px", x: "px", y: "px", z: "px", perspective: "px", transformPerspective: "px", rotate: "deg", rotateX: "deg", rotateY: "deg" }; function he(e, t) { let r = $e[e]; return !r || typeof t == "string" && t.endsWith(r) ? t : \`\${t}\${r}\` } function ie(e) { return ne.includes(e) } var Le = (e, t) => ne.indexOf(e) - ne.indexOf(t); function Te({ transform: e, transformKeys: t }, r) { let o = {}, s = !0, n = ""; t.sort(Le); for (let i of t) { let f = e[i], a = !0; typeof f == "number" ? a = f === (i.startsWith("scale") ? 1 : 0) : a = parseFloat(f) === 0, a || (s = !1, n += \`\${ze[i] || i}(\${e[i]}) \`), r && (o[i] = e[i]) } return n = n.trim(), r ? n = r(o, n) : s && (n = "none"), n } function ae(e, t) { let r = new Set(Object.keys(e)); for (let o in t) r.add(o); return Array.from(r) } function se(e, t) { let r = t - e.length; if (r <= 0) return e; let o = new Array(r).fill(e[e.length - 1]); return e.concat(o) } function I(e) { return e * 1e3 } var Se = { duration: .001 }, K = { opacity: 1, scale: 1, translateX: 0, translateY: 0, translateZ: 0, x: 0, y: 0, z: 0, rotate: 0, rotateX: 0, rotateY: 0 }; function ve(e, t, r, o, s) { return r.delay && (r.delay = I(r.delay)), r.type === "spring" ? Ne(e, t, r, o, s) : We(e, t, r, o, s) } function Re(e, t, r) { let o = {}, s = 0, n = 0; for (let i of ae(e, t)) { let f = e[i] ?? K[i], a = t[i] ?? K[i]; if (f === void 0 || a === void 0 || i !== "transformPerspective" && f === a && f === K[i]) continue; i === "transformPerspective" && (o[i] = [f, a]); let m = Ze(f, a, r), { duration: p, keyframes: c } = m; p === void 0 || c === void 0 || (p > s && (s = p, n = c.length), o[i] = c) } return { keyframeValuesByProps: o, longestDuration: s, longestLength: n } } function Ne(e, t, r, o, s) { let n = {}, { keyframeValuesByProps: i, longestDuration: f, longestLength: a } = Re(e, t, r); if (!a) return n; let m = { ease: "linear", duration: f, delay: r.delay }, p = s ? Se : m, c = {}; for (let [d, g] of Object.entries(i)) ie(d) ? c[d] = se(g, a) : n[d] = { keyframes: se(g, a), options: d === "opacity" ? m : p }; let u = De(c, o); return u && (n.transform = { keyframes: u, options: p }), n } function Fe(e) { let { type: t, duration: r, ...o } = e; return { duration: I(r), ...o } } function We(e, t, r, o, s) { let n = Fe(r); if (!n) return; let i = {}, f = s ? Se : n, a = {}; for (let p of ae(e, t)) { let c = e[p] ?? K[p], u = t[p] ?? K[p]; c === void 0 || u === void 0 || p !== "transformPerspective" && c === u || (ie(p) ? a[p] = [c, u] : i[p] = { keyframes: [c, u], options: p === "opacity" ? n : f }) } let m = De(a, o); return m && (i.transform = { keyframes: m, options: f }), i } var je = ["duration", "bounce"], Xe = ["stiffness", "damping", "mass"]; function we(e) { return Xe.some(t => t in e) ? !1 : je.some(t => t in e) } function Ye(e, t, r) { return we(r) ? \`\${e}-\${t}-\${r.duration}-\${r.bounce}\` : \`\${e}-\${t}-\${r.damping}-\${r.stiffness}-\${r.mass}\` } function qe(e) { return we(e) ? { ...e, duration: I(e.duration) } : e } var Me = new Map, be = 10; function Ze(e, t, r) { let o = Ye(e, t, r), s = Me.get(o); if (s) return s; let n = [e, t], i = D({ ...qe(r), keyframes: n }), f = { done: !1, value: n[0] }, a = [], m = 0; for (; !f.done && m < I(10);)f = i.next(m), a.push(f.value), m += be; n = a; let p = m - be, u = { keyframes: n, duration: p, ease: "linear" }; return Me.set(o, u), u } function De(e, t) { let r = [], o = Object.values(e)[0]?.length; if (!o) return; let s = Object.keys(e); for (let n = 0; n < o; n++) { let i = {}; for (let [a, m] of Object.entries(e)) { let p = m[n]; p !== void 0 && (i[a] = he(a, p)) } let f = Te({ transform: i, transformKeys: s }, t); r.push(f) } return r } function Ue(e, t) { if (!t) for (let r in e) { let o = e[r]; return o?.legacy === !0 ? o : void 0 } } function Oe(e, t, r, o, s, n) { for (let [i, f] of Object.entries(e)) { let a = n ? f[n] : void 0; if (a === null || !a && f.default === null) continue; let m = a ?? f.default ?? Ue(f, n); if (!m) continue; let { initial: p, animate: c, transformTemplate: u } = m; if (!p || !c) continue; let { transition: d, ...g } = c, y = ve(p, g, d, He(u, o), s); if (!y) continue; let h = {}, T = {}; for (let [b, V] of Object.entries(y)) h[b] = V.keyframes, T[b] = V.options; let B = n ? \`:not(.hidden-\${n}) \` : ""; t(\`\${B}[\${r}="\${i}"]\`, h, T) } } function He(e, t) { if (!(!e || !t)) return (r, o) => e.replace(t, o) } function Ve(e) { return e ? e.find(r => r.mediaQuery ? window.matchMedia(r.mediaQuery).matches === !0 : !1)?.hash : void 0 } var Lr = { animateAppearEffects: Oe, getActiveVariantHash: Ve, spring: D, startOptimizedAppearAnimation: oe }; return Lr })()`
      }} />
    </>
  )
}