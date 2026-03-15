import { defineStore } from "pinia";
import { ref } from "vue";
import { query_blog_by_user_id_cursor } from "../Hooks/Blog";
import { query_music_by_user_id_cursor } from "../Hooks/Music";
import type { BlogData, MusicResponse } from "../Utils/reks-interface";

export type GuestFeedTab = "blog" | "music" | "fav";

export const guestFeedStore = defineStore("guestFeed", () => {
  const activeRid = ref<number | null>(null);

  const blogList = ref<BlogData[]>([]);
  const blogCursor = ref<number | null>(null);
  const blogHasMore = ref(true);
  const blogLoadingMore = ref(false);

  const musicList = ref<MusicResponse[]>([]);
  const musicCursor = ref<number | null>(null);
  const musicHasMore = ref(true);
  const musicLoadingMore = ref(false);

  const resetFeed = () => {
    blogList.value = [];
    blogCursor.value = null;
    blogHasMore.value = true;
    blogLoadingMore.value = false;

    musicList.value = [];
    musicCursor.value = null;
    musicHasMore.value = true;
    musicLoadingMore.value = false;
  };

  const initUserFeed = (rid: number) => {
    if (activeRid.value === rid) return;
    activeRid.value = rid;
    resetFeed();
  };

  const loadMoreBlog = async (rid: number, limit = 9) => {
    initUserFeed(rid);
    if (blogLoadingMore.value || !blogHasMore.value) return;

    blogLoadingMore.value = true;
    try {
      const page = await query_blog_by_user_id_cursor(rid, blogCursor.value, limit);
      blogList.value = [...blogList.value, ...(page.items || [])];
      blogCursor.value = page.next_cursor;
      blogHasMore.value = !!page.has_more;
    } finally {
      blogLoadingMore.value = false;
    }
  };

  const loadMoreMusic = async (rid: number, limit = 9) => {
    initUserFeed(rid);
    if (musicLoadingMore.value || !musicHasMore.value) return;

    musicLoadingMore.value = true;
    try {
      const page = await query_music_by_user_id_cursor(rid, musicCursor.value, limit);
      musicList.value = [...musicList.value, ...(page.items || [])];
      musicCursor.value = page.next_cursor;
      musicHasMore.value = !!page.has_more;
    } finally {
      musicLoadingMore.value = false;
    }
  };

  const ensureFirstPage = async (tab: GuestFeedTab, rid: number, limit = 9) => {
    initUserFeed(rid);

    if (tab === "blog") {
      if (blogList.value.length === 0 && blogHasMore.value) {
        await loadMoreBlog(rid, limit);
      }
      return;
    }

    if (tab === "music") {
      if (musicList.value.length === 0 && musicHasMore.value) {
        await loadMoreMusic(rid, limit);
      }
    }
  };

  return {
    activeRid,
    blogList,
    blogCursor,
    blogHasMore,
    blogLoadingMore,
    musicList,
    musicCursor,
    musicHasMore,
    musicLoadingMore,
    resetFeed,
    initUserFeed,
    loadMoreBlog,
    loadMoreMusic,
    ensureFirstPage,
  };
});
