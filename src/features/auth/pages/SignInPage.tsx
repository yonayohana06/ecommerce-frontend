import PageMeta from "@/components/common/PageMeta";
import SignInForm from "../components/SignInForm";
import AuthLayout from "./AuthPageLayout";

export default function SignInPage() {
  return (
    <>
      <PageMeta
        title="Sign In | FastShop Admin"
        description="Sign in to FastShop Admin Dashboard"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
