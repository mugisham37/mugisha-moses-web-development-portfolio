#!/usr/bin/env node

/**
 * Simple script to test authentication endpoints
 * Run with: node scripts/test-auth.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testRegistration() {
  console.log('🧪 Testing user registration...')
  
  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Registration successful:', data.message)
      return testUser
    } else {
      console.log('❌ Registration failed:', data.error)
      return null
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message)
    return null
  }
}

async function testPasswordReset(email) {
  console.log('🧪 Testing password reset request...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Password reset request successful:', data.message)
    } else {
      console.log('❌ Password reset request failed:', data.error)
    }
  } catch (error) {
    console.log('❌ Password reset error:', error.message)
  }
}

async function testRateLimit() {
  console.log('🧪 Testing rate limiting...')
  
  const requests = []
  
  // Make multiple requests quickly to test rate limiting
  for (let i = 0; i < 12; i++) {
    requests.push(
      fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Rate Test',
          email: `rate-test-${i}@example.com`,
          password: 'TestPassword123!',
        }),
      })
    )
  }

  try {
    const responses = await Promise.all(requests)
    const rateLimitedResponses = responses.filter(r => r.status === 429)
    
    if (rateLimitedResponses.length > 0) {
      console.log(`✅ Rate limiting working: ${rateLimitedResponses.length} requests blocked`)
    } else {
      console.log('⚠️  Rate limiting may not be working as expected')
    }
  } catch (error) {
    console.log('❌ Rate limit test error:', error.message)
  }
}

async function main() {
  console.log('🚀 Starting authentication system tests...\n')

  // Test registration
  const testUser = await testRegistration()
  
  if (testUser) {
    // Test password reset
    await testPasswordReset(testUser.email)
  }

  // Test rate limiting
  await testRateLimit()

  console.log('\n✨ Authentication tests completed!')
  console.log('\n📝 Manual tests to perform:')
  console.log('1. Visit /auth/signin to test sign-in form')
  console.log('2. Visit /auth/signup to test registration form')
  console.log('3. Test OAuth providers (GitHub, Google)')
  console.log('4. Visit /dashboard after signing in')
  console.log('5. Test admin routes with admin user')
  console.log('6. Test middleware protection on /admin routes')
}

main().catch(console.error)