import useStates from './useStates';
import StateError from './StateError';

export default function useValue(states) {
  return useStates(states, {
    prepare(context) {
      context.removeLoadingChangeListener &&
        context.removeLoadingChangeListener();
      delete context.removeLoadingChangeListener;
    },
    mapper(context, state) {
      if (state.loading) {
        const promise = new Promise((resolve) => {
          const removeListener = (context.removeLoadingChangeListener = state.onLoadingChange(
            () => {
              removeListener();
              if (context.removeLoadingChangeListener === removeListener) {
                delete context.removeLoadingChangeListener;
              }
              resolve();
            },
          ));
        });
        throw promise;
      } else if (state.error) {
        throw new StateError(state);
      }
      return state.value;
    },
    handleChange(context, state) {
      return state.onChange(context.rerender);
    },
  });
}
