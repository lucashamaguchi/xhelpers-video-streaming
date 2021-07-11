import * as mongoose from "mongoose";

export interface IFile {
	key: string;
	bucket: string;
}

export interface IModel extends mongoose.Document {
	name: string;
	videoFile: IFile;
	thumbnailFile: IFile;
	description: string;
	public: boolean;

	// auto
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	metadata: any;
}

const fileSchema = new mongoose.Schema({
	key: { type: String },
	bucket: { type: String },
});

const schema = new mongoose.Schema({
	name: { type: String },
	videoFile: fileSchema,
	thumbnailFile: fileSchema,
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
