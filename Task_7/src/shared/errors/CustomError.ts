export class CustomError extends Error {
 
    statusCode: number ;
    constructor(public message: string , statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}