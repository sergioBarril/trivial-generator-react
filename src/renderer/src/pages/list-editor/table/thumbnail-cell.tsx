/* eslint-disable react/prop-types */

import { getYoutubeVideoId } from "@renderer/lib/utils";

export const ThumbnailCell = ({ row }) => {
  const { link } = row.original;

  const videoId = getYoutubeVideoId(link);

  return <img className="h-12 w-12" src={`http://img.youtube.com/vi/${videoId}/0.jpg`} />;
};
