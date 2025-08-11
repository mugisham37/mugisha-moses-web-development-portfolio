# Brutalist Developer Portfolio

An elite Next.js 14 developer portfolio that combines brutalist design aesthetics with cutting-edge full-stack functionality. Built with TypeScript, Tailwind CSS, and modern web technologies.

## 🎯 Features

- **Brutalist Design System**: Industrial aesthetics with raw concrete-inspired UI
- **Next.js 14**: Latest App Router with Server Components and Server Actions
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Custom brutalist design system with utility classes
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Authentication**: NextAuth.js v5 with secure session management
- **GitHub Integration**: Real-time repository data and contribution graphs
- **Email System**: Transactional emails with Resend
- **File Uploads**: Media management with UploadThing
- **Analytics**: Performance monitoring with Vercel Analytics
- **Testing**: Jest and React Testing Library setup
- **Code Quality**: ESLint, Prettier, and TypeScript strict mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or Neon)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brutalist-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Random secret for NextAuth.js
   - `GITHUB_TOKEN`: GitHub personal access token (optional)
   - Other service API keys as needed

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
├── lib/                   # Utility functions and configurations
│   ├── constants.ts       # Application constants
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   └── db.ts             # Database connection
└── styles/               # Global styles and Tailwind config

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seeding script
```

## 🎨 Design System

The brutalist design system is built around these core principles:

### Colors
- **Primary**: Black (#000000) and White (#FFFFFF)
- **Accent**: Electric Yellow (#FFFF00)
- **Supporting**: Charcoal grays and off-whites

### Typography
- **Headings**: Space Mono (monospace, uppercase, bold)
- **Body**: Inter (sans-serif, optimized for readability)

### Components
- **Borders**: 4px solid borders throughout
- **Shadows**: Sharp, offset shadows (no blur)
- **Animations**: Mechanical, weighty transitions
- **Layout**: Asymmetrical grids with deliberate imbalance

## 🛠 Development Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run type-check      # Run TypeScript compiler
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database with sample data
npm run db:reset        # Reset database

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Utilities
npm run clean           # Clean build artifacts
```

## 🗄 Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Authentication and user management
- **Project**: Portfolio projects with categories and analytics
- **BlogPost**: Content management with SEO optimization
- **GitHubRepository**: GitHub integration data
- **Testimonial**: Client testimonials and social proof
- **ContactSubmission**: Contact form submissions
- **Analytics**: Page views and user behavior tracking

## 🔧 Configuration

### Tailwind CSS
Custom brutalist design system configured in `tailwind.config.ts` with:
- Custom color palette
- Typography scale
- Animation keyframes
- Box shadow utilities
- Responsive breakpoints

### Environment Variables
Required environment variables are documented in `.env.example`. Key configurations:
- Database connection
- Authentication secrets
- Third-party API keys
- Application URLs

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy to your hosting platform

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API routes and database operations
- **E2E Tests**: Playwright (configuration ready)
- **Coverage**: 70% threshold for all metrics

Run tests with:
```bash
npm run test
npm run test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Vercel](https://vercel.com/) - Deployment and hosting platform

---

Built with ❤️ and industrial-strength concrete aesthetics.
