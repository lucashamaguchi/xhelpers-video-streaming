import BaseServiceMongoose from "xhelpers-api/lib/base-service-mongoose";
import * as fs from "fs";
import * as Boom from "@hapi/boom";
import * as mongoose from "mongoose";
import Model, { IModel } from "../model/video";
import FileUploadService from "./fileupload.service";
import AccountService from "./account.service";

export default class Service extends BaseServiceMongoose<IModel> {
	protected sentitiveInfo: any = ["-__v"];

	private fileuploadService: FileUploadService;

	private accountService: AccountService;

	constructor() {
		super(Model);
		this.fileuploadService = new FileUploadService();
		this.accountService = new AccountService();
	}

	protected async validate(entity: IModel, payload: IModel): Promise<boolean> {
		const user = await this.accountService.getApiUser();

		// validate video file
		if (payload.videoFile) {
			if (
				!(await this.fileuploadService.checkFileExists(
					user,
					payload.videoFile.key,
					true
				))
			)
				throw Boom.badRequest(
					`payload.videoFile.key (${payload.videoFile.key}) does not exists`
				);
		}

		// validate thumbnail file
		if (payload.thumbnailFile) {
			if (
				!(await this.fileuploadService.checkFileExists(
					user,
					payload.thumbnailFile.key,
					true
				))
			)
				throw Boom.badRequest(
					`payload.thumbnailFile.key (${payload.thumbnailFile.key}) does not exists`
				);
		}
		return true;
	}

	async getVideo(payload: { id: string; range: any }): Promise<{
		mimeType: string;
		stream: any;
		range: string;
		chunkSize: number;
		filename: string;
	}> {
		const videoPath = `${__dirname}/../assets/${payload.id}.mp4`;
		const videoStat = fs.statSync(videoPath);
		const fileSize = videoStat.size;
		const videoRange = payload.range;
		const start = Number(
			(videoRange || "").replace(/bytes=/, "").split("-")[0]
		);
		const end = fileSize - 1;
		const chunkSize = end - start + 1;

		const stream = fs.createReadStream(videoPath, { start, end });
		return {
			stream,
			mimeType: "video/mp4",
			range: `bytes ${start}-${end}/${fileSize}`,
			chunkSize,
			filename: `${payload.id}.mp4`,
		};
	}

	async getVideoCaption(payload) {
		const captionPath = `${__dirname}/../assets/captions/${payload.id}.vtt`;
		const captionStat = fs.statSync(captionPath);
		const fileSize = captionStat.size;
		const videoRange = payload.range;
		const start = Number(
			(videoRange || "").replace(/bytes=/, "").split("-")[0]
		);
		const end = fileSize - 1;
		const chunkSize = end - start + 1;

		const stream = fs.createReadStream(captionPath, { start, end });
		return {
			stream,
			mimeType: "text/vtt",
			range: `bytes ${start}-${end}/${fileSize}`,
			chunkSize,
			filename: `${payload.id}.vtt`,
		};
	}

	async queryAllUser(u, query) {
		return super.queryAll(
			u,
			{
				filter: {
					...query,
					createdBy: u._id,
				},
				fields: [],
			},
			query
		);
	}

	async queryAll(u, query) {
		return super.queryAll(
			u,
			{
				filter: {
					...query,
					public: true,
				},
				fields: [],
			},
			query
		);
	}

	public async getById(
		user: any,
		id: any,
		projection: any = [],
		populateOptions: { path: string | any; select?: string | any } = {
			path: ".",
			select: ["-__v"],
		}
	): Promise<IModel> {
		Object.assign(projection, this.sentitiveInfo);
		try {
			return (await this.Model.findById(id)
				.populate({ ...populateOptions })
				.select([...projection])) as IModel;
		} catch (err) {
			if (err instanceof (mongoose as any).default.Error.CastError) {
				return null;
			}
			throw err;
		}
	}
}
