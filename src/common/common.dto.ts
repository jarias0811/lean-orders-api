export class CommonResponse {
  message: string;
  data: any;

  constructor(data) {
    this.message = data.message;
    this.data = data.data;
  }
}
