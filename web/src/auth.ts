import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const res = await fetch(`${process.env.API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            avatar: user.image,
          }),
        })
        if (!res.ok) {
          console.error("[auth] /auth/register retornou status:", res.status)
          return "/?error=api_unavailable"
        }
      } catch (err) {
        console.error("[auth] /auth/register falhou:", err)
        return "/?error=api_unavailable"
      }
      return true
    },
    async jwt({ token, account }) {
      // Primeiro login — armazena tokens e expiração
      if (account) {
        return {
          ...token,
          idToken: account.id_token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at, // segundos Unix
        }
      }

      // Token ainda válido (com margem de 60s)
      if (Date.now() < ((token.expiresAt as number) - 60) * 1000) {
        return token
      }

      // Token expirado — tenta renovar via refresh_token
      if (!token.refreshToken) {
        return { ...token, error: 'RefreshTokenError' }
      }

      try {
        const res = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken as string,
          }),
        })
        const refreshed = await res.json()
        if (!res.ok) throw refreshed

        return {
          ...token,
          idToken: refreshed.id_token ?? token.idToken,
          accessToken: refreshed.access_token,
          expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
        }
      } catch (err) {
        console.error('[auth] falha ao renovar token:', err)
        return { ...token, error: 'RefreshTokenError' }
      }
    },
    async session({ session, token }) {
      session.idToken = token.idToken as string | undefined
      session.error = token.error as string | undefined
      return session
    },
  },
})
