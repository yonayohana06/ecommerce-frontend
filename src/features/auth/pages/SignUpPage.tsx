import PageMeta from "@/components/common/PageMeta";
import SignUpForm from "../components/SignUpForm";
import AuthLayout from "./AuthPageLayout";

export default function SignUpPage() {
  return (
    <>
      <PageMeta
        title="React.js SignUp Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
