import BiFileEarmarkRichtext from "~icons/bi/file-earmark-richtext";
import BiFileEarmarkPlay from "~icons/bi/file-earmark-play";
import BiFileEarmarkMusic from "~icons/bi/file-earmark-music";
import BiFileEarmarkRichtextPost from "~icons/bi/file-earmark-post";
import { markRaw } from "vue";

export const uploadIconMap = {
  blog: markRaw(BiFileEarmarkRichtext),
  mblog: markRaw(BiFileEarmarkPlay),
  audio: markRaw(BiFileEarmarkMusic),
  pro: markRaw(BiFileEarmarkRichtextPost),
} as const;

export type UploadIcon = keyof typeof uploadIconMap;