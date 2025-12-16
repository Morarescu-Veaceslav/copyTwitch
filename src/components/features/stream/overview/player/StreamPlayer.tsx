import { useTracks } from "@livekit/components-react"
import { RemoteParticipant, Track } from "livekit-client"
import { useEffect, useRef, useState } from "react"
import { VolumeControl } from "./VolumeControl"
import { useEventListener } from 'usehooks-ts'
import { FullScreenControll } from "./FullScreenControll"
interface StreamPlayerProps {
    participant: RemoteParticipant
}

export function StreamPlayer({ participant }: StreamPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [volume, setVolume] = useState(0)
    const [isFullScreen, setIsFullScreen] = useState(false)

    function onValumeChange(value: number) {
        setVolume(+value)

        if (videoRef.current) {
            videoRef.current.muted = value === 0,
                videoRef.current.volume = +value * 0.01
        }
    }

    function toggleMute() {
        const isMuted = volume === 0

        setVolume(isMuted ? 50 : 0)

        if (videoRef.current) {
            videoRef.current.muted = !isMuted,
                videoRef.current.volume = isMuted ? 0.5 : 0
        }
    }

    useEffect(() => {
        onValumeChange(0)
    }, [])


    function toggleFullScreen() {
        if (isFullScreen) {
            document.exitFullscreen()
        } else if (wrapperRef.current) {
            wrapperRef.current.requestFullscreen()
        }
    }

    function handleFullScreenChange() {
        const isCurrntlyFullScreen = document.fullscreenElement !== null
        setIsFullScreen(isCurrntlyFullScreen)
    }

    useEventListener('fullscreenchange' as keyof WindowEventMap, handleFullScreenChange)


    useTracks([Track.Source.Camera, Track.Source.Microphone]).filter(
        track => track.participant.identity === participant.identity
    ).forEach(track => {
        if (videoRef.current) {
            track.publication.track?.attach(videoRef.current)
        }
    })


    return <div ref={wrapperRef} className='relative flex h-full'>
        <video ref={videoRef} />
        <div className='absolute top-0 h-full w-full opacity-0 hover:opacity-100'>
            <div className='absolute bottom-0 flex h-16  w-full items-center justify-between px-4'>
                <VolumeControl onToggle={toggleMute} onChange={onValumeChange} value={volume} />
                <FullScreenControll isFullScreen={isFullScreen} onToggle={toggleFullScreen} />
            </div>
        </div>
    </div>
}