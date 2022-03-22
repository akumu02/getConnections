class ErrorControl extends Error {  
    constructor (statusCode, message) {
      super(message);
  
      this.name = this.constructor.name;
      this.status = statusCode || 500;
      this.message = message || 'Error Processing Request';
      
      switch(statusCode){
        case 400:
          this.statusMessage = "Bad Request"
          break;
        case 401:
          this.statusMessage = "Unauthorized"
          break;
        case 403:
          this.statusMessage = "Forbidden"
          break; 
        case 404:
          this.statusMessage = "Not Found"
          break;
        case 408:
          this.statusMessage = "Request Timeout"
          break;
        case 500:
          this.statusMessage = "Internal Server Error"
          break;
        case 501:
          this.statusMessage = "Not Implemented"
          break;
        case 503:
          this.statusMessage = "Service Unavailable"
          break;  
        default:
          this.status = 500;
          this.statusMessage = "Internal Server Error";
      }
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = {ErrorControl}