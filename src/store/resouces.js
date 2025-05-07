import { createStore } from "solid-js/store";
export const [resources, setResources] = createStore({});

function createDeepSignal(value) {
  const [store, setStore] = createStore({
    value
  });
  return [
    () => store.value,
    (v) => {
      const unwrapped = unwrap(store.value);
      typeof v === "function" && (v = v(unwrapped));
      setStore("value", reconcile(v));
      return store.value;
    }
  ]
}