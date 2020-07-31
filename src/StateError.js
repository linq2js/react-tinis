export default class StateError extends Error {
  constructor(state) {
    const error = state.error;
    super(error.message);
    this.state = state;
  }
}
