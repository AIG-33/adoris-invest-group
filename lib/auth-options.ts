// @ts-nocheck
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { sendMagicLinkEmail } from './email'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: `${process.env.EMAIL_FROM_NAME || 'ADORIS INVEST GROUP'} <${process.env.EMAIL_FROM}>`,
      // Custom email send function using our email utility
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          console.log('\n🔐 MAGIC LINK LOGIN REQUEST')
          console.log('═══════════════════════════════════════')
          console.log(`📧 Sending to: ${email}`)
          console.log(`🔗 Magic Link: ${url}`)
          console.log('═══════════════════════════════════════\n')

          await sendMagicLinkEmail({ to: email, url })
          
          console.log('✅ Magic link email sent successfully\n')
        } catch (error) {
          console.error('❌ Error sending magic link email:', error)
          throw new Error('Could not send magic link email')
        }
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user?.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile, email }) {
      // Allow sign in for email provider
      if (account?.provider === 'email') {
        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || email?.verificationRequest?.identifier },
        })
        
        if (existingUser) {
          // User exists, allow sign in
          console.log('✅ Email sign in: User found', existingUser.email)
          return true
        } else {
          // User doesn't exist, PrismaAdapter will create it
          console.log('✅ Email sign in: Creating new user')
          return true
        }
      }
      
      // Allow sign in for credentials provider
      if (account?.provider === 'credentials') {
        return true
      }
      
      return true
    },
    async jwt({ token, user, account }) {
      // Initial sign in - fetch user from DB to get role
      if (user) {
        token.id = user.id
        token.email = user.email
        
        // Always fetch from DB to get latest role
        try {
          const dbUser = await prisma.user.findUnique({
            where: { 
              OR: [
                { id: user.id },
                { email: user.email || '' }
              ]
            },
            select: { id: true, role: true, email: true },
          })
          
          if (dbUser) {
            token.role = dbUser.role || 'user'
            token.id = dbUser.id
            token.email = dbUser.email || token.email
            console.log('✅ JWT (sign in): Set role from DB:', dbUser.role, 'for user:', dbUser.email)
          } else {
            token.role = (user as any).role || 'user'
            console.log('⚠️ JWT (sign in): User not found in DB, using default role:', token.role)
          }
        } catch (error) {
          console.error('❌ JWT (sign in): Error fetching user:', error)
          token.role = (user as any).role || 'user'
        }
      }
      
      // On every JWT token refresh/update - always fetch latest role from database
      if (!user && (token.email || token.id)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: token.email 
              ? { email: token.email as string }
              : { id: token.id as string },
            select: { id: true, role: true, email: true },
          })
          
          if (dbUser) {
            token.role = dbUser.role || 'user'
            token.id = dbUser.id
            if (dbUser.email) token.email = dbUser.email
            console.log('✅ JWT (refresh): Updated role from DB:', dbUser.role, 'for:', dbUser.email || dbUser.id)
          } else {
            console.log('⚠️ JWT (refresh): User not found in DB')
          }
        } catch (error) {
          console.error('❌ JWT (refresh): Error fetching user:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        const role = token.role ? String(token.role) : 'user'
        const id = token.id ? String(token.id) : ''
        (session.user as any).role = role
        (session.user as any).id = id
        if (token.email) {
          session.user.email = String(token.email)
        }
        console.log('✅ Session: Setting role:', role, 'id:', id, 'email:', token.email)
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Handle redirect after sign in
      // If url is relative, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // If url is on the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url
      }
      // Default redirect to home
      return baseUrl
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
