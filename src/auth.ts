/**
 * This file is where you configure better-auth for your application.
 * 
 * It uses the Prisma adapter to connect to a MySQL database.
 * 
 * The `betterAuth` function is called with various options to configure authentication,
 * including session settings, user settings, and plugins.
*/

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";
import { createElement } from "react";

import prisma from "@/database/datasource";
import { env } from "@/lib/env";
import { sendTemplateEmail } from "@/lib/email";
import { ResetPasswordEmail } from "@/emails/reset-password-email";
import { VerifyEmail } from "@/emails/verify-email";
import { ac, admin, user, vendor, customer } from "./permissions";

export const auth = betterAuth({
  appName: env.SITE_NAME,
  trustedOrigins: [env.BETTER_AUTH_URL],
  logger: {
    disabled: false,
    level: 'debug',
    disableColors: true,
    log(level, message, ...args) {
      console[level](`[BetterAuth] ${message}`, ...args);
    },
  },
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false, // TODO: enable this later
    minPasswordLength: 8,
    maxPasswordLength: 20,
    resetPasswordTokenExpiresIn: 60 * 15, // 15 minutes
    verificationTokenExpiresIn: 3600, // 1 hour
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url, token: _token }) => {
      await sendTemplateEmail({
        to: user.email,
        subject: `${env.SITE_NAME} password reset`,
        react: createElement(ResetPasswordEmail, {
          appName: env.SITE_NAME,
          userName: user.name,
          actionUrl: url,
        }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token: _token }) => {
      await sendTemplateEmail({
        to: user.email,
        subject: `Verify your email for ${env.SITE_NAME}`,
        react: createElement(VerifyEmail, {
          appName: env.SITE_NAME,
          userName: user.name,
          actionUrl: url,
        }),
      });
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600 // 1 hour
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
    freshAge: 60 * 60 * 24, // 1 day
    cookieCache: { // Don't need to read user from database if read within this time
      enabled: true,
      maxAge: 60 * 60, // 1 hour
    },
  },
  user: {
    changeEmail: {
      enabled: false,
    },
    deleteUser: {
      enabled: false,
    },
    additionalFields: {
      designation: {
        fieldName: "designation", // maps to designation in database
        type: 'string',
        required: false,
        defaultValue: 'Mr.',
        input: true,
      },
      company: {
        fieldName: "company", // maps to company in database
        type: 'string',
        required: true,
        input: true,
      },
      phone: {
        fieldName: "phone", // maps to phone in database
        type: "string",
        required: false,
        input: true,
      },
      countryCode: {
        fieldName: "countryCode", // maps to countryCode in database
        type: "string",
        required: false,
        input: true,
        defaultValue: "+91",
      },
      phoneVerified: {
        fieldName: "phoneVerified", // maps to phoneVerified in database
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
    }
  },
  plugins: [
    adminPlugin({
      defaultRole: 'user',
      impersonationSessionDuration: 60 * 60, // 1 hour
      defaultBanReason: "Banned by admin",
      ac,
      roles: {
        admin,
        user,
        vendor,
        customer,
      }
    }),
    openAPI({
      // disableDefaultReference: false, // Disable in production
    }),
    nextCookies(),
  ],
  telemetry: {
    enabled: false, // Disable telemetry for privacy concerns
  }
});
