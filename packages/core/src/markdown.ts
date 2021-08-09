import {
  defaultMarkdownSerializer,
  MarkdownSerializer,
  MarkdownSerializerState,
} from 'prosemirror-markdown';

export const markdownSerializer = new MarkdownSerializer(
  Object.assign(defaultMarkdownSerializer.nodes, {
    code_block(state: MarkdownSerializerState, node: any) {
      state.write('```' + (node.attrs.language || '') + '\n');
      state.text(node.textContent, false);
      state.ensureNewLine();
      state.write('```');
      state.closeBlock(node);
    },
    explain(state: MarkdownSerializerState, node: any) {
      state.renderInline(node);
      state.closeBlock(node);
    },
    // TODO: improve note rendering
    notice(state: MarkdownSerializerState, node: any) {
      state.wrapBlock('> ', undefined, node, () => state.renderContent(node));
    },
    // TODO: add render logic for diff block
    diff_block(state: MarkdownSerializerState, node: any) {},
    step_start(state: MarkdownSerializerState, node: any) {},
    step_end(state: MarkdownSerializerState, node: any) {},
    file_start(state: MarkdownSerializerState, node: any) {},
    file_end(state: MarkdownSerializerState, node: any) {},
  }),

  Object.assign(defaultMarkdownSerializer.marks, {
    bold: {
      open: '**',
      close: '**',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    italic: {
      open: '*',
      close: '*',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
  }),
);
