import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/auth/form-input";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useTransition } from "react";

function Login() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  
  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const t: any = async () => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (!data.success) {
          return toast.error(data.error.message);
        }
        navigate("/two-factor");
      } catch (error) {
        toast.error("Something went wrong.");
      }
    }
    startTransition(t);
  });

  return (
    <CardWrapper
      headerTitle="Login"
      headerDescription="Welcome back! Please fill out the form below before logging in."
      backButtonLabel="Don't have an account? Register"
      backButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="e.g. johndoe@example.com"
              isPending={isPending}
            />
            <div>
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="******"
                isPending={isPending}
              />
              <Button
                size="sm"
                variant="link"
                className="-mt-6 p-0 text-xs text-blue-500 w-full justify-end"
                asChild
              >
                <Link to="/reset">Forgot password?</Link>
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default Login;
