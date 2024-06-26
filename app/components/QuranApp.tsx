import {
  RefObject,
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import { appName, surahs } from "~/components/config";
import { Track } from "~/routes/types";

const audioExtention = "mp3"; // 'opus' | 'mp3'
const audioSrcBaseUrl = `https://everyayah.com/data/Alafasy_64kbps/`;
// https://mirrors.quranicaudio.com/muqri/alafasi/opus

const QuranApp = () => {
  const audioPlayerRef = useRef<{ [key: Track]: RefObject<HTMLAudioElement> }>(
    {}
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTrack, setActiveTrack] = useState<Track>("" as Track);

  const [surahNumber, setSurahNumber] = useLocalStorage<number>(
    "surahNumber",
    1
  );
  const [startingAyatNumber, setStartingAyatNumber] = useLocalStorage<number>(
    "startingAyatNumber",
    1
  );
  const [endingAyatNumber, setEndingAyatNumber] = useLocalStorage<number>(
    "endingAyatNumber",
    1
  );
  const [shouldRepeat, setShouldRepeat] = useLocalStorage<boolean>(
    "shouldRepeat",
    true
  );

  const surah = useMemo(() => {
    return surahs[surahNumber - 1];
  }, [surahNumber]);

  const tracksToPlay = useMemo(() => {
    let ayatNumber = startingAyatNumber - 1;

    const trackObjects = Array.from({
      length: endingAyatNumber - ayatNumber,
    }).map(() => {
      ayatNumber++;

      const track: Track = `${surahNumber
        .toString()
        .padStart(3, "0")}${ayatNumber.toString().padStart(3, "0")}` as Track;

      audioPlayerRef.current[track] = createRef();

      return {
        surahNumber,
        ayatNumber,
        track,
        trackUrl: `${audioSrcBaseUrl}/${track}.${audioExtention}`,
      };
    });

    if (shouldRepeat) {
      const REPEAT_SOUND_TRACK = "REPEAT_SOUND_TRACK";
      trackObjects.push({
        surahNumber,
        ayatNumber,
        track: REPEAT_SOUND_TRACK as Track,
        trackUrl: "/click-sound.mp3",
      });
      audioPlayerRef.current[REPEAT_SOUND_TRACK] = createRef();
    }

    return trackObjects;
  }, [startingAyatNumber, endingAyatNumber, shouldRepeat, surahNumber]);

  const currentAyat = useMemo(() => {
    return parseInt(activeTrack.split("").slice(3).join("")) | 0;
  }, [activeTrack]);

  const handleEnded = (e) => {
    const currentTrack = e.target.id;
    const trackIndex = tracksToPlay.findIndex(
      ({ track }) => track === currentTrack
    );
    const nextTrack = tracksToPlay[trackIndex + 1]?.track;

    if (nextTrack) {
      audioPlayerRef.current[nextTrack].current.play();
      setActiveTrack(nextTrack);
      return;
    }
    if (shouldRepeat) {
      const firstTrack = tracksToPlay[0].track;
      audioPlayerRef.current[firstTrack].current.play();
      setActiveTrack(firstTrack);
      return;
    }
    setIsPlaying(false);
  };

  const handlePlay = ({ activeTrack }: { activeTrack: Track }) => {
    setIsPlaying(true);
    try {
      audioPlayerRef.current[activeTrack].current?.play();
    } catch (e) {
      console.log(e);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    audioPlayerRef.current[activeTrack].current.pause();
  };

  const handleReset = () => {
    handleStopAll();
    const firstTrack: Track = tracksToPlay[0].track;
    setActiveTrack(firstTrack);
    handlePlay({ activeTrack: firstTrack });
  };

  const handleStopAll = useCallback(() => {
    setIsPlaying(false);
    const tracks = Object.keys(audioPlayerRef.current);
    tracks.forEach((track) => {
      const elm = audioPlayerRef.current[track]?.current;
      if (!elm) return;
      elm.pause();
      elm.currentTime = 0;
    });
  }, []);

  useEffect(() => {
    if (!tracksToPlay.length) return;
    handleStopAll();
    setActiveTrack(tracksToPlay[0].track);
  }, [tracksToPlay, handleStopAll]);

  useEffect(() => {
    document.title = `${surah.number}:${currentAyat} : ${surah.name} - ${appName}`;
  }, [currentAyat, surah]);

  return (
    <div className="flex rounded-lg border-2 mx-auto p-9 w-full max-w-md flex-col justify-center gap-3 bg-white">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1
          style={{
            fontSize: "1.5em",
            margin: 0,
            padding: 0,
            fontWeight: "bold",
          }}
        >
          {appName}
        </h1>
      </div>
      <div>
        <select
          className="border-2 rounded p-2 w-full"
          name="surah"
          id="surah"
          value={surahNumber}
          size={1}
          onChange={(e) => {
            const surahNumber = parseInt(e.target.value);
            setSurahNumber(surahNumber);
            const surah = surahs[surahNumber - 1];
            setStartingAyatNumber(1);
            setEndingAyatNumber(surah.numberOfAyats);
          }}
        >
          {surahs.map(({ number, name, nameEnglish }) => (
            <option key={name} value={number}>
              {number}. {name}: {nameEnglish}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="startAyat">Starting</label>
          <select
            className="border-2 rounded p-2"
            name="startingAyatNumber"
            id="startingAyatNumber"
            value={startingAyatNumber}
            onChange={(e) => {
              setStartingAyatNumber(parseInt(e.target.value));
            }}
          >
            {Array.from({ length: surah.numberOfAyats }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="startAyat">Ending</label>
          <select
            className="border-2 rounded p-2"
            name="endingAyatNumber"
            id="endingAyatNumber"
            value={endingAyatNumber}
            onChange={(e) => {
              setEndingAyatNumber(parseInt(e.target.value));
            }}
          >
            {Array.from({
              length: surah.numberOfAyats - startingAyatNumber + 1,
            }).map((_, index) => {
              const ayatNumber = startingAyatNumber + index;
              return (
                <option key={ayatNumber} value={ayatNumber}>
                  {ayatNumber}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div>
        {tracksToPlay.map(({ track, trackUrl }) => {
          return (
            <audio
              key={track}
              id={track}
              ref={audioPlayerRef.current[track]}
              preload="true"
              controls={activeTrack === track}
              onEnded={handleEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={trackUrl} />
              <track
                src={trackUrl}
                kind="captions"
                srcLang="en"
                label="English"
              />
            </audio>
          );
        })}
      </div>
      <div>
        <label className="flex gap-2" htmlFor="shouldRepeat">
          <input
            type="checkbox"
            name="shouldRepeat"
            id="shouldRepeat"
            checked={shouldRepeat}
            onChange={() => setShouldRepeat(!shouldRepeat)}
          />
          Repeat
        </label>
      </div>
      Current Ayat: {currentAyat}
      <div className="flex gap-2">
        {!isPlaying && (
          <button
            className="btn"
            style={{ width: "100%" }}
            onClick={() => handlePlay({ activeTrack })}
          >
            Play
          </button>
        )}
        {isPlaying && (
          <button
            className="btn"
            style={{ width: "100%" }}
            onClick={handlePause}
          >
            Pause
          </button>
        )}
        {currentAyat > startingAyatNumber && (
          <button className="btn-secondary" onClick={handleReset}>
            Restart
          </button>
        )}
      </div>
      {/* {generateAllFileNames().map((link) => (
        <a key={link} href={link}>
          {link}
        </a>
      ))} */}
    </div>
  );
};

export default QuranApp;
