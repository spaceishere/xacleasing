"use client";

import React from "react";
import { ApolloProvider } from "./ApolloProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return <ApolloProvider>{children}</ApolloProvider>;
};
