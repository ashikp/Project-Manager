import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function ForgotPasswordForm({ className, status, ...props }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={submit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email to reset your password
                </p>
              </div>

              {status && (
                <div className="text-sm font-medium text-green-600">
                  {status}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  autoComplete="username"
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="m@example.com"
                />
                <InputError message={errors.email} className="mt-2" />
              </div>

              <Button type="submit" className="w-full" disabled={processing}>
                Email Password Reset Link
              </Button>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href={route('login')} className="underline underline-offset-4">
                  Back to login
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/img/placeholder.svg"
              alt="Forgot Password"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 