import * as fs from "fs";

export default class Service {
  constructor() {}

  async getVideo(payload: {
    id: string,
    range: any
  }): Promise<{
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
    const start = Number((videoRange || '').replace(/bytes=/, "").split("-")[0])
    const end = fileSize - 1
    const chunkSize = (end - start) + 1

    const stream = fs.createReadStream(videoPath, { start, end })
    return {
      stream,
      mimeType: "video/mp4",
      range: `bytes ${start}-${end}/${fileSize}`,
      chunkSize,
      filename: `${payload.id}.mp4`
    }
  }

  async getVideoCaption(payload) {
    const captionPath = `${__dirname}/../assets/captions/${payload.id}.vtt`;
    const captionStat = fs.statSync(captionPath);
    const fileSize = captionStat.size;
    const videoRange = payload.range;
    const start = Number((videoRange || '').replace(/bytes=/, "").split("-")[0])
    const end = fileSize - 1
    const chunkSize = (end - start) + 1

    const stream = fs.createReadStream(captionPath, { start, end });
    return {
      stream,
      mimeType: "text/vtt",
      range: `bytes ${start}-${end}/${fileSize}`,
      chunkSize,
      filename: `${payload.id}.vtt`
    }
  }
}