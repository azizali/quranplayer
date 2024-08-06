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

const REPEAT_SOUND_TRACK = "REPEAT_SOUND_TRACK" as Track;
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
    const nextTrack = tracksToPlay[trackIndex + 1]?.track as Track;

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
      audioPlayerRef.current[activeTrack]?.current.play();
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

  const handleAyatClick = useCallback(
    (track: Track) => {
      handleStopAll();
      setActiveTrack(track);
      handlePlay({ activeTrack: track });
    },
    [handleStopAll]
  );

  useEffect(() => {
    if (!tracksToPlay.length) return;
    handleStopAll();
    setActiveTrack(tracksToPlay[0].track);
  }, [tracksToPlay, handleStopAll]);

  useEffect(() => {
    document.title = `${surah.number}:${currentAyat} : ${surah.name} - ${appName}`;
  }, [currentAyat, surah]);

  useEffect(() => {
    if (endingAyatNumber < startingAyatNumber)
      setEndingAyatNumber(startingAyatNumber);
  }, [startingAyatNumber, endingAyatNumber, setEndingAyatNumber]);

  return (
    <div className="flex h-screen rounded-lg mx-auto w-full max-w-md flex-col bg-white justify-between">
      <div className="flex justify-center bg-primary text-white p-1">
        <h1 className=" font-extralight text-2xl">{appName}</h1>
      </div>
      <div className="p-4 flex-grow flex gap-2 flex-col ">
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
        <div className="flex-grow overflow-y-scroll">
          {tracksToPlay.map(({ ayatNumber, track, trackUrl }) => {
            const isActiveTrack =
              activeTrack === track && track !== REPEAT_SOUND_TRACK;
            const isInactiveTrack =
              activeTrack !== track && track !== REPEAT_SOUND_TRACK;
            return (
              <div
                key={track}
                className="block p-2 first:border-t border border-t-0 w-full even:bg-slate-100 last:hidden"
              >
                {isActiveTrack && (
                  <div className="text-center">Current ayat #{currentAyat}</div>
                )}
                <audio
                  key={track}
                  id={track}
                  ref={audioPlayerRef.current[track]}
                  preload="true"
                  controls={isActiveTrack}
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
                {isInactiveTrack && (
                  <button
                    className="w-full"
                    onClick={() => handleAyatClick(track)}
                  >
                    Play ayat #{ayatNumber}
                  </button>
                )}
              </div>
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
      </div>
      <div className="inline-flex shadow-sm" role="group">
        {!isPlaying && (
          <button
            className="btn w-full"
            onClick={() => handlePlay({ activeTrack })}
          >
            Play
          </button>
        )}
        {isPlaying && (
          <button className="btn w-full" onClick={handlePause}>
            Pause
          </button>
        )}
        {currentAyat > startingAyatNumber && (
          <button className="btn-secondary" onClick={handleReset}>
            Restart
          </button>
        )}
      </div>
    </div>
  );
};

export default QuranApp;
