import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../Redux/store"
import { useSocket } from "../../Context/SocketIO"
import { MdCallEnd, MdCall } from "react-icons/md"
import { endCallUser, setRoomId, setShowVideoCall } from "../../Redux/Slice/userSlice"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"

function UserVideoIn() {
    const { showIncomingVideoCall } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const { socket } = useSocket()

    const handleEndCall = () => {
        socket?.emit('reject-call', ({ to: showIncomingVideoCall?._id }))
        dispatch(endCallUser())
    }

    const handleAcceptCall = () => {
        console.log("showincoming", showIncomingVideoCall)
        socket?.emit('accept-incoming-call', ({ to: showIncomingVideoCall?._id, roomId: showIncomingVideoCall?.roomId }))
        dispatch(setRoomId(showIncomingVideoCall?.roomId))
        dispatch(setShowVideoCall(true))
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="w-96 bg-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle className="text-center">Incoming Video Call</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                    <div className="text-3xl font-bold">{showIncomingVideoCall?.name}</div>
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={showIncomingVideoCall?.profilePic} alt="Caller profile" />
                        <AvatarFallback>{showIncomingVideoCall?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-7">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600"
                            onClick={handleAcceptCall}
                        >
                            <MdCall className="text-3xl" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="rounded-full w-16 h-16"
                            onClick={handleEndCall}
                        >
                            <MdCallEnd className="text-3xl" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserVideoIn