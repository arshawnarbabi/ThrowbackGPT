import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            const text = String(children).replace(/\n$/, "");
            const isBlock = !!match || text.includes("\n");
            if (!isBlock) return <code className="inline-code">{children}</code>;
            return <CodeBlock language={match?.[1] || ""} code={text} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
