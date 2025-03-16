import { useForm, Head } from '@inertiajs/react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function PasswordPrompt({ file }) {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('files.view', file.id));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Head title="Password Protected File" />
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold mb-4">Password Protected File</h2>
                <p className="text-sm text-muted-foreground mb-4">{file.original_name}</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={processing}>
                        Access File
                    </Button>
                </form>
            </div>
        </div>
    );
} 