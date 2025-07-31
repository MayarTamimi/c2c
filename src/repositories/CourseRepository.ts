import { Course } from "../models/Course";
import { BaseRepository } from "./BaseRepository";

 export class CourseRepo extends BaseRepository<Course> {
    constructor() {
        super([
            {id : '1' , hours : 3 , title : 'Math' , price : 100 , describtion : 'Math' },
            {id : '2' , hours : 10 , title : 'Physics' , price : 100 , describtion : 'Physics' }
        ])
    }
}