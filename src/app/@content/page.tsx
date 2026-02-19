import React from 'react'
import ContentWrapper from '../../components/content-wrapper'

// Home content - shows hero image
const HomeContent = () => {
  return (
    <ContentWrapper>
      <div data-framer-root="" className="framer-dWn3f framer-72rtr7"
        style={{ minHeight: "100vh", width: "auto", display: "contents" }}>
        <div className="framer-1lw7frw-container" style={{
          order: 1,
          flex: "none",
          width: "100%",
          position: "relative",
          marginBottom: "20px"
        } as React.CSSProperties}>
          <div className="framer-vm656 framer-ot9dfq framer-v-z0mcsa" data-framer-name="Phone"
            style={{ width: "100%", opacity: 1 }}>
            <div className="framer-1jf8nol-container" data-framer-name="Image Reel"
              style={{ opacity: 1 }}>
              <div className="framer-6mNN4 framer-rdxack framer-v-1vqm357"
                data-border="true" data-framer-name="Variant 3" data-highlight="true"
                style={{
                  borderBottomWidth: "1px",
                  borderColor: "var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))",
                  borderLeftWidth: "1px",
                  borderRightWidth: "1px",
                  borderStyle: "solid",
                  borderTopWidth: "1px",
                  height: "100%",
                  width: "100%",
                  borderRadius: "12px",
                  opacity: 1
                } as React.CSSProperties}>
                <div data-framer-background-image-wrapper="true"
                  style={{ position: "absolute", borderRadius: "inherit", inset: "0px" }}>
                  <img
                    decoding="auto"
                    width="3000"
                    height="2250"
                    sizes="max(100vw - 24px, 1px)"
                    srcSet="https://framerusercontent.com/images/QGV2cD8cSjC0XmEcXpVU2RZo.png?scale-down-to=512 512w,https://framerusercontent.com/images/QGV2cD8cSjC0XmEcXpVU2RZo.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/QGV2cD8cSjC0XmEcXpVU2RZo.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/QGV2cD8cSjC0XmEcXpVU2RZo.png 3000w"
                    src="https://framerusercontent.com/images/QGV2cD8cSjC0XmEcXpVU2RZo.png?scale-down-to=2048"
                    alt=""
                    style={{ display: "block", width: "100%", height: "100%", borderRadius: "inherit", objectPosition: "center center", objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  )
}

export default HomeContent
