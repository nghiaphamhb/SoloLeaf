// src/bugsnag.js
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

Bugsnag.start({
  apiKey: import.meta.env.VITE_BUGSNAG_API_KEY,
  plugins: [new BugsnagPluginReact()],
  appVersion: "1.0.0",
  releaseStage: import.meta.env.MODE, // development / production
});

export default Bugsnag;
