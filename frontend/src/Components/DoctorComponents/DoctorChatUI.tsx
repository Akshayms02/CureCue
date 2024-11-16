import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Send, Video } from 'lucide-react'
import doctorAxiosUrl from '../../Utils/doctorAxios';
import { useSocket } from '../../Context/SocketIO';
import { setVideoCall } from '../../Redux/Slice/doctorSlice';
import { useDispatch } from 'react-redux';

const DoctorChatUI = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { appointment } = location.state || {};
    const [newMsg, setNewMsg] = useState("");
    const [newImg, setNewImg] = useState("");
    const [chatHistory, setChatHistory] = useState<any>([]);
    const { socket } = useSocket()
    const dispatch: any = useDispatch()

    const scrollAreaRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                console.log("state", appointment)
                const response = await doctorAxiosUrl.get(`/api/chat/fetchTwoMembersChat`, {
                    params: {
                        doctorID: appointment?.doctorId,
                        userID: appointment?.userId,
                        sender: "doctor"
                    }
                });
                setChatHistory(response.data.chatResult.messages);
                setNewImg(response.data.signedDoctorImageUrl)

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
            setChatHistory(messageDetails.messages);
        });

        return () => {
            socket.off("receiveMessage");
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
                console.log(appointment)
                const messageDetails = {
                    senderID: appointment?.doctorId,
                    receiverID: appointment?.userId,
                    message: newMsg,
                    sender: "doctor"
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

    const handleVideoCall = () => {
        dispatch(setVideoCall({
            appointmentId: appointment._id,
            userID: appointment?.userId,
            type: "out-going",
            callType: "video",
            roomId: Date.now(),
            userImage: chatHistory?.signedUserImageUrl,
            doctorImage: chatHistory?.signedDoctorImageUrl,
            name: chatHistory?.user?.name,

        }))
    };

    return (
        <Card className="w-full max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col mt-6 shadow-2xl">
            <CardHeader className="border-b">
                <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center space-x-4" ref={scrollAreaRef}>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="Patient" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold">{appointment?.patientName}</h2>
                            <p className="text-sm text-muted-foreground">Online</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={handleVideoCall}>
                            <Video className="h-4 w-4" />
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <div className="h-full pr-4 overflow-auto" ref={scrollAreaRef}>
                    {chatHistory?.length > 0 ? (
                        chatHistory.map((chat: any, index: number) => (
                            <div key={index} className={`flex ${chat.sender === "doctor" ? "justify-end" : "justify-start"} mb-4`}>
                                <div className={`flex ${chat.sender === "doctor" ? "flex-row-reverse" : "flex-row"} items-end`}>
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={chat.sender === "doctor" ? newImg : "P"} alt={`${chat.sender} profile`} />
                                        <AvatarFallback>{chat.sender === "doctor" ? "D" : "P"}</AvatarFallback>
                                    </Avatar>
                                    <div className={`mx-2 py-2 px-3 rounded-lg ${chat.sender === "doctor"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-secondary-foreground"
                                        }`}>
                                        <p>{chat.message}</p>
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
                        placeholder="Type your message..."
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
};

export default DoctorChatUI;