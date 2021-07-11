import axios from "axios";

export default class FileUploadService {
	endpointPermanent: string;

	endpointCheckFile: string;

	constructor() {
		this.endpointPermanent = `${process.env.FILE_UPLOAD_API_URL}/api/files/permanent`;
		this.endpointCheckFile = `${process.env.FILE_UPLOAD_API_URL}/api/files/check-file`;
	}

	toFilename = (string) => string.replace(/[^a-zA-Z0-9-_.]/g, "_");

	async makeFilePermanent(user, sourceFilename, destinationFilename) {
		const payload = {
			sourceFilename: this.toFilename(sourceFilename),
			destinationFilename,
		};
		let response;
		try {
			response = await axios.post(this.endpointPermanent, payload, {
				headers: {
					authorization: user.token,
				},
			});
		} catch (err) {
			const fileExists = await this.checkFileExists(user, sourceFilename);
			if (fileExists) {
				return {
					...fileExists,
					url: fileExists.publicUrl,
				};
			}
			console.error(err);
			throw err;
		}
		return response.data;
	}

	async checkFileExists(user, filename, tempFile = false) {
		const payload = {
			filename: this.toFilename(filename),
			tempFile,
		};
		let response;
		try {
			response = await axios.post(this.endpointCheckFile, payload, {
				headers: {
					authorization: user.token,
				},
			});
		} catch (err) {
			console.error(err);
			return false;
		}
		return response.data;
	}
}
