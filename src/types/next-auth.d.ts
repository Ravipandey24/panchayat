import NextAuth from 'next-auth'

declare module "next-auth" {
    interface Session {
      user: User
    }
  }

declare module "next-auth/jwt" {
  interface JWT {
    tokenId: string
    name: string
    email: string
    picture: string
  }
}