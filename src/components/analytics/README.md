# Analytics System Documentation

## Overview

The Analytics System provides comprehensive tracking, performance monitoring, and A/B testing capabilities for the Brutalist Developer Portfolio. It's designed to be privacy-compliant, performant, and easy to use.

## Features

### ✅ Core Analytics

- **Page View Tracking**: Automatic page view tracking with session management
- **Custom Event Tracking**: Track user interactions and custom events
- **Conversion Tracking**: Monitor conversion funnels and attribution
- **Session Management**: Track user sessions with device and location data

### ✅ Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS, FCP, TTFB tracking
- **Real-time Performance**: Monitor page load times and user experience
- **Connection Awareness**: Track performance across different connection types
- **Page-specific Metrics**: Performance breakdown by page

### ✅ A/B Testing Framework

- **Experiment Management**: Create and manage A/B tests
- **Statistical Significance**: Automatic significance calculation
- **Variant Assignment**: Consistent user assignment to test variants
- **Conversion Tracking**: Track test performance and winners

### ✅ Privacy Compliance

- **GDPR Compliant**: User consent management
- **Cookie Preferences**: Granular consent controls
- **Data Minimization**: Only collect necessary data
- **User Rights**: Respect user privacy preferences

### ✅ Admin Dashboard

- **Real-time Analytics**: Live dashboard with key metrics
- **Visual Charts**: Interactive charts and graphs
- **Performance Insights**: Core Web Vitals monitoring
- **A/B Test Results**: Test performance and statistical analysis

## Quick Start

### 1. Basic Setup

The analytics system is automatically initialized in the root layout:

```tsx
// src/app/layout.tsx
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
```

### 2. Track Page Views

Page views are automatically tracked, but you can also track them manually:

```tsx
import { usePageView } from "@/hooks/use-analytics";

function MyPage() {
  usePageView("/my-page", { section: "portfolio" });
  return <div>My Page Content</div>;
}
```

### 3. Track Custom Events

```tsx
import { useAnalytics } from "@/hooks/use-analytics";

function MyComponent() {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent("button_click", {
      button: "cta",
      location: "hero",
      value: 100,
    });
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### 4. Track Conversions

```tsx
import { useAnalytics } from "@/hooks/use-analytics";

function ContactForm() {
  const { trackContactFormSubmission } = useAnalytics();

  const handleSubmit = (data) => {
    // Submit form...
    trackContactFormSubmission("contact", {
      source: "header",
      formType: "contact",
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 5. A/B Testing

```tsx
import { useABTest } from "@/components/analytics/ab-test-provider";

function MyComponent() {
  const { getVariant, trackConversion } = useABTest();

  const variant = getVariant("button_color_test");
  const buttonColor = variant === "variant" ? "red" : "blue";

  const handleClick = () => {
    trackConversion("button_color_test");
  };

  return (
    <button className={`bg-${buttonColor}-500`} onClick={handleClick}>
      Click Me
    </button>
  );
}
```

### 6. Conversion Funnel Tracking

```tsx
import { ConversionTracker } from "@/components/analytics/conversion-tracker";

function PricingPage() {
  return (
    <ConversionTracker step="pricing_view" metadata={{ plan: "pro" }}>
      <div>Pricing content...</div>
    </ConversionTracker>
  );
}
```

## API Reference

### useAnalytics Hook

```tsx
const {
  trackEvent,
  trackPageView,
  trackBlogView,
  trackBlogShare,
  trackProjectView,
  trackProjectLike,
  trackContactFormSubmission,
  trackNewsletterSignup,
  trackConsultationBooking,
  trackConversion,
} = useAnalytics();
```

### useABTest Hook

```tsx
const { getVariant, trackConversion } = useABTest();
```

### Analytics Provider Context

```tsx
const {
  sessionId,
  hasConsent,
  consentTypes,
  updateConsent,
  trackEvent,
  trackPageView,
  trackConversion,
} = useAnalytics();
```

## Database Schema

The analytics system uses the following database models:

- **PageView**: Individual page views with session data
- **UserSession**: User sessions with device and location info
- **ConversionEvent**: Conversion tracking with attribution
- **PerformanceMetric**: Core Web Vitals and performance data
- **ABTestExperiment**: A/B test configurations
- **ABTestAssignment**: User assignments to test variants
- **UserConsent**: Privacy consent preferences

## Admin Dashboard

Access the analytics dashboard at `/admin/analytics` (admin role required).

### Features:

- **Overview Metrics**: Total views, unique visitors, conversion rates
- **Top Pages**: Most visited pages with engagement metrics
- **Device Breakdown**: Desktop, mobile, tablet usage
- **Core Web Vitals**: Performance monitoring
- **A/B Test Results**: Test performance and statistical significance
- **Traffic Sources**: Referrer analysis
- **Geographic Data**: Visitor location breakdown

## Privacy & Compliance

### GDPR Compliance

- User consent is required for analytics and marketing cookies
- Necessary cookies (session management) are always allowed
- Users can customize their preferences
- Consent is stored with timestamp and version

### Data Minimization

- Only essential data is collected
- Personal data is anonymized where possible
- Data retention policies are enforced
- Users can request data deletion

### Cookie Categories

- **Necessary**: Session management, security
- **Analytics**: Usage statistics, performance monitoring
- **Marketing**: A/B testing, conversion tracking
- **Functional**: User preferences, enhanced features

## Performance Considerations

### Optimizations

- Lazy loading of analytics components
- Debounced event tracking
- Efficient database queries with proper indexing
- Client-side caching of consent preferences

### Core Web Vitals

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- FCP (First Contentful Paint): < 1.8s
- TTFB (Time to First Byte): < 600ms

## Testing

Run analytics tests:

```bash
npm test -- src/lib/__tests__/analytics-utils.test.ts
```

## Configuration

### Environment Variables

```env
# Vercel Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"

# Database
DATABASE_URL="your-database-url"
```

### Admin Access

Analytics dashboard requires admin role. Create an admin user:

```bash
npm run db:seed
```

## Troubleshooting

### Common Issues

1. **Consent Banner Not Showing**
   - Check if consent is already stored in localStorage
   - Clear browser storage to reset consent

2. **Events Not Tracking**
   - Verify user has given analytics consent
   - Check browser console for errors
   - Ensure API routes are accessible

3. **A/B Tests Not Working**
   - Verify experiment is active in admin dashboard
   - Check session ID generation
   - Ensure proper variant assignment

4. **Performance Metrics Missing**
   - Check browser support for Performance Observer API
   - Verify user consent for analytics
   - Check network connectivity

### Debug Mode

Enable debug logging:

```tsx
// Add to your component
useEffect(() => {
  if (process.env.NODE_ENV === "development") {
    console.log("Analytics Debug:", { sessionId, hasConsent });
  }
}, [sessionId, hasConsent]);
```

## Contributing

When adding new analytics features:

1. Update the database schema if needed
2. Add proper TypeScript types
3. Include tests for new functionality
4. Update this documentation
5. Ensure GDPR compliance
6. Test performance impact

## License

This analytics system is part of the Brutalist Developer Portfolio project.
