// Types for work data structure
export interface WorkImage {
  src: string
  srcSet?: string
  alt: string
  width?: number
  height?: number
  sizes?: string
}

export interface WorkAbout {
  client: string
  contribution: string
  year: string
}

export interface WorkDetail {
  id: string
  title: string
  description: string
  category: 'products' | 'uiux' | '3d'
  thumbnailImage: string
  heroImage: WorkImage
  secondaryImage: WorkImage
  about: WorkAbout
  fullDescription: string
  processImage: WorkImage
  problemTitle: string
  problemDescription: string[]
  solutionTitle: string
  solutionDescription: string[]
  closingImage: WorkImage
}

// ============================================================================
// SINGLE SOURCE OF TRUTH - Work Details Data
// ============================================================================
// This is the only place where project data is defined.
// All other data structures are derived from this.

export const workDetailsData: Record<string, WorkDetail> = {
  'bookease-copy': {
    id: 'bookease-copy',
    title: 'BookEase App',
    description: 'Intuitive platform for seamless online book shopping.',
    category: 'products',
    thumbnailImage: 'https://framerusercontent.com/images/I3WJm2mv67qLCa3IapaovJh6EmU.webp',
    heroImage: {
      src: 'https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png',
      srcSet: 'https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png?scale-down-to=512 512w,https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png?scale-down-to=4096 4096w,https://framerusercontent.com/images/UZ8HPu9E0O3VGGn5CUdNDsmxUo.png 4500w',
      alt: 'BookEase App Hero',
      width: 2400,
      height: 1600,
      sizes: 'calc(100vw - 24px)'
    },
    secondaryImage: {
      src: 'https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png',
      srcSet: 'https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png?scale-down-to=512 512w,https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png?scale-down-to=4096 4096w,https://framerusercontent.com/images/BaSowD2KRqIEjDHY1cnvGdqu6JQ.png 4500w',
      alt: 'BookEase App Screenshot',
      sizes: 'calc(100vw - 24px)'
    },
    about: {
      client: 'BookStores Inc.',
      contribution: 'UX Design, Web Development',
      year: '2022'
    },
    fullDescription: 'BookEase offers a comprehensive collection of books across genres and languages, aimed at making book buying a satisfying and simple experience.',
    processImage: {
      src: 'https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png',
      srcSet: 'https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png?scale-down-to=512 512w,https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png?scale-down-to=4096 4096w,https://framerusercontent.com/images/r6PdJFY8RXPxuiUBjBtUQ29E.png 4500w',
      alt: 'BookEase Process',
      sizes: 'calc(100vw - 24px)'
    },
    problemTitle: 'The Problems to Solve',
    problemDescription: [
      'BookEase underwent a complete UX redesign, focusing on streamlined user paths and search efficiency. Advanced search algorithms were implemented to guide users to the most relevant categories, and an intelligent recommendation engine was developed.',
      'The checkout process was also streamlined through a multi-step design, reducing load time and effectively decreasing cart abandonment rates.'
    ],
    solutionTitle: 'Our Solution',
    solutionDescription: [
      'BookEase underwent a complete UX redesign, focusing on streamlined user paths and search efficiency. Advanced search algorithms were implemented to guide users to the most relevant categories, and an intelligent recommendation engine was developed.',
      'The checkout process was also streamlined through a multi-step design, reducing load time and effectively decreasing cart abandonment rates.'
    ],
    closingImage: {
      src: 'https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png',
      srcSet: 'https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png?scale-down-to=512 512w,https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png?scale-down-to=4096 4096w,https://framerusercontent.com/images/7m5fte7zY1VS3dIAuYwhuTpuo.png 4500w',
      alt: 'BookEase Final',
      width: 2400,
      height: 1600,
      sizes: 'calc(100vw - 24px)'
    }
  }
}

// ============================================================================
// DERIVED DATA - Automatically generated from workDetailsData
// ============================================================================

// Get all works as an array
export const getAllWorks = (): WorkDetail[] => {
  return Object.values(workDetailsData)
}

// Get works by category for main.tsx tabs
export const getWorksByCategory = (category: 'products' | 'uiux' | '3d'): WorkDetail[] => {
  return getAllWorks().filter(work => work.category === category)
}

// Helper functions for each category
export const getProductsData = () => getWorksByCategory('products')
export const getUIUXData = () => getWorksByCategory('uiux')
export const get3DData = () => getWorksByCategory('3d')

// Get work by slug for detail pages
export const getWorkBySlug = (slug: string): WorkDetail | undefined => {
  return workDetailsData[slug]
}

// Get all work slugs (useful for static generation)
export const getAllWorkSlugs = (): string[] => {
  return Object.keys(workDetailsData)
}

// Works listing data for works/page.tsx (simplified view)
export const worksData = getAllWorks().map(work => ({
  id: work.id,
  title: work.title,
  description: work.description,
  image: work.thumbnailImage
}))
