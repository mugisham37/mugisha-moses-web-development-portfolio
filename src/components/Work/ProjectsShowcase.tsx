import React from 'react'
import { CSSProperties } from 'react'

const ProjectsShowcase = () => {
  const projects = [
    {
      id: 'zellerfeld',
      name: 'Zellerfeld',
      description: 'Identity System, Website Design',
      media: {
        type: 'gif',
        src: 'https://framerusercontent.com/images/HzAzxkH4eLPKnMGRGvXgoTheMls.gif?width=1920&height=1280',
        aspectRatio: '1920 / 1280'
      }
    },
    {
      id: 'landsight',
      name: 'Landsight',
      description: 'Visual Identity, Website Design',
      media: {
        type: 'image',
        src: 'https://framerusercontent.com/images/BckpD4YbhZzRj02ZBsSMJ0H21w.jpg?width=1440&height=960',
        aspectRatio: '1440 / 960'
      }
    },
    {
      id: 'opus',
      name: 'Opus',
      description: 'Art Direction, Website Design',
      media: {
        type: 'video',
        src: 'https://framerusercontent.com/assets/ysqndmq8l2pf2UOITUfSfc.mp4',
        aspectRatio: '1920 / 1280'
      }
    },
    {
      id: 'oglobo',
      name: 'O Globo',
      description: 'Identity System',
      media: {
        type: 'video',
        src: 'https://framerusercontent.com/assets/MIWHSQoRBoqNgaecfmWPd7ApKeI.mp4',
        aspectRatio: '2116 / 1440'
      }
    },
    {
      id: 'missionzero',
      name: 'MissionZero',
      description: 'Art Direction, Visual Identity and Digital',
      media: {
        type: 'video',
        src: 'https://framerusercontent.com/assets/F8AfNRmAcOz9HnOgrBjm3LciY.mp4',
        aspectRatio: '1560 / 1040'
      }
    },
    {
      id: 'avenue',
      name: 'Avenue',
      description: 'Art Direction, Visual Identity',
      media: {
        type: 'image',
        src: 'https://framerusercontent.com/images/C7jjX8MN4fI624oAyIKryXwoBy0.jpg?width=1440&height=960',
        aspectRatio: '1440 / 960'
      }
    },
    {
      id: 'metragem',
      name: 'Metragem',
      description: 'Visual Identity',
      media: {
        type: 'image',
        src: 'https://framerusercontent.com/images/WEWx4cwXJP2uANPlrfIWO38TME.jpg?width=1560&height=1040',
        aspectRatio: '1560 / 1040'
      }
    },
    {
      id: 'lerian',
      name: 'Lerian',
      description: 'Identity System',
      media: {
        type: 'video',
        src: 'https://framerusercontent.com/assets/uvwyqIIBIj0XLgXS78x0oJrfU.mp4',
        aspectRatio: '1920 / 1280'
      }
    },
    {
      id: 'def',
      name: 'DEF',
      description: 'Art Direction, Website Design',
      media: {
        type: 'video',
        src: 'https://framerusercontent.com/assets/7aM0HvMdtt88uwxjJiCAgyKCE.mp4',
        aspectRatio: '1920 / 1280'
      }
    },
    {
      id: 'certisign',
      name: 'Certisign',
      description: 'Art Direction, Visual Identity',
      media: {
        type: 'image',
        src: 'https://framerusercontent.com/images/ltihpzq55Iy28lDv8DTdXPjqyrk.jpg?width=1920&height=1280',
        aspectRatio: '1920 / 1280'
      }
    }
  ]

  return (
    <div className="framer-hyxyn2" data-framer-name="s3" id="s3">
      {projects.map((project) => (
        <div key={project.id} className={`framer-t3xmok`} data-framer-name={`project-[${project.id}]`}>
          <div className="framer-1a29lv4" data-framer-name="container-project">
            <div className="framer-1ab3nea-container" data-code-component-plugin-id="84d4c1" data-framer-cursor="zxmnps">
              <div 
                data-scope={`jar-gal-${project.id}`}
                style={{
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: project.media.aspectRatio
                }}
              >
                <style>
                  {`
                    [data-scope="jar-gal-${project.id}"] {
                      --clip: 0%
                    }
                    [data-scope="jar-gal-${project.id}"] .media {
                      clip-path: inset(var(--clip) var(--clip) var(--clip) var(--clip));
                      transition: opacity 600ms cubic-bezier(0.25, 0.1, 0.25, 1), clip-path 600ms cubic-bezier(0.25, 0.1, 0.25, 1);
                      will-change: opacity, clip-path;
                    }
                    [data-scope="jar-gal-${project.id}"]:hover {
                      --clip: 0.7%
                    }
                  `}
                </style>
                
                {project.media.type === 'image' || project.media.type === 'gif' ? (
                  <img 
                    className="media" 
                    alt={project.name}
                    src={project.media.src}
                    style={{
                      position: 'absolute',
                      inset: '0px',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 1,
                      pointerEvents: 'none',
                      userSelect: 'none'
                    }}
                  />
                ) : (
                  <video
                    className="media"
                    loop
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback"
                    src={project.media.src}
                    style={{
                      position: 'absolute',
                      inset: '0px',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 1,
                      pointerEvents: 'none',
                      userSelect: 'none'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="framer-1kg5onx" data-framer-name="information">
            <div className="framer-1q1n4q2" data-framer-name="4-col" style={{ opacity: 1, transform: 'none' }}>
              <div className="framer-kpeajo" data-framer-component-type="RichTextContainer" style={{ transform: 'none' }}>
                <p className="framer-text" style={{
                  '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif',
                  '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)',
                  '--framer-font-weight': '600',
                  '--framer-letter-spacing': '-0.01em',
                  '--framer-line-height': '1.3em',
                  '--framer-text-color': 'var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255))'
                } as CSSProperties}>
                  {project.name}
                </p>
              </div>
            </div>
            
            <div className="framer-epvq2j" data-framer-name="1-col" style={{ opacity: 1, transform: 'none' }}>
              <div className="framer-ypqqna" data-framer-component-type="RichTextContainer" style={{ transform: 'none' }}>
                <p className="framer-text" style={{
                  '--framer-font-family': '"Inter Display", "Inter Display Placeholder", sans-serif',
                  '--framer-font-size': 'calc(var(--framer-root-font-size, 1rem) * 1)',
                  '--framer-font-weight': '600',
                  '--framer-letter-spacing': '-0.01em',
                  '--framer-line-height': '1.3em',
                  '--framer-text-color': 'var(--token-ca6856c1-9c1c-4bdc-8dc5-6eb703253edf, rgb(128, 128, 128))'
                } as CSSProperties}>
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProjectsShowcase