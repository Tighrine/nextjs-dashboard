import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { db } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

const getUser = async (email: string): Promise<User | undefined> => {
    try {
        const client = await db.connect();
        const user = await client.sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    // Validate credentials schema
                    const schema = z.object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    });

                    const parsedCredentials = schema.safeParse(credentials);

                    if (!parsedCredentials.success) {
                        console.log('Invalid credentials format');
                        return null;
                    }

                    const { email, password } = parsedCredentials.data;

                    // Retrieve user by email
                    const user = await getUser(email);

                    if (!user) {
                        console.log('User not found');
                        return null;
                    }

                    // Compare hashed password
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        console.log('Invalid password');
                        return null;
                    }

                    // Return user object if successful
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    console.error('Error in credentials authorization:', error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt', // Use JSON Web Tokens for session management
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
    },
});