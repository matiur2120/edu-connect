import {
  changeLessonPublishState,
  deleteLessonAction,
} from "@/app/actions/lesson-actions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const LessonActions = ({ lesson, moduleId, onDelete }) => {
  const [action, setAction] = useState("");
  const [published, setPublished] = useState(lesson?.active);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      switch (action) {
        case "change-active": {
          const updatedActiveState = await changeLessonPublishState(lesson?.id);
          setPublished(!updatedActiveState);
          toast.success("The lesson has been updated");
          break;
        }
        case "delete": {
          if (published) {
            toast.error(
              "A published lesson can not be deleted. First unpublish it, then delete."
            );
          } else {
            await deleteLessonAction(lesson?.id, moduleId);
            onDelete();
            toast.success("Lesson has been deleted successfully");
          }
          break;
        }
        default: {
          throw new Error("Invalid lesson action");
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

export default LessonActions;
