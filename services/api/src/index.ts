import { initServer, logServerError } from "./server";
(async () => {
  try {
    await initServer();
  } catch (err) {
    logServerError(err);
    process.exit(1);
  }
})();
