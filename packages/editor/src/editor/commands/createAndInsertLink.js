import { ToastType } from "../utils/constants";

function findPlaceholderLink(doc, href) {
  let result;

  function findLinks(node, pos = 0) {
    // get text nodes
    if (node.type.name === "text") {
      // get marks for text nodes
      node.marks.forEach((mark) => {
        // any of the marks links?
        if (mark.type.name === "link") {
          // any of the links to other docs?
          if (mark.attrs.href === href) {
            result = { node, pos };
            if (result) return false;
          }
        }
      });
    }

    if (!node.content.size) {
      return;
    }

    node.descendants(findLinks);
  }

  findLinks(doc);
  return result;
}

const createAndInsertLink = async function(view, title, href, options) {
  const { dispatch, state } = view;
  const { onCreateLink, onShowToast } = options;

  try {
    const url = await onCreateLink(title);
    const result = findPlaceholderLink(view.state.doc, href);

    if (!result) return;

    dispatch(
      view.state.tr
        .removeMark(
          result.pos,
          result.pos + result.node.nodeSize,
          state.schema.marks.link
        )
        .addMark(
          result.pos,
          result.pos + result.node.nodeSize,
          state.schema.marks.link.create({ href: url })
        )
    );
  } catch (err) {
    const result = findPlaceholderLink(view.state.doc, href);
    if (!result) return;

    dispatch(
      view.state.tr.removeMark(
        result.pos,
        result.pos + result.node.nodeSize,
        state.schema.marks.link
      )
    );

    // let the user know
    if (onShowToast) {
      onShowToast(options.dictionary.createLinkError, ToastType.Error);
    }
  }
};

export default createAndInsertLink;
