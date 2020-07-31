import { Component, createElement } from "react";
import StateError from "./StateError";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.errorStates = new Set();
    this.removeListeners = new WeakMap();
    this.handleStateChange = () => {
      let lastStateError;
      const noErrorStates = [];
      for (const state of this.errorStates) {
        if (state.error) {
          lastStateError = state.error;
        } else {
          noErrorStates.push(state);
        }
      }
      noErrorStates.forEach((state) => {
        const removeListener = this.removeListeners.get(state);
        removeListener();
        this.errorStates.delete(state);
      });
      this.setState({
        lastStateError,
      });
    };
  }

  componentDidCatch(error, errorInfo) {
    if (error instanceof StateError) {
      if (!this.errorStates.has(error)) {
        this.errorStates.add(error.state);
        this.removeListeners.set(
          error.state,
          error.state.onChange(this.handleStateChange)
        );
        this.setState({
          lastStateError: error.state.error,
        });
      }
    } else {
      this.setState({
        lastError: error,
      });
    }
  }

  render() {
    const error = this.state.lastError || this.state.lastStateError;

    if (error) {
      if (this.props.fallback) {
        return this.props.fallback;
      } else if (this.props.fallbackRender) {
        return this.props.fallbackRender(error);
      } else if (this.props.fallbackComponent) {
        return createElement(this.props.fallbackComponent, { error });
      }
      throw new Error(
        "ErrorBoundary requires either a fallback, fallbackRender, or fallbackComponent prop"
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
