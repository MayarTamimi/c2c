import { Booking } from "../models/Booking";
import { BaseRepository } from "./BaseRepository";

export class BookingRepo extends BaseRepository<Booking> {
    constructor() {
        super([
            {id : '1' , courseId : '1' , userId : '1' , date : '2025-07-29' },
            {id : '1' , courseId : '2' , userId : '2' , date : '2025-07-29' },
            {id : '2' , courseId : '2' , userId : '2' , date : '2025-07-29' }
        ])
    }
}