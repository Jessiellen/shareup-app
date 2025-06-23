import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Middleware adicional se necessário
    console.log("🛡️ Middleware executado para:", req.nextUrl.pathname)
    console.log("🛡️ Token presente:", !!req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        
        // Sempre permitir callbacks de auth
        if (pathname.startsWith("/api/auth")) {
          console.log("🔑 Permitindo acesso ao callback auth:", pathname)
          return true
        }
        
        // Permite acesso se há token
        if (token) {
          console.log("✅ Token válido, permitindo acesso:", pathname)
          return true
        }
        
        // Permite acesso às páginas públicas
        const publicPaths = ["/login", "/register", "/forgot-password", "/"]
        const isPublic = publicPaths.includes(pathname)
        console.log("🔓 Página pública?", isPublic, "para", pathname)
        return isPublic
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

// Rotas protegidas que requerem autenticação
export const config = {
  matcher: [
    // Proteger apenas as rotas específicas, não os callbacks
    "/((?!api/auth|_next/static|_next/image|favicon.ico|img).*)",
    "/home/:path*",
    "/profile/:path*", 
    "/appointments/:path*",
    "/posts/:path*",
    "/professionals/:path*",
    "/dashboard/:path*"
  ]
}
