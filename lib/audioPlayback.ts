import { Audio } from "expo-av";

let activeSound: Audio.Sound | null = null;

export async function stopActivePlayback() {
  if (!activeSound) return;
  await activeSound.stopAsync();
  await activeSound.unloadAsync();
  activeSound = null;
}

export async function playAudio(uri: string) {
  await stopActivePlayback();

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: false,
    playThroughEarpieceAndroid: false,
  });

  const { sound } = await Audio.Sound.createAsync(
    { uri },
    { shouldPlay: true }
  );

  activeSound = sound;

  return {
    pause: async () => {
      if (!activeSound) return;
      await activeSound.pauseAsync();
    },
    resume: async () => {
      if (!activeSound) return;
      await activeSound.playAsync();
    },
    stop: async () => {
      await stopActivePlayback();
    },
  };
}
