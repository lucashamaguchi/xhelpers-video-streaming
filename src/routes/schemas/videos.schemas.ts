import * as Joi from "@hapi/joi";
import { IFile, IModel as IVideo } from "../../model/video";

const fileSchema = Joi.object<IFile>({
	key: Joi.string().required(),
	bucket: Joi.string().required(),
});

export const createPayload = Joi.object<IVideo>({
	name: Joi.string().required(),
	videoFile: fileSchema.required(),
	thumbnailFile: fileSchema,
	description: Joi.string(),
});

export const updatePayload = Joi.object<IVideo>({
	name: Joi.string(),
	thumbnailFile: fileSchema,
	description: Joi.string(),
	public: Joi.bool(),
});
