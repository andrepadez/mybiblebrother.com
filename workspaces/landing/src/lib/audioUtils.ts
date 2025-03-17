
// List of available scripture readings and meditations
export const audioTracks = [
  {
    title: 'Genesis 1:1',
    src: '/audios/00000001-Genesis-1_1.mp3',
    id: 1,
  },
  {
    title: 'Genesis 1:2',
    src: '/audios/00000002-Genesis-1_2.mp3',
    id: 2,
  },
  {
    title: 'Genesis 1:3',
    src: '/audios/00000003-Genesis-1_3.mp3',
    id: 3,
  },
  {
    title: 'Genesis 1:4',
    src: '/audios/00000004-Genesis-1_4.mp3',
    id: 4,
  },
]

// Get a random track from the list
export const getRandomTrack = (excludeId?: number) => {
  const availableTracks = excludeId
    ? audioTracks.filter(track => track.id !== excludeId)
    : audioTracks;

  const randomIndex = Math.floor(Math.random() * availableTracks.length);
  return availableTracks[randomIndex];
};

// Format time from seconds to MM:SS
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};
