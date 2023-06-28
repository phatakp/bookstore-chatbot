import { MarkdownLite } from "@/components/MarkdownLite";
import { MessageContext } from "@/context/messages";
import { cn } from "@/lib/utils";
import { FC, HTMLAttributes, useContext } from "react";

interface IChatMessagesProps extends HTMLAttributes<HTMLDivElement> {}

export const ChatMessages: FC<IChatMessagesProps> = ({
    className,
    ...props
}) => {
    const { messages } = useContext(MessageContext);
    const inverseMsgs = [...messages].reverse();
    return (
        <div
            {...props}
            className={cn(
                "flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
                className
            )}
        >
            <div className="flex-1 flex-grow" />
            {inverseMsgs?.map((msg) => (
                <div key={msg.id} className="chat-message">
                    <div
                        className={cn(
                            "flex items-end",
                            msg.isUserMsg && "justify-end"
                        )}
                    >
                        <div
                            className={cn(
                                "flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden",
                                msg.isUserMsg
                                    ? "order-1 items-end"
                                    : "order-2 items-start"
                            )}
                        >
                            <p
                                className={cn(
                                    "px-4 py-2 rounded-lg",
                                    msg.isUserMsg
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800"
                                )}
                            >
                                <MarkdownLite text={msg.text} />
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
