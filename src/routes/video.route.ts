import Service from "../services/video.service";
import BaseRoute from "xhelpers-api/lib/base-route-simple";
import * as Joi from "@hapi/joi";

class Routes extends BaseRoute {
  protected service: Service;
  constructor() {
    super(["videos"]);
    this.service = new Service();

    this.route(
      "GET",
      "/api/videos/{id}",
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
          ...(r.headers as any)
        });
        return entity
          ? h.response(entity.stream)
            .type(entity.mimeType)
            .header("Pragma", "no-cache")
            .header("Cache-Control", "public, must-revalidate, max-age=0")
            .header("Content-Range", entity.range)
            .header("Accept-Ranges", "bytes")
            .header("Content-Length", entity.chunkSize.toString())
            .header("Content-Description", 'File Transfer')
            .header("Content-Disposition", `attachment; filename=${entity.filename};`)
            .header("Content-Transfer-Encoding", "binary")
            .code(200)
          : h
              .response({ message: "Bad request" })
              .code(400);
      })
      .build();
  }
}

module.exports = [...new Routes().buildRoutes()];
