import Link from "next/link";
import { FC, Fragment } from "react";

interface IMarkdownLiteProps {
    text: string;
}

export const MarkdownLite: FC<IMarkdownLiteProps> = ({ text }) => {
    const linkRegex = /\[(.+?)\]\((.+?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
        const [fullMatch, linkText, linkUrl] = match;
        const matchStart = match.index;
        const matchEnd = matchStart + fullMatch.length;

        if (lastIndex < matchStart)
            parts.push(text.slice(lastIndex, matchStart));

        parts.push(
            <Link
                target="_blank"
                rel="noopener noreferrer"
                key={linkUrl}
                href={linkUrl}
                className="text-blue-500 underline break-words underline-offset-2"
            >
                {linkText}
            </Link>
        );

        lastIndex = matchEnd;
    }

    if (lastIndex < text.length) parts.push(text.slice(lastIndex));

    return (
        <>
            {parts.map((part, i) => (
                <Fragment key={i}>{part}</Fragment>
            ))}
        </>
    );
};
