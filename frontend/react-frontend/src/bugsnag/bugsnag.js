import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

const apiKey = import.meta.env.VITE_BUGSNAG_API_KEY;

// Optional: turn off Bugsnag in Cypress/e2e
const isCypress = Boolean(window.Cypress);

if (apiKey && !isCypress) {
  Bugsnag.start({
    apiKey,
    plugins: [new BugsnagPluginReact()],
  });
} else {
  console.info("Bugsnag disabled (missing key or running Cypress).");
}

export default Bugsnag;
