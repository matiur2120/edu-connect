"use client";
import AlertBanner from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Circle, CircleCheck, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { AddQuizForm } from "./add-quiz-form";
import { TitleForm } from "./title-form";
const QuizSet = ({ quizzes, quizSet }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editQuiz, setEditQuiz] = useState({});
  const handleEditQuiz = (quizId) => {
    console.log(quizId);
    const quiz = quizzes.filter((quiz) => quiz._id === quizId);
    setEditQuiz(quiz[0]);
    setIsEdit(true);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 mt-16">
      {/* Quiz List */}
      <div className="max-lg:order-2">
        <h2 className="text-xl mb-6">Quiz List</h2>
        {quizzes.length === 0 && (
          <AlertBanner
            label="No Quiz are in the set, add some using the form above."
            variant="warning"
            className="rounded mb-6"
          />
        )}
        <div className="space-y-6">
          {quizzes.map((quiz) => {
            return (
              <div
                key={quiz._id}
                className=" bg-gray-50 shadow-md p-4 lg:p-6 rounded-md border"
              >
                <h2 className="mb-3">{quiz.question}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quiz.options.map((option) => {
                    return (
                      <div
                        className={cn(
                          "py-1.5 rounded-sm  text-sm flex items-center gap-1 text-gray-600"
                        )}
                        key={option.text}
                      >
                        {option.is_correct ? (
                          <CircleCheck className="size-4 text-emerald-500 " />
                        ) : (
                          <Circle className="size-4" />
                        )}

                        <p>{option.text}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-end gap-2 mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditQuiz(quiz._id)}
                  >
                    <Pencil className="w-3 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    className="text-destructive"
                    variant="ghost"
                  >
                    <Trash className="w-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/*  */}
      <div>
        <div className="flex items-center gap-x-2">
          <h2 className="text-xl">Customize your quiz set</h2>
        </div>
        <div className="max-w-[800px]">
          <TitleForm
            initialData={{
              title: quizSet?.title,
            }}
            quizSetId={quizSet?.id}
          />
        </div>

        <div className="max-w-[800px]">
          <AddQuizForm
            quizSetId={quizSet?.id}
            editQuiz={editQuiz}
            isEdit={isEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizSet;
