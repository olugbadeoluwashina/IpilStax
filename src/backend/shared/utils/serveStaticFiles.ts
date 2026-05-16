import { serveDir, serveFile } from '@std/http/file-server';

export async function serveStatic(req: Request): Promise<Response> {

  const response = await serveDir(req, {
    fsRoot: "src/frontend/dist",
    quiet: true
  })

  if (response.status === 404) {
    return serveFile(req, "src/frontend/dist/index.html");
  }

  return response;

}