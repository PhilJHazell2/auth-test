import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION!,
});

export async function signupUser(username: string, password: string) {
	const command = new SignUpCommand({
		ClientId: process.env.COGNITO_APP_CLIENT_ID!,
		Username: username,
		Password: password,
		UserAttributes: [
			{ Name: "email", Value: `${username}@placeholder.local` },
		],
	});

  return await client.send(command);
}

export async function loginUser(username: string, password: string) {
	const command = new InitiateAuthCommand({
		AuthFlow: "USER_PASSWORD_AUTH",
		ClientId: process.env.COGNITO_APP_CLIENT_ID!,
		AuthParameters: {
			USERNAME: username,
			PASSWORD: password,
		},
	})

	return await client.send(command);
}