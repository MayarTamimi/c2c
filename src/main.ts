import { UserRepo } from './repositories/UserRepository';
import { CourseRepo } from './repositories/CourseRepository';

async function main() {
  const userRepository = new UserRepo();
  const courseRepository = new CourseRepo();

  const allUsers = await userRepository.getAll();
  console.log('All users:', allUsers);

  const userCount = await userRepository.count();
  console.log('User count:', userCount);

  const foundUser = await userRepository.getDataByID('1');
  console.log('Found user with ID 1:', foundUser);

  await courseRepository.create({ id: '3', title: 'Chemistry', hours: 8, price: 150, describtion: 'Chemistry course' });
  await courseRepository.create({ id: '4', title: 'Biology', hours: 6, price: 120, describtion: 'Biology course' });

  const allCourses = await courseRepository.getAll();
  console.log('All courses:', allCourses);

  const courseCount = await courseRepository.count();
  console.log('Course count:', courseCount);

  await userRepository.clear();
  const userCountAfterClear = await userRepository.count();
  console.log('User count after clear:', userCountAfterClear);
}

main();
