/**
 * LinkedIn Integration for Testimonials
 *
 * This module provides functionality to integrate with LinkedIn API
 * to fetch recommendations and validate client connections.
 *
 * Note: This is a placeholder implementation. Full LinkedIn integration
 * requires OAuth setup and API credentials.
 */

interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  profilePicture?: string;
  publicProfileUrl: string;
}

interface LinkedInRecommendation {
  id: string;
  recommender: LinkedInProfile;
  text: string;
  createdAt: Date;
  type: "given" | "received";
}

export class LinkedInIntegration {
  private accessToken: string | null = null;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || process.env.LINKEDIN_ACCESS_TOKEN || null;
  }

  /**
   * Fetch LinkedIn recommendations
   * @param profileId LinkedIn profile ID
   * @returns Array of recommendations
   */
  async getRecommendations(
    profileId: string
  ): Promise<LinkedInRecommendation[]> {
    if (!this.accessToken) {
      console.warn("LinkedIn access token not configured");
      return this.getMockRecommendations();
    }

    try {
      // TODO: Implement actual LinkedIn API call
      // const response = await fetch(`https://api.linkedin.com/v2/recommendations?q=recipient&recipient=${profileId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.accessToken}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      // For now, return mock data
      console.log(`Fetching recommendations for profile: ${profileId}`);
      return this.getMockRecommendations();
    } catch (error) {
      console.error("Error fetching LinkedIn recommendations:", error);
      return [];
    }
  }

  /**
   * Verify if a client is connected on LinkedIn
   * @param clientEmail Client's email address
   * @returns Boolean indicating connection status
   */
  async verifyClientConnection(clientEmail: string): Promise<boolean> {
    if (!this.accessToken) {
      console.warn("LinkedIn access token not configured");
      return false;
    }

    try {
      // TODO: Implement actual LinkedIn connection verification
      // This would involve searching connections by email or name

      // For now, return mock verification
      console.log(`Verifying connection for email: ${clientEmail}`);
      return Math.random() > 0.5; // 50% chance for demo purposes
    } catch (error) {
      console.error("Error verifying LinkedIn connection:", error);
      return false;
    }
  }

  /**
   * Import LinkedIn recommendation as testimonial
   * @param recommendationId LinkedIn recommendation ID
   * @returns Testimonial data ready for database insertion
   */
  async importRecommendation(recommendationId: string) {
    if (!this.accessToken) {
      throw new Error("LinkedIn access token not configured");
    }

    try {
      // TODO: Implement actual LinkedIn recommendation import
      // This would fetch the specific recommendation and format it for our testimonial system

      const mockRecommendation = this.getMockRecommendations().find(
        (r) => r.id === recommendationId
      );

      if (!mockRecommendation) {
        throw new Error("Recommendation not found");
      }

      return {
        name: `${mockRecommendation.recommender.firstName} ${mockRecommendation.recommender.lastName}`,
        role: mockRecommendation.recommender.headline,
        company: "LinkedIn Connection", // Would extract from profile
        content: mockRecommendation.text,
        rating: 5, // LinkedIn recommendations are typically positive
        avatarUrl: mockRecommendation.recommender.profilePicture,
        approved: false, // Still requires manual approval
        featured: false,
      };
    } catch (error) {
      console.error("Error importing LinkedIn recommendation:", error);
      throw error;
    }
  }

  /**
   * Get OAuth URL for LinkedIn authentication
   * @param redirectUri Redirect URI after authentication
   * @returns LinkedIn OAuth URL
   */
  getOAuthUrl(redirectUri: string): string {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const scope = "r_liteprofile r_emailaddress w_member_social";

    if (!clientId) {
      throw new Error("LinkedIn client ID not configured");
    }

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      state: Math.random().toString(36).substring(7), // CSRF protection
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   * @param code Authorization code from LinkedIn
   * @param redirectUri Redirect URI used in OAuth flow
   * @returns Access token
   */
  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<string> {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("LinkedIn credentials not configured");
    }

    try {
      const response = await fetch(
        "https://www.linkedin.com/oauth/v2/accessToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error_description || "Failed to exchange code for token"
        );
      }

      return data.access_token;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  }

  /**
   * Mock recommendations for development/demo purposes
   */
  private getMockRecommendations(): LinkedInRecommendation[] {
    return [
      {
        id: "rec_1",
        recommender: {
          id: "profile_1",
          firstName: "Sarah",
          lastName: "Chen",
          headline: "CTO at TechFlow Solutions",
          profilePicture: "/testimonials/sarah-chen.jpg",
          publicProfileUrl: "https://linkedin.com/in/sarah-chen",
        },
        text: "Exceptional technical expertise and delivery. The brutalist approach to our web application was exactly what we needed. Clean, fast, and incredibly effective. Our conversion rates increased by 340% after launch.",
        createdAt: new Date("2024-01-15"),
        type: "received",
      },
      {
        id: "rec_2",
        recommender: {
          id: "profile_2",
          firstName: "Marcus",
          lastName: "Rodriguez",
          headline: "Founder at StartupForge",
          profilePicture: "/testimonials/marcus-rodriguez.jpg",
          publicProfileUrl: "https://linkedin.com/in/marcus-rodriguez",
        },
        text: "Outstanding mobile app development. Delivered 2 weeks ahead of schedule with zero bugs. The performance is incredible - 60fps animations and instant loading. Worth every penny.",
        createdAt: new Date("2024-02-20"),
        type: "received",
      },
      {
        id: "rec_3",
        recommender: {
          id: "profile_3",
          firstName: "Dr. Emily",
          lastName: "Watson",
          headline: "Director at MedTech Innovations",
          profilePicture: "/testimonials/emily-watson.jpg",
          publicProfileUrl: "https://linkedin.com/in/emily-watson",
        },
        text: "The full-stack solution handles 10,000+ concurrent users without breaking a sweat. The architecture is bulletproof and the code quality is exceptional. Highly recommended for enterprise projects.",
        createdAt: new Date("2024-03-10"),
        type: "received",
      },
    ];
  }
}

// Singleton instance
export const linkedInIntegration = new LinkedInIntegration();

// Utility functions
export const isLinkedInConfigured = (): boolean => {
  return !!(
    process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
  );
};

export const getLinkedInProfileUrl = (profileId: string): string => {
  return `https://www.linkedin.com/in/${profileId}`;
};

export const extractLinkedInProfileId = (url: string): string | null => {
  const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
  return match ? match[1] : null;
};
