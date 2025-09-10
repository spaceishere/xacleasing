import React, { createContext, useContext } from "react";

interface GraphQLContextType {
  query: (query: string, variables?: any) => Promise<any>;
  mutate: (mutation: string, variables?: any) => Promise<any>;
}

const GraphQLContext = createContext<GraphQLContextType | undefined>(undefined);

const graphqlFetch = async (query: string, variables?: any) => {
  const response = await fetch(process.env.NEXT_PUBLIC_ERXES_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "erxes-app-token": process.env.NEXT_PUBLIC_ERXES_APP_TOKEN!,
    },
    credentials: "include",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || "GraphQL query error");
  }

  return result.data;
};

export const ApolloProvider = ({ children }: React.PropsWithChildren) => {
  const contextValue: GraphQLContextType = {
    query: graphqlFetch,
    mutate: graphqlFetch,
  };

  return (
    <GraphQLContext.Provider value={contextValue}>
      {children}
    </GraphQLContext.Provider>
  );
};

export const useGraphQL = (): GraphQLContextType => {
  const context = useContext(GraphQLContext);
  if (!context) {
    throw new Error("useGraphQL must be used within an ApolloProvider");
  }
  return context;
};
