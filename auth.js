import bcrypt from 'bcryptjs';
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from './auth.config';
import { User } from "./model/user-model";
import { dbConnect } from "./service/mongo";

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
  ],
});