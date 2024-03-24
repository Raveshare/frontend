import React from "react";
import ContextProvider from "./providers/context/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ENVIRONMENT, WALLETCONNECT_PROJECT_ID } from "./services/env/env";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./app/App";
import { AuthComponent } from "./app/auth";
import { TourProvider } from "@reactour/tour";
import { OnboardingSteps } from "./app/editor/common";
import { EVMWalletProvider } from "./providers/EVM";
import { SolanaWalletProvider } from "./providers/solana";

const radius = 8;

const queryClient = new QueryClient();

export const Wrapper = () => {
  return (
    <EVMWalletProvider>
      <SolanaWalletProvider>
        <ContextProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      {/* Reactour wrap around Start */}

                      <TourProvider
                        steps={OnboardingSteps}
                        padding={{
                          mask: 4,
                          popover: [64, 8],
                          wrapper: 0,
                        }}
                        styles={{
                          popover: (base) => ({
                            ...base,
                            "--reactour-accent": "#2c346b",
                            borderRadius: radius,
                            // top: 32,
                            marginTop: "24",
                            marginRight: "64",
                            marginBottom: "32",
                          }),
                          maskArea: (base) => ({ ...base, rx: radius }),
                          maskWrapper: (base) => ({ ...base, color: "" }),
                          badge: (base) => ({
                            ...base,
                            right: "auto",
                            left: "-0.8em",
                          }),
                          controls: (base) => ({ ...base, marginTop: 24 }),
                          close: (base) => ({
                            ...base,
                            left: "auto",
                            right: 16,
                            top: 24,
                          }),
                        }}
                      >
                        <App />
                      </TourProvider>

                      {/* Reactour wrap around End */}
                    </>
                  }
                />
                <Route path="/ifUserEligible" element={<AuthComponent />} />
                {/* <Route path="/design/:slugId" element={<App />} /> */}
                Replace this
                {/* https://staging-lenspost.vercel.app/?slug=image-data-slug */}
              </Routes>
              {ENVIRONMENT === "localhost" && <ReactQueryDevtools />}
            </BrowserRouter>
          </QueryClientProvider>
        </ContextProvider>
      </SolanaWalletProvider>
    </EVMWalletProvider>
  );
};
