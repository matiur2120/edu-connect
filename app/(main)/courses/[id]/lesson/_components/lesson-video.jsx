"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";
export const LessonVideo = ({ lesson, module, courseId }) => {
  const router = useRouter();
  const [hasWindow, setHasWindow] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);
  useEffect(() => {
    async function updateLessonWatch() {
      const response = await fetch("/api/lesson-watch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          lessonId: lesson.id,
          moduleSlug: module,
          lastTime: 0,
          state: "started",
        }),
      });
      if (response.status === 200) {
        const result = await response.text();
        setStarted(false);
        console.log(result);
      }
    }
    started && updateLessonWatch();
  }, [started]);
  useEffect(() => {
    async function updateLessonWatch() {
      const response = await fetch("/api/lesson-watch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          lessonId: lesson.id,
          moduleSlug: module,
          lastTime: 0,
          state: "completed",
        }),
      });
      if (response.status === 200) {
        const result = await response.text();
        setEnded(false);
        router.refresh();
      }
    }
    ended && updateLessonWatch();
  }, [ended]);
  const handleOnStart = () => {
    setStarted(true);
  };
  const handleOnDuration = (duration) => {
    setDuration(duration);
  };
  const handleOnEnded = () => {
    setEnded(true);
  };
  const handleOnProgress = (state) => {
    console.log("Handle on progress", state);
  };
  return (
    <>
      {hasWindow && (
        <ReactPlayer
          url={lesson?.video_url}
          width="100%"
          height="470px"
          controls={true}
          onStart={handleOnStart}
          onDuration={handleOnDuration}
          onEnded={handleOnEnded}
          onProgress={handleOnProgress}
        />
      )}
    </>
  );
};
