import { chatbotPrompt } from "@/helpers/constants/chatbot-prompt";
import { ChatGPTMessage, OpenAIStream } from "@/lib/openai-stream";
import { MessageArraySchema } from "@/lib/validators/message";

export async function POST(req: Request) {
    const { messages } = await req.json();
    const parsedMsgs = MessageArraySchema.parse(messages);
    const outboundMsgs: ChatGPTMessage[] = parsedMsgs.map((msg) => ({
        role: msg.isUserMsg ? "user" : "system",
        content: msg.text,
    }));
    outboundMsgs.unshift({
        role: "system",
        content: chatbotPrompt,
    });

    const payload = {
        model: "gpt-3.5-turbo",
        messages: outboundMsgs,
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 150,
        stream: true,
        n: 1,
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
}
