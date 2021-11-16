// import { findWrapping } from 'prosemirror-transform';
import { findWrapping } from '../commands';

export default function wrapIn(nodeType, attrs) {
  return function(state, dispatch) {
    let { $from, $to } = state.selection;
    let range = $from.blockRange($to);

    let wrapping = range && findWrapping(range, nodeType, attrs);
    if (!wrapping) return false;
    if (dispatch) dispatch(state.tr.wrap(range, wrapping).scrollIntoView());
    return true;
  };
}
