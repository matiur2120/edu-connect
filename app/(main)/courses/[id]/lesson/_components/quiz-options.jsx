import { Label } from "@/components/ui/label";
export const QuizOptions = ({ currentQuiz, updateAnswer }) => {
  console.log(currentQuiz);
  return (
    <div className="grid md:grid-cols-2 gap-5 mb-6">
      {currentQuiz?.options.map((option) => (
        <div key={option.label}>
          <input
            className="opacity-0 invisible absolute [&:checked_+_label]:bg-green-300"
            type="radio"
            name="answer"
            onChange={(e) =>
              updateAnswer(e, currentQuiz.id, currentQuiz.title, option.label)
            }
            id={`option-${option.label}`}
          />
          <Label
            className="border border-border rounded px-2 py-3 block cursor-pointer hover:bg-gray-50 transition-all font-normal"
            htmlFor={`option-${option.label}`}
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
};
