import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";
import { getCourseDetails } from "@/queries/courses";
import { enrollForCourse } from "@/queries/enrollments";
import { getUserByEmail } from "@/queries/users";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const Success = async ({ searchParams: { session_id, courseId } }) => {
  if (!session_id)
    throw new Error("Please provide a valid session id that start with cs_");
  const userSession = await auth();
  if (!userSession?.user?.email) {
    redirect("/login");
  }
  const course = await getCourseDetails(courseId);
  const loggedInUser = await getUserByEmail(userSession?.user?.email);
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });
  const customerName = `${loggedInUser?.firstName} ${loggedInUser?.lastName}`;
  const customerEmail = loggedInUser?.email;
  const courseName = course?.title;
  const paymentIntent = checkoutSession?.payment_intent;
  const paymentStatus = paymentIntent?.status;
  const instructorName = `${course?.instructor?.firstName} ${course?.instructor?.lastName}`;
  const instructorEmail = course?.instructor?.email;

  //Prepare email
  const emailData = [
    {
      to: instructorEmail,
      subject: `New enrolllment for ${course?.title}`,
      html: `
    <p>
        Congratulations ${instructorName}. A new student ${customerName} has enrolled to your course ${course?.title} just now. Please check the instructor dashboard and give a high-five to your new student., 
    </p>`,
    },
    {
      to: customerEmail,
      subject: `Enrollment success for ${course?.title}`,
      html: `
      <p>
         Hey ${customerName} you have successfully enrolled for the course ${course?.title}
      </p>`,
    },
  ];

  // const emailsToSend = [
  //   {
  //     to: instructorEmail,
  //     subject: `New enrolllment for ${course?.title}`,
  //     message: `Congratulations ${instructorName}. A new student ${customerName} has enrolled to your course ${course?.title} just now. Please check the instructor dashboard and give a high-five to your new student.`,
  //   },
  //   {
  //     to: customerEmail,
  //     subject: `Enrollment success for ${course?.title}`,
  //     message: `Hey ${customerName} you have successfully enrolled for the course ${course?.title}`,
  //   },
  // ];

  if (paymentStatus === "succeeded") {
    //Update DB(Enrollment collection)
    await enrollForCourse(course?.id, loggedInUser?.id, "stripe");
    // send email the student, instructor and the person who  paid
    //** Email with nodeWithNodemailer work properly just comments out the below code. */
    // await emailWithNodemailer(emailData);
  }
  return (
    <div className="h-full w-full flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-[600px] text-center">
        {paymentStatus === "succeeded" && (
          <>
            <CircleCheck className="w-32 h-32 bg-success rounded-full p-0 text-green-600" />
            <h1 className="text-xl md:text-2xl lg:text-3xl">
              Congratulations!, <strong>{customerName}</strong> Your Enrollment
              was Successful for
              <strong> {courseName}</strong>
            </h1>
          </>
        )}

        <div className="flex items-center gap-3">
          <Button asChild size="sm">
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/courses/${courseId}/lesson`}>Play Course</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Success;
