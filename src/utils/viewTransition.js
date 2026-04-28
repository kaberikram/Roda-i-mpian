export function runWithViewTransition(doUpdate) {
  if (typeof document !== 'undefined' && document.startViewTransition) {
    document.startViewTransition(() => void doUpdate());
  } else {
    doUpdate();
  }
}
