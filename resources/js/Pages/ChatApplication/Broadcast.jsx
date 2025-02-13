import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Broadcast() {
    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('chat.broadcast'), {
            onSuccess: () => reset('message'),
        });
    };

    return (
        <Card>
            <CardContent className="p-4">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <Input
                        value={data.message}
                        onChange={e => setData('message', e.target.value)}
                        placeholder="Type your broadcast message..."
                    />
                    <Button 
                        type="submit" 
                        disabled={processing}
                        className="w-full"
                    >
                        Broadcast Message
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 