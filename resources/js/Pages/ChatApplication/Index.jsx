import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useForm } from '@inertiajs/react';
import axios from 'axios';

export default function ChatIndex({ user, users, messages: initialMessages }) {
    const [messages, setMessages] = useState(initialMessages || []);
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [selectedUser, setSelectedUser] = useState(null);
    const messagesEndRef = useRef(null);
    
    const { data, setData, post, processing, reset } = useForm({
        message: '',
        recipient_id: '',
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setFilteredUsers(users.filter(u => 
            u.name.toLowerCase().includes(searchTerm) || 
            u.email.toLowerCase().includes(searchTerm)
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.message.trim()) return;

        axios.post(route('chat.broadcast'), {
            message: data.message,
            recipient_id: selectedUser.id
        }).then(response => {
            reset('message');
            setMessages(prev => [...prev, response.data.message]);
            scrollToBottom();
        });
    };

    useEffect(() => {
        if (!selectedUser) return;

        const channel = window.Echo.private(`servudemo`);
        
        console.log('Subscribing to servudemo channel');
        
        channel.subscribed(() => {
            console.log('Successfully subscribed to servudemo channel');
        }).error((error) => {
            console.error('Channel subscription error:', error);
        });
        
        const handleMessage = (event) => {
            console.log('Received message event:', event);
            const newMessage = event.message;
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
        };

        channel.listen('.message.sent', handleMessage);
        
        return () => {
            console.log('Cleaning up channel subscription');
            channel.stopListening('.message.sent');
        };
    }, [selectedUser, user.id]);

    const getFilteredMessages = () => {
        if (!selectedUser) return [];
        return messages.filter(
            msg => (msg.sender_id === user.id && msg.recipient_id === selectedUser.id) ||
                  (msg.sender_id === selectedUser.id && msg.recipient_id === user.id)
        );
    };

    return (
        <AuthenticatedLayout header={{ title: "Chats" }}>
            <Head title="Chat" />
            <div className="flex h-[calc(100vh-4rem)] bg-white">
                {/* Sidebar */}
                <div className="w-80 border-r">
                    <div className="p-4 border-b">
                        <Input 
                            placeholder="Search users..." 
                            className="w-full"
                            onChange={handleSearch}
                        />
                    </div>
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                        <div className="space-y-2 p-4">
                            {filteredUsers.map((chatUser) => (
                                <Card 
                                    key={chatUser.id} 
                                    className={`cursor-pointer hover:bg-muted ${
                                        selectedUser?.id === chatUser.id ? 'bg-muted' : ''
                                    }`}
                                    onClick={() => {
                                        setSelectedUser(chatUser);
                                        setData('recipient_id', chatUser.id);
                                    }}
                                >
                                    <CardContent className="p-4 flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-medium">
                                                {chatUser.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{chatUser.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {chatUser.email}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <>
                            <div className="p-4 border-b flex items-center space-x-4 bg-white">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-medium">
                                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium">{selectedUser.name}</h2>
                                    <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {getFilteredMessages().map((message, index) => (
                                        <div 
                                            key={index}
                                            className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] rounded-lg p-3 ${
                                                message.sender_id === user.id 
                                                    ? 'bg-primary text-primary-foreground' 
                                                    : 'bg-muted'
                                            }`}>
                                                <p className="text-sm">{message.message}</p>
                                                <p className="text-xs opacity-70 mt-1">
                                                    {new Date(message.created_at).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t bg-white">
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="submit" disabled={processing}>
                                        Send
                                    </Button>
                                </form>
                            </div>
                        </>
                    ): ''}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}