import { replaceMongoIdInArray } from "@/lib/convertData";
import { AccordionContent } from "@radix-ui/react-accordion";
import { SidebarLessonItem } from "./sidebar-lesson-item";

const SidebarLessons = ({ courseId, lessons, module }) => {
  const allLessons = replaceMongoIdInArray(lessons).toSorted((a, b) => {
    return a.order - b.order;
  });
  return (
    <AccordionContent>
      <div className="flex flex-col w-full gap-3">
        {allLessons.map((lesson) => (
          <SidebarLessonItem
            key={lesson?._id}
            lesson={lesson}
            module={module}
            courseId={courseId}
          />
        ))}
      </div>
    </AccordionContent>
  );
};

export default SidebarLessons;
