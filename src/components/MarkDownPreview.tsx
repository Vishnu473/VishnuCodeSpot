import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default MarkdownPreview;