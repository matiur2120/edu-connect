"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

import { addQuizAssesment } from "@/app/actions/quiz-actions";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QuizOptions } from "./quiz-options";
import { QuizQuestion } from "./quiz-question";
function QuizModal({ quizzes, open, handleSetOpen, courseId, quizSetId }) {
  const router = useRouter();
  const totalQuizes = quizzes?.length;
  const [quizIndex, setQuizIndex] = useState(0);
  const lastQuizIndex = totalQuizes - 1;
  const currentQuiz = quizzes[quizIndex];
  const [answers, setAnswers] = useState([]);

  // change quiz
  const quizChangeHanlder = (type) => {
    const nextQuizIndex = quizIndex + 1;
    const prevQuizIndex = quizIndex - 1;
    if (type === "next" && nextQuizIndex <= lastQuizIndex) {
      console.log("next");
      return setQuizIndex((prev) => prev + 1);
    }
    if (type === "prev" && prevQuizIndex >= 0) {
      setQuizIndex((prev) => prev - 1);
    }
  };

  const updateAnswer = (e, quizId, quizTitle, selected) => {
    const key = e.target.name;
    const checked = e.target.checked;
    const obj = {};
    if (checked) {
      obj["option"] = selected;
    }
    const answer = {
      quizId,
      options: [obj],
    };
    const found = answers.find((q) => q.quizId === answer.quizId);
    if (found) {
      const filtered = answers.filter((q) => q.quizId !== answer.quizId);
      setAnswers([...filtered, answer]);
    } else {
      setAnswers([...answers, answer]);
    }
  };

  const quizSubmit = async () => {
    try {
      await addQuizAssesment(courseId, quizSetId, answers);
      handleSetOpen(false);
      router.refresh();
      toast.success("Thanks for submitting the quiz.");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={handleSetOpen}>
        <DialogContent className="sm:max-w-[95%] block">
          <div className="pb-4 border-b border-border text-sm">
            <span className="text-success inline-block mr-1">
              {quizIndex + 1} / {totalQuizes}
            </span>{" "}
            টি প্রশ্ন
          </div>
          <QuizQuestion currentQuiz={currentQuiz} />
          <QuizOptions currentQuiz={currentQuiz} updateAnswer={updateAnswer} />
          <DialogFooter className="flex gap-4 justify-between w-full sm:justify-between">
            <Button
              className="gap-2 rounded-3xl"
              disabled={quizIndex === 0}
              onClick={() => quizChangeHanlder("prev")}
            >
              <ArrowLeft /> Previous Quiz
            </Button>
            <Button
              className="gap-2 rounded-3xl"
              type="submit"
              onClick={quizSubmit}
            >
              Submit
            </Button>
            <Button
              className="gap-2 rounded-3xl"
              disabled={quizIndex >= lastQuizIndex}
              onClick={() => quizChangeHanlder("next")}
            >
              Next Quiz <ArrowRight />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default QuizModal;
