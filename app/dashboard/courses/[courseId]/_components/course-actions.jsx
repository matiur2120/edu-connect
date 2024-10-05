"use client";
import {
  changeCoursePublishState,
  deleteCourseAction,
} from "@/app/actions/course-actions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CourseActions = ({ course }) => {
  const router = useRouter();
  const [action, setAction] = useState("");
  const [published, setPublished] = useState(course?.active);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      switch (action) {
        case "change-active": {
          const updatedActiveState = await changeCoursePublishState(course?.id);
          setPublished(!updatedActiveState);
          router.refresh();
          toast.success("The Course has been updated");
          break;
        }
        case "delete": {
          if (published) {
            toast.error(
              "A published Course can not be deleted. First unpublish it, then delete."
            );
          } else {
            await deleteCourseAction(course?.id);
            router.push(`/dashboard/courses`);
            toast.success("Module has been deleted successfully");
            router.refresh();
          }
          break;
        }
        default: {
          throw new Error("Invalid Course action");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    console.log(action);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAction("change-active")}
        >
          {published ? "Unpublish" : "Publish"}
        </Button>

        <Button size="sm" onClick={() => setAction("delete")}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default CourseActions;
