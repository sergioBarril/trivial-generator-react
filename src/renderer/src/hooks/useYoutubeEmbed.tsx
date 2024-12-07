import { useEffect, useRef, useState } from "react";

const useYoutubeEmbed = () => {
  const playerRef = useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [player, setPlayer] = useState<any>(null);
  const [isReady, setReady] = useState(false);

  const clearEvents = () => {
    player.removeEventListener("onError");
    player.removeEventListener("onStateChange");
    player.stopVideo();
  };

  const isVideoEmbeddable = async (songId: string) => {
    return new Promise<void>((resolve, reject) => {
      const handleError = reject;
      const handleStateChanged = (event) => {
        if (event.data != window.YT.PlayerState.PLAYING) {
          return;
        }

        resolve();
      };

      player.addEventListener("onError", handleError);
      player.addEventListener("onStateChange", handleStateChanged);

      player.loadVideoById(songId);
    })
      .then(() => true)
      .catch(() => false)
      .finally(clearEvents);
  };

  useEffect(() => {
    // Load the YouTube IFrame API script dynamically
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    let newPlayer;

    // Create the player after the API is loaded
    window.onYouTubeIframeAPIReady = () => {
      newPlayer = new window.YT.Player(playerRef.current, {
        height: "390",
        width: "640",
        videoId: "",
        playerVars: { playsinline: 1 },
        events: {
          onStateChange: () => {},
          onError: () => {},
          onReady: () => {
            setPlayer(newPlayer);
            setReady(true);
          }
        }
      });
    };
  }, []);

  const component = <div id="player" className="w-0 h-0" ref={playerRef}></div>;

  return { isReady, component, player, isVideoEmbeddable };
};

export default useYoutubeEmbed;
