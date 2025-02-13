import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import ForgotPasswordForm from '@/Components/ui/forget-password-form';

export default function ForgotPassword({ status }) {
    return (
        <GuestLayout>
            <Head title="Forgot Password" />
            <ForgotPasswordForm status={status} />
        </GuestLayout>
    );
}
