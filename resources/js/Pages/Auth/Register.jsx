import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import RegisterForm from '@/Components/ui/register-form';

export default function Register() {
    return (
        <GuestLayout>
            <Head title="Register" />
            <RegisterForm />
        </GuestLayout>
    );
}
