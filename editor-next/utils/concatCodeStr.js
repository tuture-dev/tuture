function concatCodeStr(diffItem) {
  let codeStr = '';
  const DIFF_ADD = [];
  const DIFF_DEL = [];

  diffItem.chunks.map((chunk, chunkIndex) => {
    chunk.changes.map((change, index) => {
      const { content } = change;

      if (/[+]/.test(content)) {
        DIFF_ADD.push(index);
      } else if (/[-]/.test(content)) {
        DIFF_DEL.push(index);
      }

      // handle render code content
      let code = content;

      if (content !== 'normal' && content.length === 1) {
        code = content.replace(/[+-]/, ' ');
      } else if (content !== 'normal' && content.length > 1) {
        code = content.slice(1);
      }

      if (
        chunkIndex === diffItem.chunks.length - 1 &&
        index === chunk.changes.length - 1
      ) {
        codeStr += code;
      } else {
        codeStr += `${code}\n`;
      }

      return change;
    });

    return chunk;
  });

  return { codeStr, DIFF_ADD, DIFF_DEL };
}

export default concatCodeStr;
