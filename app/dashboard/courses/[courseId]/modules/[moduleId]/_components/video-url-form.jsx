"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateLessonAction } from "@/app/actions/lesson-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VideoPlayer } from "@/components/video-player";
import { convetInHourMinSec } from "@/lib/convertData";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  url: z.string().min(1, {
    message: "Required",
  }),
  duration: z.string().min(1, {
    message: "Required",
  }),
});

export const VideoUrlForm = ({ initialData, courseId, lessonId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [videoData, setVideoData] = useState(initialData);
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: videoData?.video_url,
      duration: convetInHourMinSec(videoData?.duration),
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const payload = {};
      payload["video_url"] = values?.url;
      const duration = values?.duration;
      const spliteed = duration.split(":");
      if (spliteed.length === 3) {
        const durationInSecond =
          Number(spliteed[0]) * 3600 +
          Number(spliteed[1]) * 60 +
          Number(spliteed[2]);
        console.log(durationInSecond);
        payload["duration"] = Number(durationInSecond);
      } else {
        toast.error("Video duration must be hh:mm:ss format");
        return;
      }
      await updateLessonAction(lessonId, payload);

      setVideoData(payload);
      toast.success("Lesson updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video URL
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit URL
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          <p className="text-sm mt-2">{videoData?.video_url}</p>
          <div className="mt-6">
            <VideoPlayer url={videoData?.video_url} />
          </div>
        </>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* url */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Duration</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. '10:30:18'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
