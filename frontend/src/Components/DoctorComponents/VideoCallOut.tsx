import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MdCallEnd } from "react-icons/md"
import { useSocket } from "../../Context/SocketIO"
import { RootState } from "../../Redux/store"
import { endCallDoctor } from "../../Redux/Slice/doctorSlice"

import { Card, CardContent } from "../../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { defaultImg } from "../../assets/profile"

function VideoCallOut() {
    const { videoCall, doctorInfo } = useSelector((state: RootState) => state.doctor)
    const { socket } = useSocket()
    const dispatch = useDispatch()

    useEffect(() => {
        if (videoCall?.type === 'out-going') {
            socket?.emit('outgoing-video-call', {
                to: videoCall.userID,
                from: {
                    _id: doctorInfo?.doctorId,
                    profilePic: videoCall?.doctorImage,
                    name: doctorInfo?.name,
                },
                callType: videoCall.callType,
                roomId: videoCall.roomId
            })
        }
    }, [videoCall, socket, doctorInfo])

    const handleEndCall = () => {
        socket?.emit('reject-call', ({ to: videoCall.userID }))
        dispatch(endCallDoctor())
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="w-96 bg-primary text-primary-foreground">
                <CardContent className="flex flex-col items-center space-y-6 p-6">
                    <div className="text-lg">Calling...</div>
                    <div className="text-3xl font-bold">{videoCall.name}</div>
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={videoCall?.userImage||defaultImg} alt="User profile" />
                        <AvatarFallback>{videoCall?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full w-16 h-16"
                        onClick={handleEndCall}
                    >
                        <MdCallEnd className="text-3xl" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default VideoCallOut