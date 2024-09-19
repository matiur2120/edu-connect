import { auth } from '@/auth';
import { getUserByEmail } from '@/queries/users';
import 'server-only';

export async function getLoggedInUser(){
   const session = await auth();
   if(!session?.user){
    return null;
   }
   return await getUserByEmail(session?.user?.email);
}