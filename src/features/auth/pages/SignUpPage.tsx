import PageMeta from "@/components/common/PageMeta";
import SignUpForm from "../components/SignUpForm";
import AuthLayout from "./AuthPageLayout";

export default function SignUpPage() {
  return (
    <>
      <PageMeta
        title="Sign Up | FastShop Admin"
        description="Register an account for FastShop Admin Dashboard"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
