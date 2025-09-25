import { NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/cognito"

export async function POST(request: NextRequest) {
	try {
		const { username, password } = await request.json()

		if (!username || !password) {
			return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
		}

		const response = await loginUser(username, password)

		return NextResponse.json({
			AccessToken: response.AuthenticationResult?.AccessToken,
			IdToken: response.AuthenticationResult?.IdToken,
			RefreshToken: response.AuthenticationResult?.RefreshToken,
		})
	} catch (error: any) {
		console.error("Login error:", error)
		return NextResponse.json({ error: error.message || "Login failed" }, { status: 400 })
	}
}