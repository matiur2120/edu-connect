"use client";
import { Accordion } from "@/components/ui/accordion";
import { replaceMongoIdInArray } from "@/lib/convertData";
import { AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { useSearchParams } from "next/navigation";
import SidebarLessons from "./sidebar-lessons";
export const SidebarModules = ({ courseId, modules }) => {
  const searchParams = useSearchParams();
  const allModules = replaceMongoIdInArray(modules).toSorted(
    (a, b) => a.order - b.order
  );
  const query = searchParams.get("name");
  const expandedModuel = allModules.find((module) => {
    return module.lessonIds.find((lesson) => {
      return lesson.slug === query;
    });
  });
  const expandedModuleId = expandedModuel?.id ?? allModules[0]?.id;
  return (
    <Accordion
      defaultValue={expandedModuleId}
      type="single"
      collapsible
      className="w-full px-6"
    >
      {/* item */}
      {allModules.map((module) => (
        <>
          <AccordionItem
            className="border-0"
            value={module?.id}
            key={module?.id}
          >
            <AccordionTrigger>{module.title} </AccordionTrigger>
            <SidebarLessons
              courseId={courseId}
              lessons={module?.lessonIds}
              module={module?.slug}
            />
          </AccordionItem>
        </>
      ))}

      {/* item ends */}
    </Accordion>
  );
};
