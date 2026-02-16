import React from 'react';

// Types
interface SocialLink {
  name: string;
  url: string;
  iconUrl: string;
}

// Constants
const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    iconUrl: 'https://framerusercontent.com/images/tj1rxqGKe07QDYz1u1ETp3rMYwM.png',
  },
  {
    name: 'Instagram',
    url: 'https://Instagram.com',
    iconUrl: 'https://framerusercontent.com/images/VfdvoTY1jM0YlQfclYA0uRah8MQ.png',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    iconUrl: 'https://framerusercontent.com/images/l9YivlZa7CHZzJuXomTN8AYx5kY.png',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    iconUrl: 'https://framerusercontent.com/images/TM6luwhgV84nkKy72IPGKMLFQ.png',
  },
];

const STYLES = {
  contactCard: {
    '--border-bottom-width': '1px',
    '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
    '--border-left-width': '1px',
    '--border-right-width': '1px',
    '--border-style': 'solid',
    '--border-top-width': '1px',
    backgroundColor: 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))',
    borderRadius: '12px',
    opacity: 1,
  } as React.CSSProperties,
  
  socialCard: {
    '--border-bottom-width': '1px',
    '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
    '--border-left-width': '1px',
    '--border-right-width': '1px',
    '--border-style': 'solid',
    '--border-top-width': '1px',
    backgroundColor: 'var(--token-88b568e1-e6f8-4980-bc8c-36e51a98442d, rgb(255, 255, 255))',
    borderRadius: '11.5px',
    opacity: 1,
  } as React.CSSProperties,
  
  textSecondary: {
    '--extracted-r6o4lv': 'var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122))',
    transform: 'none',
    opacity: 1,
  } as React.CSSProperties,
};

// Sub-components
const SocialLinkItem: React.FC<SocialLink> = ({ name, url, iconUrl }) => (
  <div className="framer-1xdyvll-container" style={{ opacity: 1 }}>
    <a
      className="framer-hjnqN framer-12r1jn2 framer-v-12r1jn2 framer-1yuywft"
      data-framer-name="Variant 1"
      href={url}
      target="_blank"
      rel="noopener"
      style={{ height: '100%', borderRadius: '14px', opacity: 1 }}
      aria-label={name}
    >
      <div className="framer-1pru9e6" style={{ opacity: 1 }}>
        <div className="framer-9wbe8q" data-border="true" data-framer-name="Card/Project" style={STYLES.socialCard}>
          <div className="framer-zxr3e-container" style={{ opacity: 0.8 }}>
            <div className="framer-dNIfb framer-1n00dmi framer-v-7qsfcq" data-framer-name="2XS - 16x16" style={{ opacity: 1 }}>
              <div data-framer-background-image-wrapper="true" style={{ position: 'absolute', borderRadius: 'inherit', inset: '0px' }}>
                <img
                  decoding="auto"
                  width="512"
                  height="512"
                  sizes="100vw"
                  src={iconUrl}
                  alt={`${name} icon`}
                  style={{ display: 'block', width: '100%', height: '100%', borderRadius: 'inherit', objectPosition: 'center center', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
);

const Footer: React.FC = () => {
  return (
    <div className="ssr-variant hidden-hfs46s hidden-10mb1y6">
      <div className="framer-1uflfkc-container">
        <footer
          className="framer-ikq6M framer-M4SXU framer-E4PKR framer-3Wby5 framer-x3qah6 framer-v-1wtjzwr"
          data-framer-name="Footer Small"
          style={{ width: '100%', opacity: 1 }}
        >
          {/* Contact Section */}
          <div className="framer-1lu5t8w" data-border="true" data-framer-name="Contact" style={STYLES.contactCard}>
            <div className="framer-5hxk0b" data-framer-name="Text" style={{ opacity: 1 }}>
              <div className="framer-1ykoo4l" data-framer-name="Title" data-framer-component-type="RichTextContainer" style={{ transform: 'none', opacity: 1 }}>
                <p className="framer-text framer-styles-preset-13sghr" data-styles-preset="oFmnpzi_h">
                  Let&apos;s talk!
                </p>
              </div>
              <div className="framer-ld0tu4" data-framer-name="Description" data-framer-component-type="RichTextContainer" style={STYLES.textSecondary}>
                <p
                  className="framer-text framer-styles-preset-13sghr"
                  data-styles-preset="oFmnpzi_h"
                  style={{ '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122)))' } as React.CSSProperties}
                >
                  <a
                    className="framer-text framer-styles-preset-1wicq5s"
                    data-styles-preset="ro7OPezbn"
                    href="mailto:hello@aldairgallardo.com"
                    target="_blank"
                    rel="noopener"
                  >
                    hello@aldairgallardo.com
                  </a>
                </p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="framer-1t177bx" data-framer-name="Social Media Column" style={{ opacity: 1 }}>
              {SOCIAL_LINKS.map((link) => (
                <SocialLinkItem key={link.name} {...link} />
              ))}
            </div>
          </div>

          {/* Copyright Section */}
          <div className="framer-blpivt" data-framer-name="Container" style={{ opacity: 1 }}>
            <div className="framer-j3gzi9" data-framer-name="© 2023 Balance" data-framer-component-type="RichTextContainer" style={STYLES.textSecondary}>
              <p
                className="framer-text framer-styles-preset-13sghr"
                data-styles-preset="oFmnpzi_h"
                style={{ '--framer-text-alignment': 'left', '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122)))' } as React.CSSProperties}
              >
                © 2025 | Constructed by Temlis
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
