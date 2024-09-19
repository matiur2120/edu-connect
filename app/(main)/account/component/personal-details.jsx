"use client";
import { updateUserInfo } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";
import { toast } from "sonner";
const PersonalDetails = ({ userInfo }) => {
  const [infoState, setInfoState] = useState({
    firstName: userInfo?.firstName,
    lastName: userInfo?.lastName,
    email: userInfo?.email,
    bio: userInfo?.bio,
    designation: userInfo?.designation,
  });
  const handleChange = (e) => {
    setInfoState({
      ...infoState,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserInfo(infoState.email, infoState);
      toast.success("User profile updated successfully");
    } catch (error) {
      toast.error(`Error: ${error?.message}`);
      console.log(error);
    }
  };
  return (
    <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
      <h5 className="text-lg font-semibold mb-4">Personal Detail :</h5>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <div>
            <Label className="mb-2 block">
              First Name : <span className="text-red-600">*</span>
            </Label>
            <Input
              type="text"
              placeholder="First Name:"
              id="firstname"
              name="firstName"
              required
              value={infoState?.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="mb-2 block">
              Last Name : <span className="text-red-600">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Last Name:"
              name="lastName"
              value={infoState?.lastName}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="mb-2 block">
              Your Email : <span className="text-red-600">*</span>
            </Label>
            <Input
              type="email"
              placeholder="Email"
              value={infoState?.email}
              name="email"
              disabled
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="mb-2 block">Bio :</Label>
            <Input
              name="bio"
              id="bio"
              type="text"
              value={infoState?.bio}
              placeholder="Bio"
              onChange={handleChange}
            />
          </div>
        </div>
        {/*end grid*/}
        <div className="grid grid-cols-1">
          <div className="mt-5">
            <Label className="mb-2 block">Designation :</Label>
            <Textarea
              id="designation"
              name="designation"
              value={infoState?.designation}
              placeholder="Designation :"
              onChange={handleChange}
            />
          </div>
        </div>
        {/*end row*/}
        <Button className="mt-5 cursor-pointer" asChild>
          <input type="submit" name="send" value="Save Changes" />
        </Button>
      </form>
      {/*end form*/}
    </div>
  );
};

export default PersonalDetails;
