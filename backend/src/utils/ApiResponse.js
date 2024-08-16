export class ApiResponse {
  constructor(statusCode, data = null, message = "success") {
    {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.success = true;
    }
  }
}
