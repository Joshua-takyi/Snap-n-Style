import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/model/schema";
export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const { email, password } = credentials;
				const user = await User.findOne({ email });
				if (!user) {
					throw new Error("Invalid credentials");
				}
				const isPasswordCorrect = await bcrypt.compare(password, user.password);
				if (!isPasswordCorrect) {
					throw new Error("Invalid credentials");
				}

				const name = user.firstName + " " + user.lastName;
				// return user id, accessToken,role
				const accessToken = jwt.sign(
					{
						id: user._id,
						role: user.role,
						name: name,
					},
					process.env.JWT_SECRET,
					{ expiresIn: "1h" }
				);
				return {
					id: user._id,
					accessToken: accessToken,
					role: user.role,
					name: name,
				};
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.accessToken = user.accessToken;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id;
			session.user.accessToken = token.accessToken;
			session.user.role = token.role;
			return session;
		},

	},
});
