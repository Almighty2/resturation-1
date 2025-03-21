import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          //console.log("Tentative de connexion avec:", credentials?.username);

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password,
              }),
            }
          );

          if (!res.ok) {
            console.error("Échec de l'authentification:", res.status);
            return null;
          }

          const userData = await res.json();
          console.log("Données utilisateur:", userData);

          return {
            id: userData.id || "user-id",
            name: userData.username || credentials?.username,
            email: userData.email || credentials?.username,
            token: userData.token || userData.accessToken || userData.data?.token,
            role: userData.role,
            permissions: userData.permissions,
          };
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.userId = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        accessToken: token.accessToken,
        userId: token.userId,
        role: token.role,
        permissions: token.permissions,
      };
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  pages: { signIn: "/login" },
  secret: process.env.AUTH_SECRET || "J5zRDZDZ5kWAn4J9pWfcHlP40Zxi+cvpoWLMwGrQ5SE=",
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
});

export { handler as GET, handler as POST };
