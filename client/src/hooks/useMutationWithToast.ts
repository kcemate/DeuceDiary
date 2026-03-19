import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { mutationErrorHandler } from "@/lib/authUtils";

export interface MutationWithToastOptions<
  TData = unknown,
  TError extends Error = Error,
  TVariables = void,
  TContext = unknown,
> extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "onError"> {
  /** If provided, shows a destructive toast on error (via mutationErrorHandler, handles 401 redirects). */
  errorMessage?: string | ((error: TError) => string);
  /** Optional title for the error toast (defaults to "Error"). */
  errorTitle?: string;
  /** If provided, shows a success toast after onSuccess fires. */
  successMessage?: string | ((data: TData, variables: TVariables) => string);
  /** Original onError callback — runs after the error toast is shown. */
  onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void;
}

/**
 * Thin wrapper around useMutation that provides:
 *   - Automatic error toast via mutationErrorHandler (handles 401 redirect) when errorMessage is set
 *   - Automatic success toast when successMessage is set
 *   - All standard useMutation options pass through unchanged
 */
export function useMutationWithToast<
  TData = unknown,
  TError extends Error = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: MutationWithToastOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { toast } = useToast();
  const { successMessage, errorMessage, errorTitle, onSuccess, onError, ...rest } = options;

  return useMutation<TData, TError, TVariables, TContext>({
    ...rest,
    onSuccess:
      successMessage || onSuccess
        ? (data, variables, context) => {
            if (successMessage) {
              const msg =
                typeof successMessage === "function"
                  ? successMessage(data, variables)
                  : successMessage;
              toast({ title: msg });
            }
            onSuccess?.(data, variables, context);
          }
        : undefined,
    onError:
      errorMessage !== undefined || onError
        ? (error, variables, context) => {
            if (errorMessage !== undefined) {
              mutationErrorHandler(toast, errorMessage as string | ((e: Error) => string), errorTitle)(error);
            }
            onError?.(error, variables, context);
          }
        : undefined,
  });
}
