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
          await sendMagicLinkEmail({ to: email, url })
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error sending magic link email:', error)
          }
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
    async signIn({ user, account }) {
      if (account?.provider === 'email' || account?.provider === 'credentials') {
        return true
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email || (user as any).email
      }
      
      try {
        let dbUser = null
        
        if (token.email) {
          dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, role: true, email: true },
          })
        }
        
        if (!dbUser && token.id) {
          dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { id: true, role: true, email: true },
          })
        }
        
        if (dbUser) {
          token.role = dbUser.role || 'user'
          token.id = dbUser.id
          if (dbUser.email) token.email = dbUser.email
        } else {
          token.role = (user as any)?.role || 'user'
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('JWT: Error fetching user from DB:', error)
        }
        token.role = (user as any)?.role || 'user'
      }
      
      return token
    },
    async session({ session, token }) {
      const role = token.role ? String(token.role) : 'user'
      const id = token.id ? String(token.id) : ''
      
      if (session?.user) {
        ;(session.user as any).role = role
        ;(session.user as any).id = id
        
        if (token.email) {
          session.user.email = String(token.email)
        }
        
        if (role === 'user' && token.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email as string },
              select: { role: true },
            })
            if (dbUser && dbUser.role !== 'user') {
              ;(session.user as any).role = dbUser.role
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Session: Error checking role:', error)
            }
          }
        }
      }
      
      return {
        ...session,
        user: {
          ...session.user,
          role: role,
          id: id,
        } as any,
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      if (new URL(url).origin === baseUrl) {
        return url
      }
      return baseUrl
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
