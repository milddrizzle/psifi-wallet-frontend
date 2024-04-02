import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UserAuthForm from "@/components/auth/UserAuthForm";

const page = () => {
  return (
    <div className="w-full mx-auto">
      <MaxWidthWrapper>
        <div className="mx-auto pt-10 pb-8 min-h-screen flex w-full flex-col justify-center space-y-6 sm:w-md">
          <p className="text-3xl font-semibold tracking-tight">Welcome</p>
          <p className="text-xl max-w text-stone-600">Login to start.</p>
          <UserAuthForm />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
