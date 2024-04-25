import "../polyfills";
// https://github.com/xmtp/xmtp-js/issues/487
import React from "react";
import ReactDOM from "react-dom/client";
import { Wrapper } from "./wrapper";
import "./styles/index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import * as Sentry from "@sentry/react";
import Error from "./app/error";
import { ENVIRONMENT } from "./services";

Sentry.init({
  environment: ENVIRONMENT === "production" ? "production" : "development",
  dsn: "https://659f128450258c756b7656b1cccfb135@o4506978044739584.ingest.us.sentry.io/4507125636792320",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Wrapper />
    {/* <Error /> */}
  </React.StrictMode>
);
