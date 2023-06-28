import { MessageContext } from "@/context/messages";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/validators/message";
import { useMutation } from "@tanstack/react-query";
import { CornerDownLeft, Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { FC, HTMLAttributes, useContext, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

interface IChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<IChatInputProps> = ({ className, ...props }) => {
    const [input, setInput] = useState("");
    const {
        messages,
        addMessage,
        removeMessage,
        updateMessage,
        isMessageUpdating,
        setIsMessageUpdating,
    } = useContext(MessageContext);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const { mutate: sendMessage, isLoading } = useMutation({
        mutationFn: async (message: Message) => {
            const resp = await fetch("/api/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: [message] }),
            });
            if (!resp.ok) throw new Error();
            return resp.body;
        },
        onMutate: (message) => {
            addMessage(message);
        },
        onSuccess: async (stream) => {
            if (!stream) throw new Error("New Stream Found");

            const id = nanoid();
            const respMsg: Message = { id, isUserMsg: false, text: "" };
            addMessage(respMsg);
            setIsMessageUpdating(true);

            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                updateMessage(id, (prev) => prev + chunkValue);
            }

            //cleanup
            setIsMessageUpdating(false);
            setInput("");
            setTimeout(() => {
                textAreaRef.current?.focus();
            }, 10);
        },
        onError: (_, message) => {
            toast.error("Something went wrong");
            removeMessage(message.id);
            textAreaRef.current?.focus();
        },
    });
    return (
        <div {...props} className={cn("border-t border-zinc-300", className)}>
            <div className="relative flex-1 mt-4 overflow-hidden border-none rounded-lg outline-none">
                <TextareaAutosize
                    rows={2}
                    maxRows={4}
                    autoFocus
                    value={input}
                    disabled={isLoading}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const message = {
                                id: nanoid(),
                                isUserMsg: true,
                                text: input,
                            };
                            sendMessage(message);
                        }
                    }}
                    placeholder="Write a message..."
                    className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6"
                />

                <div className="absolute inset-y-0 right-0 flex oy-1.5 pr-1.5">
                    <kbd className="inline-flex items-center px-1 font-sans text-xs text-gray-600 bg-white border border-gray-200 rounded">
                        {isLoading && (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                        {!isLoading && <CornerDownLeft className="w-3 h-3" />}
                    </kbd>
                </div>

                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
                />
            </div>
        </div>
    );
};

export default ChatInput;
