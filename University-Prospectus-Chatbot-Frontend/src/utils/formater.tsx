
    
    
export const formate = (text: string) => {
    const formattedText = text.split('\n').map((line, idx) => {
      let space_cnt = countLeadingSpaces(line);
      line = line.trim();
  
      if (line.startsWith('####')) {
        const text = line.substring(4).trim();
        return <h3 className="text-lg font-semibold" key={idx}>{parseInlineElements(text)}</h3>;
      } else if (line.startsWith('###')) {
        const text = line.substring(3).trim();
        return <h2 className="text-xl font-bold" key={idx}>{parseInlineElements(text)}</h2>;
      } else if (line.startsWith('##')) {
        const text = line.substring(2).trim();
        return <h1 className="text-xxl font-extrabold" key={idx}>{parseInlineElements(text)}</h1>;
      } else if (line.startsWith('**')) {
        return <p key={idx}>{parseInlineElements(line)}</p>;
      } else if (line.startsWith('*') || line.startsWith('-')) {
        const new_line = line.substring(1).trim();
        return (
          <li style={{ paddingLeft: `${Math.max(space_cnt * 12, 12)}px` }} key={'li' + idx}>
            {parseInlineElements(new_line)}
          </li>
        );
      } else if (/^\s{2,}-/.test(line)) {
        return <p key={'p' + idx}>&emsp; &emsp; {parseInlineElements(line)}</p>;
      } else if (/^\d+\./.test(line)) {
        return <p key={'p' + idx}>&emsp; {parseInlineElements(line)}</p>;
      } else {
        return <p key={'p' + idx}>{parseInlineElements(line)}</p>;
      }
    });
  
    return formattedText;
  };
  
  const parseInlineElements = (text: string) => {
    const parts = text.split(/(\[.*?\]\(.*?\)|https?:\/\/\S+|\*\*.*?\*\*|\*.*?\*)/g);
  
    return parts.map((part, idx) => {
      if (!part) return null;
  
      // Bold
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
  
      // Italic
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={idx} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
  
      // Markdown-style link: [text](url)
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, label, url] = match;
          return (
            <a href={url} target="_blank" rel="noopener noreferrer" key={idx} className="text-blue-600 underline">
              {label}
            </a>
          );
        }
      }
  
      // Plain URL
      if (/^https?:\/\/\S+$/.test(part)) {
        return (
          <a href={part} target="_blank" rel="noopener noreferrer" key={idx} className="text-blue-600 underline">
            {part}
          </a>
        );
      }
  
      return part;
    });
  };
  
  const countLeadingSpaces = (line: string) => {
    const match = line.match(/^(\s*)-/);
    return match ? match[1].length : 0;
  }