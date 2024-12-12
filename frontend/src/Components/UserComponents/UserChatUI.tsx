import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Send } from 'lucide-react'
import { useSocket } from '../../Context/SocketIO';
import { format } from 'date-fns';
import { fetchTwoMembersChat } from '../../services/userServices';

function UserChatUI() {
    const location = useLocation();
    const navigate = useNavigate();
    const { appointment } = location.state || {};
    const [newMsg, setNewMsg] = useState("");
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [doc, setDoc] = useState<any>()

    const { socket } = useSocket()
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const doctorId = appointment?.doctorId
                const userId = appointment?.userId
                const response = await fetchTwoMembersChat(doctorId, userId)
                console.log("response", response)
                setChatHistory(response?.data?.chatResult.messages);
                setDoc(response?.data)
                socket.emit("joinChatRoom", {
                    doctorID: appointment?.doctorId,
                    userID: appointment?.userId
                });
            } catch (error: any) {
                if (error.response?.status === 401) {
                    navigate("/login", { state: { message: "Authorization failed, please login" } });
                } else {
                    toast.error("Something went wrong, Can't fetch chat history. Please try again later");
                }
            }
        };

        fetchChatHistory();

        socket.on("receiveMessage", (messageDetails: any) => {
            console.log("hooooooo", messageDetails)
            setChatHistory(messageDetails.messages);
        });

        socket.on('connection', () => {
            console.log('Client connected');
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("connection");
        };
    }, [appointment, navigate]);

    useEffect(() => {
        console.log("SOCKKK", socket)
        if (socket) {
            socket?.emit("joinChatRoom", { doctorID: appointment?.doctorId, userID: appointment?.userId, online: "USER" });

        }
    }, [socket])

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const sendMessage = (newMsg: string) => {
        if (newMsg.trim()) {
            try {
                const messageDetails = {
                    senderID: appointment?.userId,
                    receiverID: appointment?.doctorId,
                    message: newMsg,
                    sender: "user"
                };
                socket.emit("sendMessage", { messageDetails });
                setNewMsg("");
            } catch (error: any) {
                if (error.response?.status === 401) {
                    navigate("/login", { state: { message: "Authorization failed, please login" } });
                } else {
                    toast.error("Something went wrong, please try again later");
                }
            }
        }
    };

    return (
        <Card className="w-[75%] mt-0 mx-auto h-[650px] flex flex-col shadow-2xl">
            <CardHeader className="border-b">
                <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={doc?.signedDoctorImageUrl
                            } alt="Doctor" />
                            <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold">{appointment.doctor.name}</h2>
                            <p className="text-sm text-muted-foreground">Online</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">

                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <div className="h-full pr-4 overflow-auto scrollbar rounded-lg" ref={scrollAreaRef}>
                    {chatHistory?.length > 0 ? (
                        chatHistory.map((chat: any, index: number) => (
                            <div key={index} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
                                <div className={`flex ${chat.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end`}>
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={chat.sender === "user" ? chat.profileImage : doc.signedDoctorImageUrl} alt={`${chat.sender} profile`} />
                                        <AvatarFallback>{chat.sender === "user" ? "U" : "D"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col mx-2">
                                        <div className={`py-2 px-3 rounded-lg ${chat.sender === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground"
                                            }`}>
                                            <p>{chat.message}</p>
                                        </div>
                                        <span className={`text-xs mt-1 ${chat.sender === "user" ? "text-right" : "text-left"
                                            } text-muted-foreground`}>
                                            {format(new Date(chat.createdAt), 'MMM d, yyyy h:mm a')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground">No messages yet...</p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="border-t">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(newMsg); }} className="flex w-full items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Write your message!"
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        className="flex-grow"
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}

export default UserChatUI;