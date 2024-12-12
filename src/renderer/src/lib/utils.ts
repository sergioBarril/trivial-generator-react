import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYoutubeVideoId(url: string): string | null {
  try {
    // Parse the URL to handle edge cases
    const parsedUrl = new URL(url);

    // Check if the host is YouTube or youtu.be
    if (parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtube.com") {
      // Extract the "v" query parameter for standard YouTube links
      return parsedUrl.searchParams.get("v");
    } else if (parsedUrl.hostname === "youtu.be") {
      // Extract the pathname for shortened YouTube links
      return parsedUrl.pathname.slice(1); // Remove leading "/"
    } else {
      return null; // Not a valid YouTube link
    }
  } catch (error) {
    // Handle invalid URL inputs
    return null;
  }
}
