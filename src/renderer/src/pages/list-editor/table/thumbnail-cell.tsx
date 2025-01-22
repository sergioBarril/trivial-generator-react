/* eslint-disable react/prop-types */
export const ThumbnailCell = ({ row }) => {
  const { id: videoId } = row.original;

  return <img className="h-12 w-12" src={`http://img.youtube.com/vi/${videoId}/0.jpg`} />;
};
