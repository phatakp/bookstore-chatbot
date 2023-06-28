"use client";

import { MessageProvider } from "@/context/messages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FC, ReactNode } from "react";

interface IProvidersProps {
    children: ReactNode;
}

export const Providers: FC<IProvidersProps> = ({ children }) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <MessageProvider>{children}</MessageProvider>
        </QueryClientProvider>
    );
};
