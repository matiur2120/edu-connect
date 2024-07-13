import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";

export const EnrollCourse = ({ asLink }) => {
  const formAction = async (formData) => {
    console.log(formData);
  };
  return (
    <>
      <form action="formAction">
        {asLink ? (
          <Button
            variant="ghost"
            type="submit"
            className="text-xs text-sky-700 h-7 gap-1"
          >
            Enroll
            <ArrowRight className="w-3" />
          </Button>
        ) : (
          <Button type="submit" className={cn(buttonVariants({ size: "lg" }))}>
            Enroll Now
          </Button>
        )}
      </form>
    </>
  );
};
