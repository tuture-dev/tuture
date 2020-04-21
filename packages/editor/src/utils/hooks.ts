import { useState, DependencyList } from 'react';
import { useDispatch } from 'react-redux';
import { useDebounce } from 'react-use';

import { Dispatch } from 'store';
import { SaveKey } from 'models/collection';

export function useDebouncedSave(
  saveKeys: SaveKey[],
  ms: number,
  deps: DependencyList,
) {
  const [dirty, setDirty] = useState(false);
  const dispatch = useDispatch<Dispatch>();

  useDebounce(
    () => {
      if (dirty) {
        dispatch.collection.save({ keys: saveKeys });
      }
    },
    ms,
    deps,
  );

  return setDirty;
}
