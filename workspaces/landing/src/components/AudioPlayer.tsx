import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Shuffle } from 'lucide-react'
import { audioTracks, getRandomTrack, formatTime } from '../lib/audioUtils'
import { useIsMobile } from '../hooks/use-mobile'

const AudioPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(audioTracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const isMobile = useIsMobile()

  const audioRef = useRef<HTMLAudioElement>(null)

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle random track selection
  const handleRandomTrack = () => {
    const newTrack = getRandomTrack(currentTrack.id)
    setCurrentTrack(newTrack)
    setIsPlaying(true)
    // We'll let the loadeddata event trigger the play
  }

  // Update the progress bar as audio plays
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  // Handle seeking when user adjusts the progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Set up audio element and event listeners when track changes
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current

      const handleLoadedData = () => {
        setDuration(audio.duration)
        if (isPlaying) {
          audio.play().catch(err => {
            console.error('Error playing audio:', err)
          })
        }
      }

      const handleEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
      }

      // Set up event listeners
      audio.addEventListener('loadeddata', handleLoadedData)
      audio.addEventListener('timeupdate', updateProgress)
      audio.addEventListener('ended', handleEnded)

      // Clean up event listeners
      return () => {
        audio.removeEventListener('loadeddata', handleLoadedData)
        audio.removeEventListener('timeupdate', updateProgress)
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [currentTrack, isPlaying])

  return (
    <div className="py-2 w-full">
      <div className="flex items-center">
        <button
          onClick={togglePlayPause}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-bible-scripture text-white 
                   shadow-md transition-all duration-300 hover:shadow-lg hover:bg-bible-scripture/90
                   transform hover:scale-105 active:scale-95 mr-3"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-white truncate mr-2 md:text-center md:flex-grow">
              {currentTrack.title}
            </h3>
            <div className="flex items-center text-xs text-white/70">
              <span>{formatTime(currentTime)}</span>
              {!isMobile && (
                <>
                  <span className="mx-1">/</span>
                  <span>{formatTime(duration)}</span>
                </>
              )}
            </div>
          </div>

          <input
            type="range"
            value={currentTime}
            max={duration || 100}
            onChange={handleSeek}
            className="audio-progress w-full"
          />
        </div>

        <button
          onClick={handleRandomTrack}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-bible-scripture text-white
                   transition-all duration-300 hover:bg-bible-scripture/80
                   transform hover:scale-105 active:scale-95 ml-3"
          aria-label="Shuffle to random scripture"
        >
          <Shuffle size={14} />
        </button>
      </div>

      <audio ref={audioRef} src={currentTrack.src} preload="metadata" />
    </div>
  )
}

export default AudioPlayer
