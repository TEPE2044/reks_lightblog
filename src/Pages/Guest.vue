<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { useToast } from "bootstrap-vue-next";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { queryUserFavorites } from "../Hooks/Fav";
import { guestFeedStore } from "../Store/guestFeed";
import { query_profile_by_user_id } from "../Hooks/User";
import { createToast } from "../Utils/reks-toast";
import type { FavoriteBlogItem, FavoriteMusicItem } from "../Utils/reks-interface";
import { followStore } from "../Store/follow";

type GuestTab = "blog" | "music" | "fav";
type FavoriteTab = "blog" | "music";
const PAGE_LIMIT = 9;

const route = useRoute();
const toast = useToast();
const feed = guestFeedStore();
const follow = followStore();
const {
	blogList: guestBlogList,
	musicList: guestMusicList,
	blogHasMore,
	musicHasMore,
	blogLoadingMore,
	musicLoadingMore,
} = storeToRefs(feed);
const { followStatsByRid } = storeToRefs(follow);

const activeTab = ref<GuestTab>("blog");
const favoriteTab = ref<FavoriteTab>("blog");
const guestLoading = ref(false);
const guestFavoriteLoading = ref(false);

const targetUserId = computed(() => Number(route.params.id));
const subscribed = computed(() => follow.isSubscribed(targetUserId.value));
const subscribePending = computed(() => follow.isFollowPending(targetUserId.value));
const guestFollowStats = computed(() => {
	const rid = targetUserId.value;
	return followStatsByRid.value[rid] || null;
});

const syncSubscribeState = async () => {
	await follow.syncSubscribeStateByRid(targetUserId.value);
};

const toggleSubscribe = () => {
	void follow.toggleSubscribeByRid({ rid: targetUserId.value, toast });
};

const guestProfile = ref({
	username: "访客用户",
	sign: "这个用户很神秘，还没有留下签名。",
	avatar: "",
});

const guestFavBlogList = ref<FavoriteBlogItem[]>([]);
const guestFavMusicList = ref<FavoriteMusicItem[]>([]);

const resetGuestData = () => {
	guestProfile.value = {
		username: "访客用户",
		sign: "这个用户很神秘，还没有留下签名。",
		avatar: "",
	};
	feed.resetFeed();
	guestFavBlogList.value = [];
	guestFavMusicList.value = [];
};

const loadGuestFavorites = async () => {
	const rid = targetUserId.value;
	if (!Number.isInteger(rid) || rid <= 0) return;

	guestFavoriteLoading.value = true;
	try {
		const [blogRes, musicRes] = await Promise.all([
			queryUserFavorites<FavoriteBlogItem>(rid, "blog"),
			queryUserFavorites<FavoriteMusicItem>(rid, "music"),
		]);
		guestFavBlogList.value = blogRes.favorites || [];
		guestFavMusicList.value = musicRes.favorites || [];
	} catch (e) {
		console.error(e);
		createToast(toast, "加载失败", "无法获取 TA 的收藏列表", "danger");
	} finally {
		guestFavoriteLoading.value = false;
	}
};

const activeCount = computed(() => {
	if (activeTab.value === "music") return guestMusicList.value.length;
	if (activeTab.value === "fav") {
		return favoriteTab.value === "music"
			? guestFavMusicList.value.length
			: guestFavBlogList.value.length;
	}
	return guestBlogList.value.length;
});

const tabTitle = computed(() => {
	if (activeTab.value === "music") return "TA 的音乐";
	if (activeTab.value === "fav") {
		return favoriteTab.value === "music" ? "TA 收藏的音乐" : "TA 收藏的博客";
	}
	return "TA 的博客";
});

const isLoadingMore = computed(() => {
	if (activeTab.value === "music") return musicLoadingMore.value;
	if (activeTab.value === "blog") return blogLoadingMore.value;
	return false;
});

const switchTab = (tab: GuestTab) => {
	activeTab.value = tab;
	if (!guestLoading.value) {
		if (tab === "fav") {
			void loadGuestFavorites();
			return;
		}
		void loadActiveTabFirstPage();
	}
};

const switchFavoriteTab = (tab: FavoriteTab) => {
	favoriteTab.value = tab;
};

const loadMoreBlog = async () => {
	const rid = targetUserId.value;
	if (!Number.isInteger(rid) || rid <= 0) return;
	await feed.loadMoreBlog(rid, PAGE_LIMIT);
};

const loadMoreMusic = async () => {
	const rid = targetUserId.value;
	if (!Number.isInteger(rid) || rid <= 0) return;
	await feed.loadMoreMusic(rid, PAGE_LIMIT);
};

const loadActiveTabFirstPage = async () => {
	const rid = targetUserId.value;
	if (!Number.isInteger(rid) || rid <= 0) return;
	await feed.ensureFirstPage(activeTab.value, rid, PAGE_LIMIT);
};

const loadGuestData = async () => {
	const rid = targetUserId.value;
	if (!Number.isInteger(rid) || rid <= 0) {
		resetGuestData();
		return;
	}

	resetGuestData();
	guestLoading.value = true;
	try {
		feed.initUserFeed(rid);
		const [profileRes] = await Promise.all([
			query_profile_by_user_id(rid),
			loadActiveTabFirstPage(),
		]);

		guestProfile.value = {
			username: profileRes?.username || "访客用户",
			sign: profileRes?.sign || "这个用户很神秘，还没有留下签名。",
			avatar: profileRes?.avatar || "",
		};
	} catch {
		createToast(toast, "加载失败", "无法获取该用户主页数据", "danger");
	} finally {
		void follow.fetchFollowStatsByRid(rid);

		guestLoading.value = false;
		// 兜底：首屏初始化阶段若因时序没有拿到数据，结束后再尝试拉取一页。
		void loadActiveTabFirstPage();
	}
};

watch(
	() => route.params.id,
	() => {
		void loadGuestData();
		void loadGuestFavorites();
		void syncSubscribeState();
	},
	{ immediate: true },
);

watch(
	activeTab,
	() => {
		if (guestLoading.value) return;
		void loadActiveTabFirstPage();
	},
);

useInfiniteScroll(
	window,
	() => {
		if (activeTab.value === "blog") {
			void loadMoreBlog();
			return;
		}
		if (activeTab.value === "music") {
			void loadMoreMusic();
		}
	},
	{
		distance: 10,
		canLoadMore: () => {
			if (guestLoading.value) return false;
			if (activeTab.value === "blog") {
				return blogHasMore.value && !blogLoadingMore.value;
			}
			if (activeTab.value === "music") {
				return musicHasMore.value && !musicLoadingMore.value;
			}
			return false;
		},
	},
);
</script>

<template>
	<div class="guest w-100">
		<BContainer class="guest-header mt-5 px-4 py-4 d-flex align-items-center">
			<div class="d-flex align-items-center gap-3 guest-base-info">
				<BAvatar
					size="82px"
					:src="guestProfile.avatar || ''"
					style="box-shadow: rgba(0, 0, 0, 0.15) 2px 4px 10px"
				/>
				<div class="guest-text">
					<div class="guest-name fw-bold">{{ guestProfile.username }}</div>
					<div class="guest-sign text-secondary">{{ guestProfile.sign }}</div>
				</div>
			</div>

			<div class="guest-follow-data d-flex align-items-center gap-3 me-3">
				<span class="follow-meta">关注：{{ guestFollowStats?.followingCount ?? "--" }}</span>
				<span class="follow-meta">粉丝：{{ guestFollowStats?.followerCount ?? "--" }}</span>
			</div>

			<div class="guest-actions ms-auto d-flex align-items-center">
				<BButton
					variant="outline-secondary"
					class="me-2"
					:disabled="subscribePending"
					@click="toggleSubscribe"
				>
					{{ subscribed ? "已关注" : "关注" }}
				</BButton>

				<BDropdown right no-caret variant="light" toggle-class="more-toggle">
					<template #button-content>
						<span class="more-text">...</span>
					</template>
					<BDropdownItemButton>私信</BDropdownItemButton>
					<BDropdownItemButton>举报</BDropdownItemButton>
				</BDropdown>
			</div>
		</BContainer>

		<BContainer class="guest-body px-0 mt-4">
			<div class="guest-tab d-flex align-items-center gap-2 px-3 py-3">
				<BButton
					:variant="activeTab === 'blog' ? 'danger' : 'outline-secondary'"
					size="sm"
					@click="switchTab('blog')"
				>
					博客
				</BButton>
				<BButton
					:variant="activeTab === 'music' ? 'danger' : 'outline-secondary'"
					size="sm"
					@click="switchTab('music')"
				>
					音乐
				</BButton>
				<BButton
					:variant="activeTab === 'fav' ? 'danger' : 'outline-secondary'"
					size="sm"
					@click="switchTab('fav')"
				>
					收藏
				</BButton>

			</div>

			<div class="guest-content px-3 pb-3">
				<div class="content-head d-flex align-items-center justify-content-between py-2">
					<h6 class="m-0 fw-bold">{{ tabTitle }}</h6>
					<span class="badge-count">{{ activeCount }} 条</span>
				</div>

				<div v-if="activeTab === 'fav'" class="fav-subtab d-flex align-items-center gap-2 pb-3">
					<BButton
						:variant="favoriteTab === 'blog' ? 'danger' : 'outline-secondary'"
						size="sm"
						@click="switchFavoriteTab('blog')"
					>
						博客收藏
					</BButton>
					<BButton
						:variant="favoriteTab === 'music' ? 'danger' : 'outline-secondary'"
						size="sm"
						@click="switchFavoriteTab('music')"
					>
						音乐收藏
					</BButton>
				</div>

				<div v-if="guestLoading" class="py-4">
					<Empty title="主页加载中..." />
				</div>

				<div class="waterfall-box" v-else-if="activeTab === 'blog' && guestBlogList.length > 0">
					<div
						class="waterfall-item"
						v-for="item in guestBlogList"
						:key="`guest-blog-${item.id}`"
					>
						<BlogCard :blog="item" :show-actions="false" :show-favorite="false" />
					</div>
				</div>
				<div v-else-if="activeTab === 'blog'" class="py-4">
					<Empty title="TA 还没有发布博客" />
				</div>

				<div class="music-grid-box" v-else-if="activeTab === 'music' && guestMusicList.length > 0">
					<div
						class="music-grid-item music-item"
						v-for="item in guestMusicList"
						:key="`guest-music-${item.id}`"
					>
						<MusicCase :music="item" />
					</div>
				</div>
				<div v-else-if="activeTab === 'music'" class="py-4">
					<Empty title="TA 还没有发布音乐" />
				</div>

				<div v-else-if="activeTab === 'fav' && guestFavoriteLoading" class="py-4">
					<Empty title="收藏加载中..." />
				</div>

				<div class="waterfall-box" v-else-if="activeTab === 'fav' && favoriteTab === 'blog' && guestFavBlogList.length > 0">
					<div
						class="waterfall-item"
						v-for="item in guestFavBlogList"
						:key="`guest-fav-blog-${item.id}`"
					>
						<BlogCard :blog="item" :show-actions="false" :show-favorite="false" />
					</div>
				</div>

				<div class="music-grid-box" v-else-if="activeTab === 'fav' && favoriteTab === 'music' && guestFavMusicList.length > 0">
					<div
						class="music-grid-item music-item"
						v-for="item in guestFavMusicList"
						:key="`guest-fav-music-${item.id}`"
					>
						<MusicCase :music="item" :show-favorite="false" />
					</div>
				</div>

				<div v-else class="py-4">
					<Empty :title="favoriteTab === 'blog' ? 'TA 还没有收藏博客' : 'TA 还没有收藏音乐'" />
				</div>

				<div v-if="isLoadingMore" class="load-more-tip py-3 text-center text-secondary">
					加载中...
				</div>
			</div>
		</BContainer>
	</div>
</template>

<style scoped lang="scss">
@use "../Asset/CustomStyle/global.scss";

.guest {
	margin-top: 7rem;

	.guest-header {
		@extend %reks-card-box;
		min-height: 9rem;
		gap: 1.5rem;

		.guest-base-info {
			min-width: 0;
		}

		.guest-text {
			min-width: 0;
		}

		.guest-name {
			font-size: 1.15rem;
			color: #2f2f2f;
			margin-bottom: 0.35rem;
		}

		.guest-sign {
			font-size: 0.92rem;
			line-height: 1.45;
			max-width: 34rem;
			display: -webkit-box;
			line-clamp: 2;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.more-text {
			font-weight: 700;
			letter-spacing: 0.08em;
		}

		.guest-follow-data {
			padding: 0.45rem 0.7rem;
			border-radius: 999px;
			background: rgba(178, 34, 34, 0.08);

			.follow-meta {
				font-size: 0.84rem;
				color: #444;
			}
		}
	}

	.guest-body {
		@extend %reks-card-box;
		padding-top: 0;

		.guest-tab {
			border-bottom: 1px solid rgba(170, 170, 170, 0.2);
			background: linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.92) 0%,
				rgba(249, 249, 249, 0.8) 100%
			);
		}

		.badge-count {
			padding: 0.2rem 0.68rem;
			border-radius: 999px;
			color: firebrick;
			font-size: 0.78rem;
			background-color: rgba(178, 34, 34, 0.14);
			font-weight: 700;
		}

		.waterfall-box {
			margin-top: 0.7rem;
			column-count: 3;
			column-gap: 1rem;

			.waterfall-item {
				display: inline-block;
				width: 100%;
				break-inside: avoid;
				margin-bottom: 1rem;
			}
		}

		.music-grid-box {
			margin-top: 0.7rem;
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1rem;

			.music-grid-item {
				width: 100%;
			}
		}

		:deep(.blog-card) {
			max-width: none;
			width: 100%;
		}

		:deep(.music-card) {
			max-width: none !important;
			min-width: 0 !important;
			width: 100% !important;
		}

		.load-more-tip {
			font-size: 0.9rem;
		}
	}
}

@media (max-width: 768px) {
	.guest {
		margin-top: 6.3rem;

		.guest-body {
			.waterfall-box {
				column-count: 1;
			}

			.music-grid-box {
				grid-template-columns: 1fr;
			}
		}

		.guest-header {
			flex-direction: column;
			align-items: flex-start;

			.guest-actions {
				margin-left: 0 !important;
			}
		}
	}
}

@media (max-width: 1200px) and (min-width: 769px) {
	.guest {
		.guest-body {
			.waterfall-box {
				column-count: 2;
			}

			.music-grid-box {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}
		}
	}
}
</style>
