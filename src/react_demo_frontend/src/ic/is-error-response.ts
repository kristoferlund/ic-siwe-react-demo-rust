import { ErrorResponse } from "./error-response.type";

// Type guard function to check if a response is an error response
export function isErrorResponse<T>(response: T): response is T & ErrorResponse {
  return (
    response !== null &&
    typeof response === "object" &&
    "Err" in response &&
    typeof (response as ErrorResponse).Err === "object" &&
    ("status" in (response as ErrorResponse).Err ||
      "status_code" in (response as ErrorResponse).Err) &&
    "message" in (response as ErrorResponse).Err
  );
}
