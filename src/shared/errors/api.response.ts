export class ApiResponse<T> {
  public success = true
  constructor(
    public message: string,
    public data: T,
  ) {}
}

export class ApiErrorResponse {
  public success = false
  constructor(
    public message: string,
    public details?: unknown,
  ) {}
}