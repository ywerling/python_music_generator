"use strict";

let audioContext = null;
let leftOscillator = null;
let rightOscillator = null;
let masterGain = null;

const baseFrequencyInput = document.getElementById("baseFrequency");
const beatFrequencyInput = document.getElementById("beatFrequency");
const volumeInput = document.getElementById("volume");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const statusElement = document.getElementById("status");

function getSettings() {
  const baseFrequency = Number(baseFrequencyInput.value);
  const beatFrequency = Number(beatFrequencyInput.value);
  const volume = Number(volumeInput.value);

  if (!Number.isFinite(baseFrequency) || baseFrequency < 20) {
    throw new Error("Base frequency must be at least 20 Hz.");
  }

  if (!Number.isFinite(beatFrequency) || beatFrequency <= 0) {
    throw new Error("Beat frequency must be greater than 0 Hz.");
  }

  if (!Number.isFinite(volume) || volume < 0 || volume > 0.2) {
    throw new Error("Volume must be between 0 and 0.2.");
  }

  return {
    baseFrequency,
    beatFrequency,
    volume
  };
}

async function startBinauralBeat() {
  if (audioContext) {
    return;
  }

  const { baseFrequency, beatFrequency, volume } = getSettings();

  audioContext = new AudioContext();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  leftOscillator = audioContext.createOscillator();
  rightOscillator = audioContext.createOscillator();

  const leftGain = audioContext.createGain();
  const rightGain = audioContext.createGain();
  const channelMerger = audioContext.createChannelMerger(2);

  masterGain = audioContext.createGain();

  leftOscillator.type = "sine";
  rightOscillator.type = "sine";

  leftOscillator.frequency.value = baseFrequency;
  rightOscillator.frequency.value = baseFrequency + beatFrequency;

  leftGain.gain.value = 1;
  rightGain.gain.value = 1;
  masterGain.gain.value = volume;

  leftOscillator.connect(leftGain);
  rightOscillator.connect(rightGain);

  leftGain.connect(channelMerger, 0, 0);
  rightGain.connect(channelMerger, 0, 1);

  channelMerger.connect(masterGain);
  masterGain.connect(audioContext.destination);

  leftOscillator.start();
  rightOscillator.start();

  startButton.disabled = true;
  stopButton.disabled = false;
  statusElement.textContent =
    `Playing: ${baseFrequency} Hz left, ` +
    `${baseFrequency + beatFrequency} Hz right`;
}

async function stopBinauralBeat() {
  if (!audioContext) {
    return;
  }

  const context = audioContext;
  const left = leftOscillator;
  const right = rightOscillator;
  const gain = masterGain;
  const now = context.currentTime;

  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

  left.stop(now + 0.12);
  right.stop(now + 0.12);

  await new Promise((resolve) => setTimeout(resolve, 150));
  await context.close();

  audioContext = null;
  leftOscillator = null;
  rightOscillator = null;
  masterGain = null;

  startButton.disabled = false;
  stopButton.disabled = true;
  statusElement.textContent = "Stopped";
}

startButton.addEventListener("click", async () => {
  try {
    await startBinauralBeat();
  } catch (error) {
    console.error(error);
    statusElement.textContent = error.message;
  }
});

stopButton.addEventListener("click", async () => {
  try {
    await stopBinauralBeat();
  } catch (error) {
    console.error(error);
    statusElement.textContent = "Unable to stop the audio.";
  }
});

volumeInput.addEventListener("input", () => {
  if (!audioContext || !masterGain) {
    return;
  }

  masterGain.gain.setTargetAtTime(
    Number(volumeInput.value),
    audioContext.currentTime,
    0.02
  );
});