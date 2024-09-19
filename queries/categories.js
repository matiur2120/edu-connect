import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Category } from "@/model/category-model";


export async function getCategories(){
    try{
        const categories = await Category.find({}).lean();
        return replaceMongoIdInArray(categories)
    }catch(error){
        throw error;
    }
}
export async function getCategoryDetailsById(categoryId){
    try{
        const category = await Category.findById(categoryId).lean();
        return replaceMongoIdInObject(category)
    }catch(error){
        throw error;
    }
}