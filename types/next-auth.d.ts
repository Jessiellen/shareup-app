import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      role?: string
      profession?: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    image?: string
    role?: string
    profession?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    profession?: string
  }
}
