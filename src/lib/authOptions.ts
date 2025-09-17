import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 這裡應該是你的使用者驗證邏輯
        // 例如：查詢資料庫，檢查電子郵件和密碼
        const isUserValid = (credentials?.email === "test123@example.com" && credentials?.password === "password123");

        if (isUserValid) {
          const user = { id: "1", name: "Test User", email: "test123@example.com" };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};