import { replaceMongoIdInObject } from "@/lib/convertData";
import { User } from "@/model/user-model";
import bcrypt from 'bcryptjs';

export async function getUserByEmail(email){
    const user = await User.findOne({email: email}).select('-password').lean();
    return replaceMongoIdInObject(user)
}

export async function getUserDetailsById(userId){
    const user = await User.findById(userId).select('-password').lean();
    return replaceMongoIdInObject(user);
}


export async function validPassword(email, oldPassword){
    const user = await getUserByEmail(email);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    return isMatch;
}