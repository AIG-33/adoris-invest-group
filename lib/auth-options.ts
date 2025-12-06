import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER || 'noreply@ivdgroup.eu',
          pass: process.env.EMAIL_SERVER_PASSWORD || 'demo_password',
        },
      },
      from: process.env.EMAIL_FROM || 'IVD GROUP <noreply@ivdgroup.eu>',
      // Custom email send function for demo
      async sendVerificationRequest({ identifier: email, url }) {
        console.log('\n🔐 MAGIC LINK LOGIN REQUEST')
        console.log('═══════════════════════════════════════')
        console.log(`📧 To: ${email}`)
        console.log(`🔗 Magic Link: ${url}`)
        console.log('═══════════════════════════════════════\n')
        console.log('In production, this would send an email with the magic link.')
        console.log('For demo, copy the link above and paste it in your browser.\n')
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
