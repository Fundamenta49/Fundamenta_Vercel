import React from 'react';

interface EmbeddedYoutubePlayerProps {
  videoId: string;
  title: string;
}

export function EmbeddedYouTubePlayer({ videoId, title }: EmbeddedYoutubePlayerProps) {
  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}

export default function EmbeddedYoutubePlayer({ videoId, title }: EmbeddedYoutubePlayerProps) {
  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}