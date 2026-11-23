type ApiError = {
  response?: {
    data?: {
      message?: string;
      errors?: { path?: string; message?: string }[] | Record<string, string[]>;
    };
  };
};

/** Extracts a readable error message from an API error. */
export function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as ApiError).response;
    const errors = response?.data?.errors;

    let details: string[] = [];

    if (Array.isArray(errors)) {
      details = errors
        .map((item) => item.message)
        .filter((message): message is string => Boolean(message));
    } else if (errors && typeof errors === "object") {
      details = Object.values(errors)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter((value): value is string => typeof value === "string");
    }

    if (details.length > 0) return details.join(" ");
    if (response?.data?.message) return response.data.message;
  }

  if (error instanceof Error && error.message) return error.message;

  return "Something went wrong. Please try again.";
}
