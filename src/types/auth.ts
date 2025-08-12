// Auth-related types
import { Role } from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: Role;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}

export interface AuthError {
  type: string;
  message: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
