import React from 'react'
import Navbar from '../../../components/navbar'

// Shared style constants
const FORM_STYLES = {
  container: {
    '--border-bottom-width': '1px',
    '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
    '--border-left-width': '1px',
    '--border-right-width': '1px',
    '--border-style': 'solid',
    '--border-top-width': '1px',
    backgroundColor: 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))',
    borderRadius: '12px',
    padding: '20px',
    width: '100%',
    opacity: 1
  } as React.CSSProperties,
  
  header: {
    '--extracted-gdpscs': 'var(--token-818a283b-450e-452c-a8af-6b81d42f4181, rgb(0, 0, 0))',
    '--framer-link-text-color': 'rgb(0, 153, 255)',
    '--framer-link-text-decoration': 'underline',
    transform: 'none',
    opacity: 1
  } as React.CSSProperties,
  
  heading: {
    '--framer-text-alignment': 'left',
    '--framer-text-color': 'var(--extracted-gdpscs, var(--token-818a283b-450e-452c-a8af-6b81d42f4181, rgb(0, 0, 0)))'
  } as React.CSSProperties,
  
  inputWrapper: {
    '--framer-input-background': 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))',
    '--framer-input-border-radius-bottom-left': '10px',
    '--framer-input-border-radius-bottom-right': '10px',
    '--framer-input-border-radius-top-left': '10px',
    '--framer-input-border-radius-top-right': '10px',
    '--framer-input-font-color': 'var(--token-818a283b-450e-452c-a8af-6b81d42f4181, rgb(0, 0, 0))',
    '--framer-input-icon-color': 'rgb(153, 153, 153)',
    '--framer-input-placeholder-color': 'var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad, rgb(133, 133, 133))',
    opacity: 1
  } as React.CSSProperties,
  
  button: {
    backgroundColor: 'rgb(51, 51, 51)',
    height: '100%',
    width: '100%',
    borderRadius: '10px',
    opacity: 1
  } as React.CSSProperties,
  
  buttonText: {
    '--extracted-r6o4lv': 'var(--token-eea27fed-e360-4e51-8e28-fa8a2ed2144a, rgb(250, 250, 250))',
    '--framer-link-text-color': 'rgb(0, 153, 255)',
    '--framer-link-text-decoration': 'underline',
    transform: 'none',
    opacity: 1
  } as React.CSSProperties,
  
  buttonTextColor: {
    '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-eea27fed-e360-4e51-8e28-fa8a2ed2144a, rgb(250, 250, 250)))'
  } as React.CSSProperties
}

// Form field configuration
interface FormField {
  name: string
  type: 'text' | 'email' | 'textarea'
  placeholder: string
  className: string
  wrapperClass: string
}

const FORM_FIELDS: FormField[] = [
  { name: 'Name', type: 'text', placeholder: 'Name', className: 'framer-1wd6ds9', wrapperClass: 'framer-sp1rqn' },
  { name: 'Email', type: 'email', placeholder: 'Email', className: 'framer-p6p7em', wrapperClass: 'framer-1m3dvi8' },
  { name: 'Message', type: 'textarea', placeholder: 'Message', className: 'framer-1eqitsj', wrapperClass: 'framer-189zpdg' }
]

// Reusable form field component
const FormField: React.FC<FormField> = ({ name, type, placeholder, className, wrapperClass }) => (
  <label className={className} style={{ opacity: 1, display: 'block', marginBottom: '12px' }}>
    <div className={`framer-form-text-input framer-form-input-wrapper ${wrapperClass}`} style={FORM_STYLES.inputWrapper}>
      {type === 'textarea' ? (
        <textarea name={name} placeholder={placeholder} className="framer-form-input" />
      ) : (
        <input type={type} required name={name} placeholder={placeholder} className="framer-form-input framer-form-input-empty" defaultValue="" />
      )}
    </div>
  </label>
)

// Contact sidebar - shows contact form
const ContactSidebar = () => {
  return (
    <main className="framer-966u9a sidebar-container" data-framer-name="Left section" data-hide-scrollbars="true">
      <div className="framer-agc1gp sidebar-content" data-framer-name="Container">
        <Navbar />
        <div className="contact-form-wrapper">
          <div className="framer-1v25llz-container">
            <form className="framer-MdLed framer-pPjcC framer-1yp7vby framer-v-1yp7vby contact-form" data-framer-name="Form" style={FORM_STYLES.container}>
              <div className="framer-1xipqm2" style={{ opacity: 1, marginBottom: '20px' }}>
                <div className="framer-suupiv" data-framer-component-type="RichTextContainer" style={FORM_STYLES.header}>
                  <h1 className="framer-text framer-styles-preset-1pt2aqn" data-styles-preset="lYOLFlQp7" style={FORM_STYLES.heading}>
                    Contact me
                  </h1>
                </div>
              </div>
              
              {FORM_FIELDS.map((field) => (
                <FormField key={field.name} {...field} />
              ))}
              
              <div className="framer-23gscw-container" style={{ opacity: 1 }}>
                <button type="submit" className="framer-4f0W8 framer-3Wby5 framer-8wkpof framer-v-8wkpof" data-framer-name="Default" data-reset="button" tabIndex={0} style={FORM_STYLES.button}>
                  <div className="framer-1knjbh0" data-framer-component-type="RichTextContainer" style={FORM_STYLES.buttonText}>
                    <p className="framer-text framer-styles-preset-1y43b4w" data-styles-preset="SbUeepJXi" style={FORM_STYLES.buttonTextColor}>
                      Send Inquiry
                    </p>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ContactSidebar