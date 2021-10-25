import { wrapIn, lift } from 'prosemirror-commands';
import { isNodeActive } from '../queries';

export default function(type, attrs = {}) {
  return (state, dispatch, view) => {
    const isActive = isNodeActive(type, attrs)(state);

    if (isActive) {
      return lift(state, dispatch);
    }

    return wrapIn(type, attrs)(state, dispatch, view);
  };
}
