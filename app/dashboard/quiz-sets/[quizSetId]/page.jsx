import AlertBanner from "@/components/alert-banner";

import { getQuizeSetById } from "@/queries/quizzes";

import { QuizSetAction } from "./_components/quiz-set-action";

import QuizSet from "./_components/quiz-set";
const quizes = [
  {
    id: 1,
    title: "What is HTML ?",
    options: [
      {
        label: "A programming language",
        isTrue: false,
      },
      {
        label: "A markup language",
        isTrue: true,
      },
      {
        label: "A famous book",
        isTrue: false,
      },
      {
        label: "A famous tv show",
        isTrue: false,
      },
    ],
  },
  {
    id: 2,
    title: "What is Javascript ?",
    options: [
      {
        label: "A programming language",
        isTrue: true,
      },
      {
        label: "A markup language",
        isTrue: false,
      },
      {
        label: "A famous book",
        isTrue: false,
      },
      {
        label: "A famous tv show",
        isTrue: false,
      },
    ],
  },
];
const EditQuizSet = async ({ params: { quizSetId } }) => {
  const quizSet = await getQuizeSetById(quizSetId);
  const quizzes = quizSet?.quizIds;

  console.log(quizzes);
  return (
    <>
      <AlertBanner
        label="This course is unpublished. It will not be visible in the course."
        variant="warning"
      />
      <div className="p-6">
        <div className="flex items-center justify-end">
          <QuizSetAction />
        </div>
        <QuizSet quizzes={quizzes} quizSet={quizSet} />
      </div>
    </>
  );
};
export default EditQuizSet;
