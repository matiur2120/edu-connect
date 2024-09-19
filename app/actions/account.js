'use server'

import { User } from "@/model/user-model";
import { validPassword } from "@/queries/users";
import bcrypt from 'bcryptjs';
import { revalidatePath } from "next/cache";


export async function updateUserInfo(email, updatedData){
    try{
        const options = {email: email}
        await User.findOneAndUpdate(options, updatedData);
        revalidatePath('/account')
        
    }catch(error){
        throw error
    }
       
}



export async function changePassword(email, oldPassword, newPassword){
    try{
        const isMatch = await validPassword(email, oldPassword)
        if(!isMatch){
            throw new Error('Invalid credentials. Please enter a valid current password')
         }
        const options = {email: email}
        const hashedPassword = await bcrypt.hash(newPassword, 5)
        await User.findOneAndUpdate(options, {password: hashedPassword})
        revalidatePath('/account')
    }catch(error){
        throw error;
    }
}