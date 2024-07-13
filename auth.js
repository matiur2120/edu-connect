import bcrypt from 'bcryptjs';
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from './auth.config';
import { User } from "./model/user-model";
import { dbConnect } from "./service/mongo";

async function refreshAccessToken(token){
  try{
    const url = 'https://oauth2.googleapis.com/token' + new URLSearchParams({
      client_id: process.env.AUTH_GOOGLE_ID,
      client_secret: process.env.AUTH_GOOGLE_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken
    })
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    })
    const refreshedTokens = await response.json();
    if(!response.ok){
      throw refreshedTokens
    }
    return {
      ...token,
      accessToken: refreshedTokens?.access_token,
      accessTokenExpires: Date.now() + refreshedTokens?.expires_in * 1000,
      refreshToken: refreshedTokens?.refresh_token,

    }

  }catch(error){
    console.log(error)
    return{
      ...token,
      error: "RefreshAccessTokenError"
    }
  }
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        credentials: {
            email: {},
            password: {}
          },
      async authorize(credentials) {
        await dbConnect();

        if (credentials == null) return null;
        try {
          const user = await User.findOne({ email: credentials.email }).lean();
          console.log(user)
          if (user) {
            if (user) {
              const isMatch = await bcrypt.compare(
                  credentials.password,
                  user.password
              );
            
            if (isMatch) {
              return user;
            } else {
              console.error("password mismatch");
              throw new Error("Check your password");
            }}
          } else {
            console.error("User not found");
             throw new Error("User not found");
          }
        } catch (err) {
          console.error(err);
          throw Error(err);
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization:{
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
  ],
  callbacks: {
    async jwt({token, user, account}){
      console.log(`JWT token: ${JSON.stringify(token)}`);
      console.log(`JWT account ${JSON.stringify(account)}`)
      if(account && user){
      return{
      accessToken: account?.access_token,
      accessTokenExpires: Date.now() + account?.expires_in * 1000,
      refreshToken: account?.refresh_token,
      user
      }}
      if(Date.now() < token?.accessTokenExpires){
        console.log(`At ${new Date(Date.now())} Using old access token`)
        return token;
      }
      console.log(`Token expire at ${new Date(Date.now())}`)
      return refreshAccessToken(token);

      },
    async session({session, token}){
      session.user = token?.user;
      session.accessToken = token?.access_token;
      session.error = token?.error
      console.log(`Returning session ${session}`)
      return session;
    }   
    }
   }
);