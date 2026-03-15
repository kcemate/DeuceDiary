import { log } from "../utils";
import { startTimer } from "./perfBaseline";

const SLOW_QUERY_THRESHOLD_MS = 100;

/**
 * Patches pool.query to log any query that takes longer than SLOW_QUERY_THRESHOLD_MS.
 * Operates transparently — callers don't need to change anything.
 */
export function instrumentPool(pool: { query: (...args: unknown[]) => Promise<unknown> }): void {
  const original = pool.query.bind(pool) as (...args: unknown[]) => Promise<unknown>;

  pool.query = function (...args: unknown[]): Promise<unknown> {
    const elapsed = startTimer();

    const onFinish = (ms: number, isError: boolean) => {
      if (ms > SLOW_QUERY_THRESHOLD_MS) {
        const queryText =
          typeof args[0] === "string"
            ? args[0]
            : ((args[0] as { text?: string })?.text ?? "(unknown)");
        const prefix = isError ? "SLOW QUERY (error)" : "SLOW QUERY";
        log(
          `[${prefix}] ${Math.round(ms)}ms — ${String(queryText).slice(0, 150)}`,
          "db",
        );
      }
    };

    const result = original(...args);

    if (result && typeof result.then === "function") {
      return result.then(
        (res: unknown) => {
          onFinish(elapsed(), false);
          return res;
        },
        (err: unknown) => {
          onFinish(elapsed(), true);
          throw err;
        },
      );
    }

    // pg Pool.query always returns a Promise, but handle sync case defensively
    onFinish(elapsed(), false);
    return result;
  };
}
