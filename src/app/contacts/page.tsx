import { Metadata } from 'next'
import { ContactSection } from '../../components/Contacts'

export const metadata: Metadata = {
  title: 'Inquiries - JARCOS',
  description: 'JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.',
  openGraph: {
    type: 'website',
    title: 'JARCOS',
    description: 'JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.',
    images: [
      {
        url: 'https://framerusercontent.com/images/KzbPKaxMBB9pggMU52SND3kyRtE.png',
        width: 1200,
        height: 630,
        alt: 'JARCOS Design Practice'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JARCOS',
    description: 'JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.',
    images: ['https://framerusercontent.com/images/KzbPKaxMBB9pggMU52SND3kyRtE.png']
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large'
  },
  alternates: {
    canonical: 'https://jarcos.work/contact'
  }
}

const ContactsPage = () => {
  return (
    <div className="framer-1gbk15u" data-framer-name="contact">
      <ContactSection />
    </div>
  )
}

export default ContactsPage