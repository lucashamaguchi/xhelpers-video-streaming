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
    console.log(payload)
    const videoPath = `src/assets/${payload.id}.mp4`;
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const videoRange = payload.range;
    const start = Number((videoRange || '').replace(/bytes=/, "").split("-")[0])
    console.log(start)
    const end = fileSize - 1
    const chunkSize = (end - start) + 1

    const stream = fs.createReadStream(videoPath, { start, end })
    const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
    };

    return {
      stream,
      mimeType: "video/mp4",
      range: `bytes ${start}-${end}/${fileSize}`,
      chunkSize,
      filename: `${payload.id}.mp4`
    }
  }
}