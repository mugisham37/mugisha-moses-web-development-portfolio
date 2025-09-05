This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

Before deploying, make sure to set up your environment variables:

1. Copy `.env.example` to `.env.local`
2. Get your Resend API key from [https://resend.com/api-keys](https://resend.com/api-keys)
3. Replace `your_resend_api_key_here` with your actual API key

## Deploy on Vercel

This project is ready for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard:
   - `RESEND_API_KEY`: Your Resend API key
4. Deploy!

The project includes:

- ✅ Optimized build configuration
- ✅ Environment variable setup
- ✅ API routes for email functionality
- ✅ Static asset optimization

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
