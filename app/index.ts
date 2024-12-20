import { off, on, useState, useWatch } from "./hooks";
import { LocalStorageKeys } from "./configs";
import {
  Song,
  Line,
  lyricElement,
  audioElement,
  currentTimeElement,
  durationElement,
  playElement,
  progressContainerElement,
  progressBarElement,
  progressThumbElement,
  songElement,
  songsElement,
  volumeContainerElement,
  volumeBarElement,
  volumeThumbElement,
  volumeButtonElement,
} from "./components";

type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  artworkPath: string;
  lyricsPath: string;
  audioPath: string;
};

type Line = {
  text: string;
  time: {
    total: number;
    minutes: number;
    seconds: number;
    hundredths: number;
  };
  ref?: HTMLLIElement;
};

type Lyric = {
  lines: Line[];
};

const state = useState({
  selectedSong: {} as Song,
  duration: 0,
  currentTime: 0,
  nextCurrentTime: 0,
  volume: 1,
  currentLineIndex: -1,
  nextLineTime: Number.MAX_SAFE_INTEGER,
  lyric: { lines: [] } as Lyric,
  isPlaying: false,
  isHandlingProgress: false,
  isHandlingVolume: false,
});

on(audioElement, "loadedmetadata", () => {
  state.duration = audioElement.duration;
});

on(audioElement, "timeupdate", () => {
  state.currentTime = audioElement.currentTime;
});

on(playElement, "click", () => {
  state.isPlaying ? pause() : play();
});

on(progressContainerElement, "click", (event) => {
  const { lines } = state.lyric;
  const { width } = progressContainerElement.getBoundingClientRect();
  const { offsetX } = event;
  const newTime = (state.duration * offsetX) / width;
  const nextLineIndex = lines.findIndex((line) => line.time.total >= newTime);

  state.currentLineIndex = nextLineIndex - 1;
  state.nextLineTime = lines[nextLineIndex]?.time.total;

  audioElement.currentTime = newTime;
});

on(volumeButtonElement, "click", () => {
  if (state.volume !== 0) {
    state.volume = 0;
  } else {
    state.volume = Number(localStorage.getItem(LocalStorageKeys.VOLUME));
  }
});

on(volumeContainerElement, "click", (event) => {
  const { width } = volumeContainerElement.getBoundingClientRect();
  const { offsetX } = event;
  const newVolume = offsetX / width;

  state.volume = newVolume;
  volumeBarElement.style.width = `${newVolume * 100}%`;
  handleVolueStorage();
});

on(document, "mousedown", handleProgressMousedown);
on(document, "mousedown", handleVolumeMousedown);

useWatch(state, "duration", (duration) => {
  durationElement.innerHTML = formatTime(duration);
  currentTimeElement.innerHTML = formatTime(state.currentTime);
});

useWatch(state, "isPlaying", (isPlaying) => {
  playElement.innerHTML = isPlaying
    ? '<i class="ph-fill ph-pause"></i>'
    : '<i class="ph-fill ph-play"></i>';
});

useWatch(state, "currentTime", (newTime, oldTime) => {
  currentTimeElement.innerHTML = formatTime(newTime);
  progressBarElement.style.width = `${(newTime / state.duration) * 100}%`;

  const { lines } = state.lyric;

  if (newTime >= oldTime) {
    if (newTime >= state.nextLineTime) {
      state.currentLineIndex++;
      state.nextLineTime = lines[state.currentLineIndex + 1].time.total;
    }
  } else {
    const nextLineIndex = lines.findIndex((line) => line.time.total > newTime);

    state.currentLineIndex = nextLineIndex - 1;
    state.nextLineTime = lines[nextLineIndex].time.total;
  }
});

useWatch(state, "currentLineIndex", (value) => {
  state.lyric.lines.forEach((line, index) => {
    line.ref?.classList.remove("text-white");
    line.ref?.classList.remove("text-white/60");

    if (index < value) {
      line.ref?.classList.add("text-white/60");
    }
  });

  const currentLine = state.lyric.lines[value];

  currentLine?.ref?.classList.add("text-white");
  currentLine?.ref?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
});

useWatch(state, "volume", (value) => {
  volumeBarElement.style.width = `${value * 100}%`;

  if (value === 0) {
    volumeButtonElement.innerHTML = '<i class="ph ph-speaker-simple-none"></i>';
  } else if (value <= 0.5) {
    volumeButtonElement.innerHTML = '<i class="ph ph-speaker-simple-low"></i>';
  } else {
    volumeButtonElement.innerHTML = '<i class="ph ph-speaker-simple-high"></i>';
  }

  audioElement.volume = value;
});

useWatch(state, "isHandlingProgress", (value) => {
  if (value) {
    progressThumbElement.classList.add("!block");
  } else {
    progressThumbElement.classList.remove("!block");
  }
});

useWatch(state, "isHandlingVolume", (value) => {
  if (value) {
    volumeThumbElement.classList.add("!block");
  } else {
    volumeThumbElement.classList.remove("!block");
  }
});

useWatch(state, "selectedSong", async (song) => {
  songElement.replaceChildren(Song({ ...song, static: true }));
  audioElement.src = song.audioPath + "?t=" + Date.now();
  play();

  const lyric = await loadLyric(song.lyricsPath);

  state.lyric = lyric;
  state.nextLineTime = state.lyric.lines[0].time.total;
});

useWatch(state, "lyric", ({ lines }) => {
  lyricElement.replaceChildren();
  lines.forEach((line, index) => {
    const lineElement = Line(
      { text: line.text },
      {
        click() {
          state.currentLineIndex = index;
          audioElement.currentTime = line.time.total;
          state.nextLineTime = lines[index + 1].time.total;
        },
      }
    );

    line.ref = lineElement;
    lyricElement.appendChild(lineElement);
  });
});

async function loadSongs() {
  const response = await fetch("/songs");
  const songs = (await response.json()) as Song[];

  return songs;
}

async function loadLyric(url: string): Promise<Lyric> {
  const response = await fetch(url);
  const lines = (await response.json()) as Line[];

  return { lines };
}

function formatTime(time: number) {
  const milliseconds = time * 1000;
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

  return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
}

function play() {
  state.isPlaying = true;
  audioElement.play();
}

function pause() {
  state.isPlaying = false;
  audioElement.pause();
}

function handleVolueStorage() {
  localStorage.setItem(LocalStorageKeys.VOLUME, String(state.volume));
}

function handleProgressMousedown(event: MouseEvent) {
  if (event.target === progressThumbElement) {
    on(document, "mousemove", handleProgressMousemove);
    on(document, "mouseup", handleProgressMouseup);
  }
}

function handleProgressMousemove({ clientX: pX }: MouseEvent) {
  state.isHandlingProgress = true;

  const {
    left: cLeft,
    right: cRight,
    width: cWidth,
  } = progressContainerElement.getBoundingClientRect();

  if (pX <= cLeft) {
    state.nextCurrentTime = 0;
  } else if (pX >= cRight) {
    state.nextCurrentTime = state.duration;
  } else {
    const barWidth = ((pX - cLeft) * 100) / cWidth;
    progressBarElement.style.width = `${barWidth}%`; // deixar isso a cargo do proxy?
    const newTime = ((pX - cLeft) * state.duration) / cWidth;
    state.nextCurrentTime = newTime;
  }
}

function handleProgressMouseup() {
  state.isHandlingProgress = false;
  const { lines } = state.lyric;

  let nextLineIndex = lines.findIndex(
    (line) => line.time.total >= state.nextCurrentTime
  );

  if (nextLineIndex < 0) {
    nextLineIndex = lines.length;
  }

  state.currentLineIndex = nextLineIndex - 1;
  state.nextLineTime = lines[nextLineIndex]?.time.total;
  audioElement.currentTime = state.nextCurrentTime;

  off(document, "mousemove", handleProgressMousemove);
  off(document, "mouseup", handleProgressMouseup);
}

function handleVolumeMousedown(event: MouseEvent) {
  if (event.target === volumeThumbElement) {
    on(document, "mousemove", handleVolumeMousemove);
    on(document, "mouseup", handleVolumeMouseup);
  }
}

function handleVolumeMousemove({ clientX: pX }: MouseEvent) {
  state.isHandlingVolume = true;

  const {
    left: cLeft,
    right: cRight,
    width: cWidth,
  } = volumeContainerElement.getBoundingClientRect();

  if (pX <= cLeft) {
    state.volume = 0;
  } else if (pX >= cRight) {
    state.volume = 1;
  } else {
    const barWidth = ((pX - cLeft) * 100) / cWidth;
    volumeBarElement.style.width = `${barWidth}%`; // deixar isso a cargo do proxy?
    const newVolume = (pX - cLeft) / cWidth;
    state.volume = newVolume;
  }
}

function handleVolumeMouseup() {
  audioElement.volume = state.volume;
  state.isHandlingVolume = false;

  handleVolueStorage();
  off(document, "mousemove", handleVolumeMousemove);
  off(document, "mouseup", handleVolumeMouseup);
}

async function init() {
  try {
    const songs = await loadSongs();

    songs.forEach((song) => {
      const songElement = Song(song, {
        click() {
          state.selectedSong = song;
        },
      });

      songsElement.appendChild(songElement);
    });

    state.volume = Number(localStorage.getItem(LocalStorageKeys.VOLUME) || 1);
  } catch (error) {
    console.error(error);
  }
}

init();
