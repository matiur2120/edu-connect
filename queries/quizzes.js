import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Quiz } from "@/model/quiz-model";
import { Quizset } from "@/model/quizset-model";

export async function getAllQuizSets(excludeUnPublished){
    try{
        let quizSets = [];
        if(excludeUnPublished){
            quizSets = await Quizset.find({active: true}).lean();

        }else{
            quizSets = await Quizset.find({}).lean();
        }
        return replaceMongoIdInArray(quizSets);

    }catch(error){
        throw error;
    }
}

export async function getQuizeSetById(id){
    try{
        const quizset = await Quizset.findById(id).populate({
            path: 'quizIds',
            model: Quiz
        }).lean()
        return replaceMongoIdInObject(quizset)

    }catch(error){
        throw error;
    }
}

export async function createQuiz(data){
    try{
        const newQuiz = await Quiz.create(data);
        return await JSON.parse(JSON.stringify(newQuiz));

    }catch(error){
        throw error;
    }
   

}

