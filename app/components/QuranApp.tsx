import { createRef, useMemo, useRef, useState } from "react";
import { surahs } from "~/components/config";

const QuranApp = () => {
  const audioPlayerRef = useRef<any[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [surahNumber, setSurahNumber] = useState<number>(1);
  const [startingAyatNumber, setStartingAyatNumber] = useState<number>(1);
  const [endingAyatNumber, setEndingAyatNumber] = useState<number>(1);
  const [shouldRepeat, setShouldRepeat] = useState<boolean>(true);

  const surah = useMemo(() => {
    return surahs[surahNumber - 1];
  }, [surahNumber]);

  const tracksToPlay = useMemo(() => {
    let ayatNumber = startingAyatNumber - 1;

    return Array.from({
      length: endingAyatNumber - ayatNumber,
    }).map((_, index) => {
      audioPlayerRef.current[index] = createRef();
      ayatNumber++;
      return `${surahNumber.toString().padStart(3, "0")}${ayatNumber
        .toString()
        .padStart(3, "0")}`;
    });
  }, [surahNumber, startingAyatNumber, endingAyatNumber]);

  const handleEnded = (e) => {
    const currentTrack = e.target.id;
    const trackIndex = tracksToPlay.indexOf(currentTrack);
    const nextTrack = tracksToPlay[trackIndex + 1];
    if (nextTrack) {
      audioPlayerRef.current[trackIndex + 1].current.play();
      return;
    }
    if (shouldRepeat) {
      audioPlayerRef.current[0].current.play();
      return;
    }
    setIsPlaying(false);
  };

  const handlePlayPause = (e) => {
    const activeTrackIndex = 0;
    if (!isPlaying) {
      audioPlayerRef.current[activeTrackIndex].current.play();
      setIsPlaying(true);
      return;
    }

    audioPlayerRef.current[activeTrackIndex].current.pause();
    setIsPlaying(false);
  };

  return (
    <div>
      <div>
        <label>
          Repeat
          <input
            type="checkbox"
            name="shouldRepeat"
            id="shouldRepeat"
            checked={shouldRepeat}
            onChange={(e) => setShouldRepeat(!shouldRepeat)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="surah">Surah</label>
        <select
          name="surah"
          id="surah"
          value={surahNumber}
          onChange={(e) => {
            setSurahNumber(e.target.value);
          }}
        >
          {surahs.map(({ number, name, nameEnglish, numberOfAyats }) => (
            <option key={name} value={number}>
              {number} - {name}: {nameEnglish} ({numberOfAyats} Ayats)
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="startAyat">
          Starting Ayat
          <select
            name="startingAyatNumber"
            id="startingAyatNumber"
            value={startingAyatNumber}
            onChange={(e) => setStartingAyatNumber(e.target.value)}
          >
            {Array.from({ length: surah.numberOfAyats }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label htmlFor="startAyat">
          Ending Ayat
          <select
            name="endingAyatNumber"
            id="endingAyatNumber"
            value={endingAyatNumber}
            onChange={(e) => setEndingAyatNumber(e.target.value)}
          >
            {Array.from({ length: surah.numberOfAyats }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <button onClick={handlePlayPause}>Play</button>
      </div>
      <div>
        {tracksToPlay.map((track, index) => (
          <figure key={track}>
            <audio
              ref={audioPlayerRef.current[index]}
              preload="true"
              controls
              id={track}
              onEnded={handleEnded}
              src={`https://mirrors.quranicaudio.com/muqri/alafasi/opus/${track}.opus`}
            ></audio>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default QuranApp;
