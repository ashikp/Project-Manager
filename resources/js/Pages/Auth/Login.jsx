import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import LoginForm from '@/Components/ui/login-form';

export default function Login({ status, canResetPassword }) {
    return (
        <GuestLayout>
            <Head title="Log in" />
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            <LoginForm canResetPassword={canResetPassword} />
        </GuestLayout>
    );
}
