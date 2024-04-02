import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import RegisterForm from "@/components/register/RegisterForm";

const page = () => {
  return (
    <div className="w-full mx-auto">
      <MaxWidthWrapper>
        <div className="mx-auto pt-10 pb-8 min-h-screen flex w-full flex-col justify-center space-y-6 sm:w-md text-center">
          <p className="text-3xl font-semibold tracking-tight ">Sign up</p>
          <p className="text-xl max-w text-stone-600">Sign up new account</p>
          <RegisterForm />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
