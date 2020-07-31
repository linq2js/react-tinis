import {useRef, useState, useEffect} from 'react';

const effectHook = useEffect;

export default function useStates(states, {prepare, mapper, handleChange}) {
  const isMultiple = Array.isArray(states);
  if (!isMultiple) {
    states = [states];
  }
  const [, rerender] = useState();
  const contextRef = useRef(undefined);
  if (!contextRef.current) {
    const onDispose = [];

    contextRef.current = {
      onDispose(listener) {
        onDispose.push(listener);
      },
      dispose() {
        onDispose.forEach((x) => x());
        onDispose.length = 0;
      },
      rerender() {
        rerender({});
      },
    };
  }

  prepare && prepare(contextRef.current);

  effectHook(() => {
    const context = contextRef.current;
    states.forEach((state) => {
      const removeListener = handleChange(context, state);
      if (removeListener) {
        context.onDispose(removeListener);
      }
    });
    return context.dispose;
  }, states);

  effectHook(
    () => () => {
      contextRef.current.isUnmount = true;
      contextRef.current.dispose();
    },
    [],
  );

  const values = states.map((state, index) =>
    mapper(
      contextRef.current,
      state,
      contextRef.current.values ? contextRef.current.values[index] : undefined,
    ),
  );
  contextRef.current.values = values;
  return isMultiple ? values : values[0];
}
