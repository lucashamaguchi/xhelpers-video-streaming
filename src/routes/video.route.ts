import * as Boom from "@hapi/boom";
import BaseRoute from "xhelpers-api/lib/base-route";
import Service from "../services/video.service";
import { createPayload, updatePayload } from "./schemas/videos.schemas";

const resourcePath = "videos";
const resourceName =
	resourcePath && resourcePath[0].toUpperCase() + resourcePath.slice(1);

class Routes extends BaseRoute<Service> {
	protected service: Service;

	constructor() {
		super(new Service(), ["videos"]);


		this.route(
			"GET",
			`/api/${resourcePath}/{id}/stream`,
			{
				description: "Route to get video",
				tags: ["api", "videos"],
			},
			false
		)
			.validate({ params: this.defaultIdProperty })
			.handler(async (r, h, u) => {
				const entity = await this.service.getVideo({
					...(r.params as any),
					...(r.headers as any),
				});
				return entity
					? h
							.response(entity.stream)
							.type(entity.mimeType)
							.header("Pragma", "no-cache")
							.header("Cache-Control", "public, must-revalidate, max-age=0")
							.header("Content-Range", entity.range)
							.header("Accept-Ranges", "bytes")
							.header("Content-Length", entity.chunkSize.toString())
							.header("Content-Description", "File Transfer")
							.header(
								"Content-Disposition",
								`attachment; filename=${entity.filename};`
							)
							.header("Content-Transfer-Encoding", "binary")
							.code(200)
					: h.response({ message: "Bad request" }).code(400);
			})
			.build();

		this.route(
			"GET",
			`/api/${resourcePath}/{id}`,
			{
				description: "Route to get video",
				tags: ["api", "videos"],
			},
			false
		)
			.validate({ params: this.defaultIdProperty })
			.handler(async (r, h, u) => {
				const entity = await this.service.getById(u, r.params.id);
				return entity
					? h
							.response(entity)
							.header("Content-Transfer-Encoding", "binary")
							.code(200)
					: h.response({ message: "Bad request" }).code(400);
			})
			.build();

		this.route(
			"GET",
			`/api/${resourcePath}/{id}/caption`,
			{
				description: "Route to get video caption",
				tags: ["api", "videos"],
			},
			false
		)
			.validate({ params: this.defaultIdProperty })
			.handler(async (r, h, u) => {
				const entity = await this.service.getVideoCaption({
					...(r.params as any),
					...(r.headers as any),
				});
				return entity
					? h
							.response(entity.stream)
							.type(entity.mimeType)
							.header("Pragma", "no-cache")
							.header("Cache-Control", "public, must-revalidate, max-age=0")
							.header("Content-Range", entity.range)
							.header("Accept-Ranges", "bytes")
							.header("Content-Length", entity.chunkSize.toString())
							.header("Content-Description", "File Transfer")
							.header(
								"Content-Disposition",
								`attachment; filename=${entity.filename};`
							)
							.header("Content-Transfer-Encoding", "binary")
							.code(200)
					: h.response({ message: "Bad request" }).code(400);
			})
			.build();

		this.route(
			"POST",
			`/api/${resourcePath}`,
			{
				description: `Route to create ${resourceName}`,
			},
			true
		)
			.validate({ payload: createPayload })
			.handler(async (r, h, u) => {
				const entity = await this.service.create(u, r.payload);
				if (!entity) throw Boom.badRequest("bad request");
				return h.response(entity).code(200);
			})
			.build();

		this.route(
			"PATCH",
			`/api/${resourcePath}`,
			{
				description: `Route to update ${resourceName}`,
			},
			true
		)
			.validate({ payload: updatePayload })
			.handler(async (r, h, u) => {
				const entity = await this.service.create(u, r.payload);
				if (!entity) throw Boom.badRequest("bad request");
				return h.response(entity).code(200);
			})
			.build();

		this.route(
			"DELETE",
			`/api/${resourcePath}/{id}`,
			{
				description: `Route to update ${resourceName}`,
			},
			true
		)
			.validate({ params: this.defaultIdProperty })
			.handler(async (r, h, u) => {
				await this.service.delete(u, r.params.id);
				return h.response({}).code(200);
			})
			.build();

		this.route(
			"GET",
			`/api/${resourcePath}`,
			{
				description: `Route to get ${resourceName}`,
			},
			true
		)
			.validate({ query: this.defaultSearchQuery })
			.handler(async (r, h, u) => {
				const entity = await this.service.queryAll(u, r.query);
				if (!entity) throw Boom.badRequest("bad request");
				return h.response(entity).code(200);
			})
			.build();

		this.route(
			"GET",
			`/api/${resourcePath}/user`,
			{
				description: `Route to get ${resourceName} by user`,
			},
			true
		)
			.validate({ query: this.defaultSearchQuery })
			.handler(async (r, h, u) => {
				const entity = await this.service.queryAllUser(u, r.query);
				if (!entity) throw Boom.badRequest("bad request");
				return h.response(entity).code(200);
			})
			.build();
	}
}

module.exports = [...new Routes().buildRoutes()];
