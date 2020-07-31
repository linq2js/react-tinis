import useStates from './useStates';

export default function useLoadable(states) {
  return useStates(states, {
    mapper(_, state, prevValue) {
      let loadable;
      if (state.loading) {
        loadable = {
          state: 'loading',
          value: state.value,
        };
      } else if (state.error) {
        loadable = {
          state: 'hasError',
          value: state.value,
          error: state.error,
        };
      } else {
        loadable = {
          state: 'hasValue',
          value: state.value,
        };
      }

      if (
        !prevValue ||
        prevValue.state !== loadable.state ||
        prevValue.value !== loadable.value ||
        prevValue.error !== loadable.error
      ) {
        return loadable;
      }

      return prevValue;
    },
    handleChange(context, state) {
      return state.onLoadingChange(context.rerender);
    },
  });
}
