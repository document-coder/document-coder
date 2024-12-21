import _ from 'lodash';
import { marked } from 'marked';

const splitIntoSentences = (text) => {
  // Basic sentence splitting - todo: replace robust solution
  return text
    .replace(/([.?!])\s+(?=[A-Z])/g, "$1|")
    .split("|")
    .map(s => s.trim())
    .filter(s => s.length > 0);
};

const collectFootnotes = () => {
  console.log("collectFootnotes");
  const footnotes = [];
  let counter = 1;
  return {
    add: (url) => {
      const index = footnotes.findIndex(f => f.url === url);
      if (index >= 0) {
        return index + 1;
      }
      footnotes.push({ number: counter, url });
      return counter++;
    },
    getAll: () => footnotes.map(f => `[^${f.number}]: ${f.url}`),
  };
};

const flattenTokens = (tokens) => {
  const blocks = [];
  let currentBlock = null;
  const isLeafToken = (token) => !token.tokens;
  const startBlock = (type, metadata = {}) => {
    if (currentBlock && currentBlock.tokens?.length > 0) {
      blocks.push(currentBlock);
    }
    currentBlock = { type, tokens: [], ...metadata };
  };
  const addToCurrentBlock = (token, context) => {
    if (!currentBlock) {
      startBlock('text');
    }
    currentBlock.tokens.push({
      ...token,
      context: [...context]
    });
  };
  const processTokens = (tokens, depth = 0, context = []) => {
    for (const token of tokens) {
      switch (token.type) {
        case 'space': {
          // whitepsace means a new block.
          startBlock('text');
          break;
        }
        case 'heading': {
          startBlock('section', { level: token.depth });
          if (token.tokens) {
            processTokens(token.tokens, depth, context);
          }
          break;
        }

        case 'list': {
          token.items.forEach(item => {
            startBlock('list_item', { depth });
            if (item.tokens) {
              processTokens(item.tokens, depth + 1, context);
            }
          });
          break;
        }

        case 'paragraph':
        case 'blockquote': {
          startBlock('text');
          if (token.tokens) {
            processTokens(token.tokens, depth, context);
          }
          break;
        }

        case 'code': {
          startBlock('text');
          token.text.split('\n')
            .filter(line => line.trim())
            .forEach(line => {
              addToCurrentBlock({
                type: 'text',
                text: line,
                raw: line
              }, context);
            });
          break;
        }

        case 'strong':
        case 'em':
        case 'link': {
          const newContext = [...context, { type: token.type, ...(token.type === 'link' ? { href: token.href } : {}) }];
          if (token.tokens) {
            processTokens(token.tokens, depth, newContext);
          }
          break;
        }

        default: {
          if (isLeafToken(token)) {
            addToCurrentBlock(token, context);
          } else if (token.tokens) {
            processTokens(token.tokens, depth, context);
          }
        }
      }
    }
  };
  processTokens(tokens);
  if (currentBlock && currentBlock.tokens.length > 0) {
    blocks.push(currentBlock);
  }
  return blocks;
};

const blocksToText = (blocks, footnoteManager) => {
  const getFormatting = (item) => {
    switch (item.type) {
      case 'strong':
        return { prefix: '**', suffix: '**' };
      case 'em':
        return { prefix: '*', suffix: '*' };
      case 'link':
        const footnoteNumber = footnoteManager.add(item.href);
        return { prefix: '[', suffix: `][^${footnoteNumber}]` };
      default:
        return { prefix: '', suffix: '' };
    }
  };
  const getContextTransition = (prevContext, nextContext) => {
    const maxLen = Math.max(prevContext.length, nextContext.length);
    const changes = [];
    let firstDiff = 0;
    while (firstDiff < maxLen &&
      JSON.stringify(prevContext[firstDiff]) === JSON.stringify(nextContext[firstDiff])) {
      firstDiff++;
    }
    for (let i = prevContext.length - 1; i >= firstDiff; i--) {
      changes.push({
        type: 'close',
        format: getFormatting(prevContext[i])
      });
    }
    for (let i = firstDiff; i < nextContext.length; i++) {
      changes.push({
        type: 'open',
        format: getFormatting(nextContext[i])
      });
    }

    return changes;
  };

  const processBlock = (block) => {
    let prevContext = [];
    let result = '';
    block.tokens.forEach((token, idx) => {
      const changes = getContextTransition(prevContext, token.context);
      changes.forEach(change => {
        if (change.type === 'close') {
          result += change.format.suffix;
        } else {
          result += change.format.prefix;
        }
      });
      result += token.text;
      prevContext = token.context;
    });
    prevContext.reverse().forEach(ctx => {
      result += getFormatting(ctx).suffix;
    });
    return result;
  };

  const processedBlocks = blocks.map(block => ({
    ...block,
    content: [processBlock(block)]
  }));
  const footnotes = footnoteManager.getAll();
  for (const footnote of footnotes) {
    processedBlocks.push({
      type: 'link',
      content: [footnote]
    });
  }
  return processedBlocks;
};

// Stage 3: Split blocks into sentences
const splitBlocksIntoSentences = (blocks) => {
  return blocks.map(block => {
    // Don't split footnote blocks
    if (block.content[0]?.startsWith('[^')) return block;
    return {
      ...block,
      content: block.content.flatMap(text =>
        splitIntoSentences(text)
      ),
    };
  });
};

// Main parsing function
const parseMarkdownToDocument = (markdown, footnoteManager) => {
  const tokens = marked.lexer(markdown);
  const flatBlocks = flattenTokens(tokens);
  const textBlocks = blocksToText(flatBlocks, footnoteManager);
  const to_return = splitBlocksIntoSentences(textBlocks);
  return to_return;
};

export { parseMarkdownToDocument, collectFootnotes };