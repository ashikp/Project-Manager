import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Receive() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const channel = window.Echo.channel('chat');
        
        channel.listen('.chat-message', (data) => {
            setMessages(prev => [...prev, data.message]);
        });

        return () => {
            channel.stopListening('.chat-message');
        };
    }, []);

    return (
        <Card className="h-[400px]">
            <CardContent className="p-4">
                <ScrollArea className="h-full">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className="rounded-lg bg-muted p-3"
                            >
                                <p className="text-sm">{message}</p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
} 