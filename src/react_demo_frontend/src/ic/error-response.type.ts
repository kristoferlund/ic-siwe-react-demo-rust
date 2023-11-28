// Define an interface for the expected error structure
export type ErrorResponse = {
  Err: {
    status?: number;
    status_code?: number;
    message?: string;
  };
};
