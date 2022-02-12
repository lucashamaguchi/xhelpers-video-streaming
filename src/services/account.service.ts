import axios from "axios";

export default class AccountService {
	private endpointLogin: string;

	constructor() {
		this.endpointLogin = `${process.env.ACCOUNT_API_URL}/api/auth`;
	}

	async getApiUser(): Promise<{
		email: string;
		name: string;
		token: string;
	}> {
		const payload = {
			email: process.env.SERVICE_USER_EMAIL,
			password: process.env.SERVICE_USER_PASSWORD,
		};
		const response = await axios.post(this.endpointLogin, payload);
		return response.data;
	}
}
