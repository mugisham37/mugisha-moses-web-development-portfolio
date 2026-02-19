'use client'

import { useState } from 'react'
import { getProductsData, getUIUXData, get3DData, type WorkDetail } from '../app/@content/works/data'

// Extend CSSProperties to allow CSS custom properties
declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number
    }
}

const MainUnified = () => {
    const [activeTab, setActiveTab] = useState<'products' | 'uiux' | '3d'>('products')
    
    // Get data from centralized data.ts based on active tab
    const currentData: WorkDetail[] = 
        activeTab === 'products' ? getProductsData() : 
        activeTab === 'uiux' ? getUIUXData() : 
        get3DData()

    return (
        <div className="framer-ejtc8w-container">
            <div 
                className="framer-4k1Zq framer-9gn1mz framer-v-169xjp1" 
                data-framer-name={activeTab === 'products' ? 'Products' : activeTab === 'uiux' ? 'UI/UX' : '3D Design'}
                style={{ width: "100%", opacity: "1" }}
            >
                {/* Tab Navigation */}
                <div className="framer-2cxopf" data-framer-name="Tabs" style={{ opacity: "1" }}>
                    <div 
                        className="framer-pbq50l" 
                        data-border="true" 
                        data-framer-name="menubar"
                        style={{ 
                            "--border-bottom-width": "1px", 
                            "--border-color": "var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))", 
                            "--border-left-width": "1px", 
                            "--border-right-width": "1px", 
                            "--border-style": "solid", 
                            "--border-top-width": "1px", 
                            backgroundColor: "var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 245))", 
                            borderRadius: "11.5px", 
                            opacity: "1",
                            display: "flex",
                            position: "relative",
                            padding: "6px",
                            gap: "6px"
                        }}
                    >
                        
                        {/* Products Tab */}
                        <div 
                            style={{ 
                                flex: "1",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "8px 12px",
                                borderRadius: "7.5px",
                                position: "relative",
                                zIndex: 2,
                                backgroundColor: activeTab === 'products' ? "var(--token-1fc170f9-f857-4cb9-bd35-3840f169c14f, rgb(255, 255, 255))" : "transparent",
                                boxShadow: activeTab === 'products' ? "rgba(107, 100, 100, 0.1) 0px 1px 3px 0px" : "none",
                                transition: "all 0.3s ease"
                            }}
                            onClick={() => setActiveTab('products')}
                            tabIndex={0}
                        >
                            <p 
                                className="framer-text framer-styles-preset-13sghr"
                                data-styles-preset="oFmnpzi_h"
                                style={{ 
                                    color: activeTab === 'products' 
                                        ? "var(--token-818a283b-450e-452c-a8af-6b81d42f4181, rgb(0, 0, 0))"
                                        : "var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122))",
                                    transition: 'color 0.3s ease',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    fontWeight: activeTab === 'products' ? 500 : 400,
                                    margin: 0,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Products
                            </p>
                        </div>
                        
                        {/* UI/UX Tab */}
                        <div 
                            style={{ 
                                flex: "1",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "8px 12px",
                                borderRadius: "7.5px",
                                position: "relative",
                                zIndex: 2,
                                backgroundColor: activeTab === 'uiux' ? "var(--token-1fc170f9-f857-4cb9-bd35-3840f169c14f, rgb(255, 255, 255))" : "transparent",
                                boxShadow: activeTab === 'uiux' ? "rgba(107, 100, 100, 0.1) 0px 1px 3px 0px" : "none",
                                transition: "all 0.3s ease"
                            }}
                            onClick={() => setActiveTab('uiux')}
                            tabIndex={0}
                        >
                            <p 
                                className="framer-text framer-styles-preset-13sghr"
                                data-styles-preset="oFmnpzi_h"
                                style={{ 
                                    color: activeTab === 'uiux'
                                        ? "var(--token-818a283b-450e-452c-a8af-6b81d42f4181, rgb(0, 0, 0))"
                                        : "var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122))", 
                                    transition: 'color 0.3s ease',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    fontWeight: activeTab === 'uiux' ? 500 : 400,
                                    margin: 0,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                UI/UX
                            </p>
                        </div>

                        {/* 3D Design Tab */}
                        <div 
                            style={{ 
                                flex: "1",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "8px 12px",
                                borderRadius: "7.5px",
                                position: "relative",
                                zIndex: 2,
                                backgroundColor: activeTab === '3d' ? "var(--token-1fc170f9-f857-4cb9-bd35-3840f169c14f, rgb(255, 255, 255))" : "transparent",
                                boxShadow: activeTab === '3d' ? "rgba(107, 100, 100, 0.1) 0px 1px 3px 0px" : "none",
                                transition: "all 0.3s ease"
                            }}
                            onClick={() => setActiveTab('3d')}
                            tabIndex={0}
                        >
                            <p 
                                className="framer-text framer-styles-preset-13sghr"
                                data-styles-preset="oFmnpzi_h"
                                style={{ 
                                    color: activeTab === '3d'
                                        ? "var(--token-818a283b-450e-452c-a8af-6b81d42f4181, rgb(0, 0, 0))"
                                        : "var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122))", 
                                    transition: 'color 0.3s ease',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    fontWeight: activeTab === '3d' ? 500 : 400,
                                    margin: 0,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                3D Design
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div 
                    className="framer-1dm2yy8" 
                    data-framer-name={activeTab === 'products' ? 'Products' : activeTab === 'uiux' ? 'UI/UX' : '3D Design'} 
                    style={{ opacity: "1" }}
                >
                    {currentData.map((item) => (
                        <div 
                            key={item.id} 
                            className="framer-6ck86u-container" 
                            style={{ opacity: "1" }}
                        >
                            <div 
                                className="framer-tQZEf framer-3Wby5 framer-M4SXU framer-yo8un4 framer-v-127pux1"
                                data-framer-name="Mobile" 
                                data-highlight="true" 
                                tabIndex={0}
                                style={{ width: "100%", borderRadius: "14px", opacity: "1" }}
                            >
                                <a
                                    className="framer-3jgq1s framer-irm3n9" 
                                    data-border="true"
                                    data-framer-name="Card/Project"
                                    href={`/works/${item.id}`}
                                    style={{ 
                                        "--border-bottom-width": "1px", 
                                        "--border-color": "var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))", 
                                        "--border-left-width": "1px", 
                                        "--border-right-width": "1px", 
                                        "--border-style": "solid", 
                                        "--border-top-width": "1px", 
                                        backgroundColor: "var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))", 
                                        borderRadius: "11.5px", 
                                        opacity: "1" 
                                    }}
                                >
                                    <div 
                                        className="framer-q9yaf3" 
                                        data-framer-name="Container"
                                        style={{ opacity: "1" }}
                                    >
                                        <div 
                                            className="framer-xgn92i" 
                                            data-framer-name="Photo"
                                            style={{ 
                                                borderRadius: "8px", 
                                                boxShadow: "rgba(107, 100, 100, 0.1) 0px 1px 3px 0px", 
                                                opacity: "1" 
                                            }}
                                        >
                                            <div 
                                                data-framer-background-image-wrapper="true"
                                                style={{ 
                                                    position: "absolute", 
                                                    borderRadius: "inherit", 
                                                    inset: "0px" 
                                                }}
                                            >
                                                <img 
                                                    decoding="auto" 
                                                    sizes="64px"
                                                    src={item.thumbnailImage}
                                                    alt={item.title}
                                                    style={{ 
                                                        display: "block", 
                                                        width: "100%", 
                                                        height: "100%", 
                                                        borderRadius: "inherit", 
                                                        objectPosition: "center center", 
                                                        objectFit: "fill" 
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                        <div 
                                            className="framer-1o6754" 
                                            data-framer-name="Info project"
                                            style={{ opacity: "1" }}
                                        >
                                            <div 
                                                className="framer-p2e3yj" 
                                                data-framer-name="Title"
                                                data-framer-component-type="RichTextContainer"
                                                style={{ 
                                                    "--extracted-1of0zx5": "var(--token-818a283b-450e-452c-a8af-6b81d42f4181, rgb(0, 0, 0))", 
                                                    transform: "none", 
                                                    opacity: "1" 
                                                }}
                                            >
                                                <h2 
                                                    className="framer-text framer-styles-preset-1y43b4w"
                                                    data-styles-preset="SbUeepJXi"
                                                    style={{ 
                                                        "--framer-text-color": "var(--extracted-1of0zx5, var(--token-818a283b-450e-452c-a8af-6b81d42f4181, rgb(0, 0, 0)))" 
                                                    }}
                                                >
                                                    {item.title}
                                                </h2>
                                            </div>
                                            <div 
                                                className="framer-1bu06yy"
                                                data-framer-name="Description"
                                                data-framer-component-type="RichTextContainer"
                                                style={{ 
                                                    "--extracted-r6o4lv": "var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122))", 
                                                    transform: "none", 
                                                    opacity: "1" 
                                                }}
                                            >
                                                <p 
                                                    className="framer-text framer-styles-preset-13sghr"
                                                    data-styles-preset="oFmnpzi_h"
                                                    style={{ 
                                                        "--framer-text-color": "var(--extracted-r6o4lv, var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122)))" 
                                                    }}
                                                >
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MainUnified
