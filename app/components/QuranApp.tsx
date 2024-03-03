import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { surahs } from "~/components/config";

const QuranApp = () => {
  const audioPlayerRef = useRef<any[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeAyatNumber, setActiveAyatNumber] = useState<string>("");
  const [surahNumber, setSurahNumber] = useState<number>(1);
  const [startingAyatNumber, setStartingAyatNumber] = useState<number>(1);
  const [endingAyatNumber, setEndingAyatNumber] = useState<number>(1);
  const [shouldRepeat, setShouldRepeat] = useState<boolean>(true);

  const surah = useMemo(() => {
    return surahs[surahNumber - 1];
  }, [surahNumber]);

  useEffect(() => {
    setStartingAyatNumber(1);
    setEndingAyatNumber(surah.numberOfAyats);
    setActiveAyatNumber("");
    setIsPlaying(false);
  }, [surah]);

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
      setActiveAyatNumber(nextTrack);
      return;
    }
    if (shouldRepeat) {
      audioPlayerRef.current[0].current.play();
      setActiveAyatNumber(tracksToPlay[0]);
      return;
    }
    setIsPlaying(false);
  };

  const handlePlayPause = (e) => {
    setActiveAyatNumber(tracksToPlay[0]);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "10px",
        justifyContent: "space-between",
      }}
    >
      <div>
        <label htmlFor="shouldRepeat">Repeat</label>
        <input
          type="checkbox"
          name="shouldRepeat"
          id="shouldRepeat"
          checked={shouldRepeat}
          onChange={() => setShouldRepeat(!shouldRepeat)}
        />
      </div>
      <div style={{ flexGrow: 1 }}>
        <select
          style={{ width: "100%", height: "100%" }}
          name="surah"
          id="surah"
          value={surahNumber}
          size={20}
          onChange={(e) => {
            setSurahNumber(parseInt(e.target.value));
          }}
        >
          {surahs.map(({ number, name, nameEnglish }) => (
            <option key={name} value={number}>
              {number}. {name}: {nameEnglish}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <label htmlFor="startAyat">Starting Ayat</label>
          <select
            name="startingAyatNumber"
            id="startingAyatNumber"
            value={startingAyatNumber}
            onChange={(e) => {
              setStartingAyatNumber(parseInt(e.target.value));
              setActiveAyatNumber("");
              setIsPlaying(false);
            }}
          >
            {Array.from({ length: surah.numberOfAyats }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <label htmlFor="startAyat">Ending Ayat</label>
          <select
            name="endingAyatNumber"
            id="endingAyatNumber"
            value={endingAyatNumber}
            onChange={(e) => {
              setEndingAyatNumber(parseInt(e.target.value));
              setActiveAyatNumber("");
              setIsPlaying(false);
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
        {activeAyatNumber && (
          <>
            Playing Ayat:{" "}
            {parseInt(activeAyatNumber.split("").splice(3).join(""))}
          </>
        )}
        {tracksToPlay.map((track, index) => {
          return (
            <audio
              key={track}
              id={track}
              ref={audioPlayerRef.current[index]}
              preload="true"
              controls={activeAyatNumber === track}
              onEnded={handleEnded}
              src={`https://mirrors.quranicaudio.com/muqri/alafasi/opus/${track}.opus`}
            ></audio>
          );
        })}
      </div>
      <div>
        <button style={{ width: "100%" }} onClick={handlePlayPause}>
          Play
        </button>
      </div>
    </div>
  );
};

export default QuranApp;
