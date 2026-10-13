import { getCountdown, type CountdownParts, type ISODateTime } from "@calpulli/domain";
import { useEffect, useState } from "react";

export function useCountdown(target: ISODateTime): CountdownParts | null {
  const [countdown, setCountdown] = useState(() =>
    getCountdown(target, new Date().toISOString()),
  );

  useEffect(() => {
    const update = () => {
      setCountdown(getCountdown(target, new Date().toISOString()));
    };

    update();
    const interval = setInterval(update, 1_000);
    return () => clearInterval(interval);
  }, [target]);

  return countdown;
}
