import { cn } from "@/lib/utils";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";

export const SidebarLessonItem = ({ lesson, module, courseId }) => {
  const isActive = (lesson) => {
    return lesson?.access === "public";
  };

  const isCompleted = (lesson) => {
    return lesson?.state === "completed";
  };
  return (
    <Link
      href={
        isActive(lesson)
          ? `/courses/${courseId}/lesson?name=${lesson.slug}&module=${module}`
          : "#"
      }
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500]  transition-all hover:text-slate-600 ",
        isActive(lesson) && "text-slate-700  hover:text-slate-700",
        isCompleted(lesson) && "text-emerald-700 hover:text-emerald-700"
      )}
    >
      <div className="flex items-center gap-x-2">
        {!isActive(lesson) ? (
          <Lock
            size={16}
            className={cn("text-slate-500", isActive && "text-slate-700")}
          />
        ) : isCompleted(lesson) ? (
          <CheckCircle
            size={16}
            className={cn(
              "text-slate-500",
              isActive(lesson) && "text-slate-700",
              isCompleted(lesson) && "text-emerald-700"
            )}
          />
        ) : (
          <PlayCircle
            size={16}
            className={cn("text-slate-500", isActive && "text-slate-700")}
          />
        )}

        {lesson?.title}
      </div>
    </Link>
  );
};
