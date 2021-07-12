import * as mongoose from "mongoose";

export interface IModel extends mongoose.Document {
	name: string;
	videoFileKey: string;
	thumbnailFileKey: string;
	description: string;
	public: boolean;

	// auto
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	metadata: any;
}

const schema = new mongoose.Schema({
	name: { type: String },
	videoFileKey: { type: String },
	thumbnailFileKey: { type: String },
	description: { type: String },
	public: { type: Boolean },

	// auto
	createdBy: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date },
	metadata: { type: Object },
});

schema.set("toJSON", { virtuals: true });

export default mongoose.models.Video ||
	mongoose.model<IModel>("Video", schema, "video");
