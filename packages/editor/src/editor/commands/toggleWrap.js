import { lift } from 'prosemirror-commands';
import { isNodeActive } from '../queries';
import { wrapIn } from '../commands';

export default function(type, attrs = {}) {
  return (state, dispatch, view) => {
    const isActive = isNodeActive(type, attrs)(state);

    if (isActive) {
      return lift(state, dispatch);
    }

    return wrapIn(type, attrs)(state, dispatch, view);
  };
}
