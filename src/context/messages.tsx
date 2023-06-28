import { Message } from "@/lib/validators/message";
import { nanoid } from "nanoid";
import { ReactNode, createContext, useState } from "react";

export const MessageContext = createContext<{
    messages: Message[];
    isMessageUpdating: boolean;
    addMessage: (message: Message) => void;
    removeMessage: (id: string) => void;
    updateMessage: (id: string, updateFn: (prevText: string) => string) => void;
    setIsMessageUpdating: (isUpdating: boolean) => void;
}>({
    messages: [],
    isMessageUpdating: false,
    addMessage: () => {},
    removeMessage: () => {},
    updateMessage: () => {},
    setIsMessageUpdating: () => {},
});

export function MessageProvider({ children }: { children: ReactNode }) {
    const [isMessageUpdating, setIsMessageUpdating] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: nanoid(),
            isUserMsg: false,
            text: "Hello, How can I help you?",
        },
    ]);

    const addMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    const removeMessage = (id: string) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    const updateMessage = (
        id: string,
        updateFn: (prevText: string) => string
    ) => {
        setMessages((prev) =>
            prev.map((msg) => {
                if (msg.id === id) return { ...msg, text: updateFn(msg.text) };
                return msg;
            })
        );
    };

    return (
        <MessageContext.Provider
            value={{
                messages,
                isMessageUpdating,
                addMessage,
                removeMessage,
                updateMessage,
                setIsMessageUpdating,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
}
