import { startApiServer } from "./server.js";

void (async () => {
  await startApiServer({
    port: 3000,
    host: "127.0.0.1",
    dataFilePath: "data/platform.json"
  });

  console.log("API server listening on http://127.0.0.1:3000");
})();
