import * as Joi from "@hapi/joi";
import { IModel as IVideo } from "../../model/video";

export const createPayload = Joi.object<IVideo>({
	name: Joi.string().required(),
	videoFileKey: Joi.string().required(),
	thumbnailFileKey: Joi.string(),
	description: Joi.string(),
});

export const updatePayload = Joi.object<IVideo>({
	name: Joi.string(),
	thumbnailFileKey: Joi.string(),
	description: Joi.string(),
	public: Joi.bool(),
});
