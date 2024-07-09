import { getCourseDetailsByInstructor } from "@/queries/coures";
import { MessageSquare, Presentation, Star, UsersRound } from "lucide-react";
import Image from "next/image";

const CourseInstructor = async ({ course }) => {
  const instructor = course?.instructor;
  const courseInfoByInstructor = await getCourseDetailsByInstructor(
    instructor._id.toString()
  );
  return (
    <div className="bg-gray-50 rounded-md p-8">
      <div className="md:flex md:gap-x-5 mb-8">
        <div className="h-[310px] w-[270px] max-w-full  flex-none rounded mb-5 md:mb-0">
          <Image
            src={instructor?.profilePicture}
            alt=""
            className="w-full h-full object-cover rounded"
            width={30}
            height={30}
          />
        </div>
        <div className="flex-1">
          <div className="max-w-[300px]">
            <h4 className="text-[34px] font-bold leading-[51px]">
              {instructor?.firstName} {instructor?.lastName}
            </h4>
            <div className="text-gray-600 font-medium mb-6">
              {instructor?.designation}
            </div>
            <ul className="list space-y-4">
              <li className="flex items-center space-x-3">
                <Presentation className="text-gray-600" />
                <div>{courseInfoByInstructor?.courses} Courses</div>
              </li>
              <li className="flex space-x-3">
                <UsersRound className="text-gray-600" />
                <div>{courseInfoByInstructor?.enrollments} Student Learned</div>
              </li>
              <li className="flex space-x-3">
                <MessageSquare className="text-gray-600" />
                <div>{courseInfoByInstructor?.reviews} Reviews</div>
              </li>
              <li className="flex space-x-3">
                <Star className="text-gray-600" />
                <div>
                  {courseInfoByInstructor?.averageRating} Average Rating
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="text-gray-600">{instructor?.bio}</p>
    </div>
  );
};

export default CourseInstructor;
