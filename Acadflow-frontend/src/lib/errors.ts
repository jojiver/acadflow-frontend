type ApiError = {
  response?: {
    data?: {
      message?: string;
      errors?: { path?: string; message?: string }[];
    };
  };
};

export function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as ApiError).response;

    const details = response?.data?.errors
      ?.map((item) => item.message)
      .filter(Boolean);

    if (details && details.length > 0) return details.join(" ");
    if (response?.data?.message) return response.data.message;
  }

  if (error instanceof Error && error.message) return error.message;

  return "Something went wrong. Please try again.";
}
