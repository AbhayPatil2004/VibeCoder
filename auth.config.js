import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_AGOOGLE_SECRET,
    }),
  ],
}

export default authConfig
