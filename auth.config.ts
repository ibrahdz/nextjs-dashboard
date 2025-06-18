import type { NextAuthConfig} from 'next-auth';
 
export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
        async jwt({ token, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
            token.accessToken = account.access_token;
            token.refreshToken = account.refresh_token;
            token.expiresAt = account.expires_at;
        }
        return token;
        },
        async session({ session, token }) {
        // Send properties to the client, like an access_token from a provider
        session.accessToken = token.accessToken;
        return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers:[],
} satisfies NextAuthConfig;


    
  