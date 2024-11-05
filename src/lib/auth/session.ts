import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const key = new TextEncoder().encode(process.env.AUTH_SECRET);
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
	return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(plainTextPassword: string, hashedPassword: string) {
	return compare(plainTextPassword, hashedPassword);
}

type SessionData = {
	user: { id: number };
	expires: string;
};

export async function signToken(payload: SessionData) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1 day from now")
		.sign(key);
}

export async function verifyToken(input: string) {
	const { payload } = await jwtVerify(input, key, {
		algorithms: ["HS256"],
	});
	return payload as SessionData;
}
