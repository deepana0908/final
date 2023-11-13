import { useRef } from "react";

/**
 * A utility hook to set the state of unmounted components so as to
 * prevent updates to an unmounted component and also aborting any 
 * @returns 
 */
export default function useMounted() {
  const isMounted = useRef(true);

  return {
    isMounted: isMounted.current,
    unMount() {
      isMounted.current = false;
    },
  };
}
