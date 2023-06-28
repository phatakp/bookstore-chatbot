import { Chat } from "@/components/Chat";
import { Providers } from "@/components/Providers";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "BookBuddy",
    description: "Your bookstore for fantasy and mystery novels",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <Chat />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
