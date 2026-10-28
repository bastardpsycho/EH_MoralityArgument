import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const allowed = new Set(["index.html", "styles.css", "app.mjs", "cases.mjs", "model.mjs", "chart.mjs", "scaffold.mjs"]);
const contentTypes = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".mjs": "text/javascript; charset=utf-8" };
const port = Number(process.env.MORAL_TOPOLOGY_PORT || 4173);

const server = createServer(async (request, response) => {
  const rawPath = new URL(request.url || "/", "http://127.0.0.1").pathname;
  const name = rawPath === "/" ? "index.html" : normalize(rawPath).replace(/^[/\\]+/, "");
  if (!allowed.has(name)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }
  const filePath = join(root, name);
  try {
    if (!(await stat(filePath)).isFile()) throw new Error("Not a file");
    response.writeHead(200, { "content-type": contentTypes[extname(filePath)] || "application/octet-stream", "cache-control": "no-store" });
    response.end(await readFile(filePath));
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => console.log(`Moral Topology v2 at http://127.0.0.1:${port}/`));
