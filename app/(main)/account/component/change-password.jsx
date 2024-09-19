"use client";
import { changePassword } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const ChangePassword = ({ email }) => {
  const [passwordState, setPasswordState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmedPassword: "",
  });
  const handleChange = (event) => {
    setPasswordState({
      ...passwordState,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmedPassword) {
      toast.error(`Error: New password and confirmed password did not match`);
      return null;
    }
    try {
      await changePassword(
        email,
        passwordState.oldPassword,
        passwordState.newPassword
      );
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };
  return (
    <div>
      <h5 className="text-lg font-semibold mb-4">Change password :</h5>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <Label className="mb-2 block">Old password :</Label>
            <Input
              type="password"
              placeholder="Old password"
              name="oldPassword"
              required=""
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="mb-2 block">New password :</Label>
            <Input
              type="password"
              placeholder="New password"
              name="newPassword"
              required=""
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="mb-2 block">Re-type New password :</Label>
            <Input
              type="password"
              placeholder="Re-type New password"
              name="confirmedPassword"
              required=""
              onChange={handleChange}
            />
          </div>
        </div>
        {/*end grid*/}
        <Button className="mt-5" type="submit">
          Save password
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
