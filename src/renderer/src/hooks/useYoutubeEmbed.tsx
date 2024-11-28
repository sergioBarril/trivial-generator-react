import { useEffect, useRef, useState } from "react";

const useYoutubeEmbed = () => {
  const playerRef = useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [player, setPlayer] = useState<any>(null);

  const clearEvents = () => {
    player.removeEventListener("onError");
    player.removeEventListener("onStateChange");
  };

  const checkCopyright = (songId) => {
    return new Promise<void>((resolve, reject) => {
      const handleError = reject;
      const handleStateChanged = (event) => {
        if (event.data != window.YT.PlayerState.PLAYING) {
          console.log(`${songId} state`, event.data);
          return;
        }

        console.log(`${songId} returning true`, event.data);
        // player.stopVideo();
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
        playerVars: { playsinline: 1 }
        // events: {
        //   onReady: (event) => event.target.playVideo(),
        //   onStateChange: (event) => {
        //     if (event.data === window.YT.PlayerState.PLAYING) {
        //       setTimeout(() => event.target.stopVideo(), 6000);
        //     }
        //   }
        // }
      });

      setPlayer(newPlayer);
    };

    // Cleanup on unmount
    return () => {
      if (newPlayer) newPlayer.destroy();
    };
  }, []);

  const component = <div id="player" ref={playerRef}></div>;

  return { component, player, checkCopyright };
};

export default useYoutubeEmbed;
