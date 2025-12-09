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
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role as string
        (session.user as any).id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
