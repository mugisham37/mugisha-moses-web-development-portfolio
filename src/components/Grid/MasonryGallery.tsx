import React from 'react'

const MasonryGallery = () => {
  return (
    <div className="framer-ibhvel" data-framer-name="s1-gallery" id="s1-gallery">
      <div className="framer-16yhm63-container">
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <style jsx>{`
            .masonry {
              column-count: 3;
              column-gap: 48px;
              flex: 1;
            }

            .item {
              opacity: 0;
              transform: translateY(8px);
              transition: opacity .5s ease, transform .5s ease, clip-path .35s ease;
            }

            .item.is-loaded {
              opacity: 1;
              transform: translateY(0);
            }

            .item {
              display: inline-block;
              width: 100%;
              margin-bottom: calc(48px * 0.8);
              overflow: hidden;
              cursor: pointer;
              position: relative;
              clip-path: inset(0);
            }

            .media {
              width: 100%;
              height: auto;
              display: block;
            }

            .gif-overlay {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              opacity: 0;
              transition: opacity .35s ease-in-out;
              pointer-events: none;
              transform: scale(1.05);
            }

            /* Only show hover effects on devices that can actually hover (not touch devices) */
            @media (hover: hover) {
              .item:hover .gif-overlay {
                opacity: 1;
              }

              .masonry:has(.item:hover) .item {
                opacity: 0.5;
              }

              .masonry:has(.item:hover) .item:hover {
                opacity: 1;
                clip-path: inset(0.75%);
              }
            }

            @media(max-width:810px) {
              .controls {
                display: none !important;
              }
            }

            input[type="range"] {
              -webkit-appearance: none;
              appearance: none;
              background: transparent;
              cursor: pointer;
              width: 80%
            }

            input[type="range"]:focus {
              outline: none
            }

            input[type="range"]::-webkit-slider-runnable-track {
              background: #808080;
              border-radius: 100px;
              height: 2px
            }

            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              margin-top: -5px;
              background: #fff;
              border-radius: 100px;
              height: 12px;
              width: 12px
            }

            .controls-panel {
              animation: controlsFadeIn 0.35s ease-in-out forwards;
            }

            @keyframes controlsFadeIn {
              from {
                opacity: 0;
                filter: blur(5px);
                transform: translateX(-50%) translateY(10px);
              }

              to {
                opacity: 1;
                filter: blur(0px);
                transform: translateX(-50%) translateY(0);
              }
            }
          `}</style>
          <div className="masonry loaded">
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/WEWx4cwXJP2uANPlrfIWO38TME.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/tlY9X2ZHqCWgiHRAoMj7UVzNSo.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/noX47TtIOnZ1XJuYRpUnaYW7d8.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/xz2iQqupuRfYMpanu5UHkNeC4.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/WObLWb7G3bZYW9POdo9aWq90ORg.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/EarrPb5JQ6VNfLlRWLTCxGYo.gif"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/uBMisTR6a9wEfVNUXnhBf2INqo.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/n40E1ohbPdQj3N3tk4TZDodr48.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/ypne4ekAbqRMBdXyNsuOszjWs.jpg"
                alt="opus-grid"
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/5xw9zKMkb6CpH0ByDRRT8CQxMk.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/Cv97h1QiNFBsaK6yZRtkFWHdtY.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/AAuqjy5oB9FwgBxlWbWloU7gnQ.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/gQKO1MfKor30hR7JJAEihnPtED0.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/cQdFcTWAaurIzwlHKbJJ5Ja4Y.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/o4yBEKz7UszCMKeutMEDTsWrML8.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/p3CLjaY9AGzIdGuNPNh89GL4.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/EZoYhQ2fXhrRUZsJ2BYjHwUoQk8.gif"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/G3jYHLdUEEInKLflG8iL688a2eQ.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/JL0isDyJFn7IAcNXiXqcSA16RVU.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/qZ09vOWqOpcvQy7mlFHSGi4l00.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/be35rhmLG0Da6lLsGLBoSdaDnDs.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/tRXqrpca1R6qTLquZiOM9OhwoVk.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/C7jjX8MN4fI624oAyIKryXwoBy0.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/vKxWAxFaIEm7Gjp5iD4ItZTxUY.gif"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/dB3r2rlb6dUBUybsREbx1ZPkzpc.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/GNghOGjrj7L6SjUkixlzIbsyEdo.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/LahaW8aFunvOLv3K4PUEsHSchA.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/nrt5gS4IO0fKS3AkynggUk4LZE.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/Vddi5lE2KnjorU5aFnIKXINus.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/Q7RkWTI81ogfcO7eX9Tri9A74.jpg"
                alt="plastico"
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/DPYCCeQIo72tLLPCjDLEdptXM.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/TEtswoLM42075DYLUlutKcE8IHM.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/huGaC0BE4AMg5zJIhLIQH2e3RFY.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/HzAzxkH4eLPKnMGRGvXgoTheMls.gif"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/PeS07zxVOK4SURpnlPMEjCfdKI.jpg"
                alt="cali"
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/zH68DTg0bHi37OtnLavSRE0MB0.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/JHPZ5SoivRshUzOwEYlpbuiXx0.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/kHMEFV8jonuDLltsIMDasVHY680.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/0IdhpLJXYBKWfyJ7OMwQrPi3iZ8.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/NFE5iFZ9Jj5Gv4RLe2N3O6LM3Eo.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/qQlc4kFTl7OdZKugckHJkv7CVAU.jpg"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item is-loaded">
              <img
                src="https://framerusercontent.com/assets/MWsxui28gSiMpm18w0LjxK27QNo.png"
                alt=""
                className="media"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MasonryGallery