<script setup lang="ts">
import { computed, ref } from "vue";
import { userStore } from "../Store/user";
import type { BlogData, MusicResponse } from "../Utils/reks-interface";

type GuestTab = "blog" | "music" | "fav";

const user = userStore();

const activeTab = ref<GuestTab>("blog");
const subscribed = ref(false);

const guestProfile = computed(() => ({
	username: user.userInfo?.username || "访客用户",
	sign: user.userInfo?.sign || "这个用户很神秘，还没有留下签名。",
	avatar: user.userInfo?.avatar || "",
}));

const mockBlogList: BlogData[] = [
	{
		id: 1,
		title: "初春杂谈",
		cover: [
			"https://picsum.photos/seed/guest-blog-1-a/640/420",
			"https://picsum.photos/seed/guest-blog-1-b/640/420",
			"https://picsum.photos/seed/guest-blog-1-c/640/420",
		],
		created_at: new Date("2026-03-01T08:00:00"),
		type: 1,
	},
	{
		id: 2,
		title: "学习路线整理",
		cover: [
			"https://picsum.photos/seed/guest-blog-2-a/640/420",
			"https://picsum.photos/seed/guest-blog-2-b/640/420",
		],
		created_at: new Date("2026-02-28T10:30:00"),
		type: 1,
	},
	{
		id: 3,
		title: "工作流小优化",
		cover: ["https://picsum.photos/seed/guest-blog-3-a/640/420"],
		created_at: new Date("2026-02-26T14:10:00"),
		type: 1,
	},
	{
		id: 4,
		title: "周末片段",
		cover: [
			"https://picsum.photos/seed/guest-blog-4-a/640/420",
			"https://picsum.photos/seed/guest-blog-4-b/640/420",
		],
		created_at: new Date("2026-02-21T19:20:00"),
		type: 1,
	},
	{
		id: 5,
		title: "对比实验记录",
		cover: [
			"https://picsum.photos/seed/guest-blog-5-a/640/420",
			"https://picsum.photos/seed/guest-blog-5-b/640/420",
			"https://picsum.photos/seed/guest-blog-5-c/640/420",
		],
		created_at: new Date("2026-02-18T09:00:00"),
		type: 0,
	},
	{
		id: 6,
		title: "本月收藏分享",
		cover: ["https://picsum.photos/seed/guest-blog-6-a/640/420"],
		created_at: new Date("2026-02-15T16:45:00"),
		type: 1,
	},
];

const mockMusicList: MusicResponse[] = [
	{
		id: 101,
		name: "夜航",
		desc: "轻电子风格，适合深夜写代码时循环。",
		cover: "https://picsum.photos/seed/guest-music-1/640/420",
		audio: "",
		created_at: new Date("2026-02-20T23:10:00"),
		original: true,
		rid: 201,
		state: 1,
		username: "Harbor",
		avatar: "https://picsum.photos/seed/guest-avatar-1/120/120",
	},
	{
		id: 102,
		name: "晨雾",
		desc: "钢琴与弦乐的短篇即兴。",
		cover: "https://picsum.photos/seed/guest-music-2/640/420",
		audio: "",
		created_at: new Date("2026-02-17T07:30:00"),
		original: true,
		rid: 202,
		state: 1,
		username: "Frost",
		avatar: "https://picsum.photos/seed/guest-avatar-2/120/120",
	},
	{
		id: 103,
		name: "火花",
		desc: "偏实验向的鼓点和合成器编排。",
		cover: "https://picsum.photos/seed/guest-music-3/640/420",
		audio: "",
		created_at: new Date("2026-02-11T12:15:00"),
		original: false,
		rid: 203,
		state: 1,
		username: "Lumen",
		avatar: "https://picsum.photos/seed/guest-avatar-3/120/120",
	},
	{
		id: 104,
		name: "无题",
		desc: "四分钟的人声采样混剪。",
		cover: "https://picsum.photos/seed/guest-music-4/640/420",
		audio: "",
		created_at: new Date("2026-02-09T18:50:00"),
		original: false,
		rid: 204,
		state: 1,
		username: "Miro",
		avatar: "https://picsum.photos/seed/guest-avatar-4/120/120",
	},
    
    
];

const mockFavList: BlogData[] = [
	{
		id: 201,
		title: "设计系统入门",
		cover: ["https://picsum.photos/seed/guest-fav-1/640/420"],
		created_at: new Date("2026-02-05T11:00:00"),
		type: 1,
	},
	{
		id: 202,
		title: "编曲流程笔记",
		cover: [
			"https://picsum.photos/seed/guest-fav-2-a/640/420",
			"https://picsum.photos/seed/guest-fav-2-b/640/420",
		],
		created_at: new Date("2026-02-03T14:32:00"),
		type: 0,
	},
	{
		id: 203,
		title: "性能排查清单",
		cover: ["https://picsum.photos/seed/guest-fav-3/640/420"],
		created_at: new Date("2026-01-30T21:20:00"),
		type: 1,
	},
	{
		id: 204,
		title: "交互微动效示例",
		cover: [
			"https://picsum.photos/seed/guest-fav-4-a/640/420",
			"https://picsum.photos/seed/guest-fav-4-b/640/420",
			"https://picsum.photos/seed/guest-fav-4-c/640/420",
		],
		created_at: new Date("2026-01-26T09:10:00"),
		type: 1,
	},
];

const activeCount = computed(() => {
	if (activeTab.value === "music") return mockMusicList.length;
	if (activeTab.value === "fav") return mockFavList.length;
	return mockBlogList.length;
});

const tabTitle = computed(() => {
	if (activeTab.value === "music") return "TA 的音乐";
	if (activeTab.value === "fav") return "TA 的收藏";
	return "TA 的博客";
});

const toggleSubscribe = () => {
	subscribed.value = !subscribed.value;
};
</script>

<template>
	<div class="guest w-100">
		<BContainer class="guest-header mt-5 px-4 py-4 d-flex align-items-center">
			<div class="d-flex align-items-center gap-3 guest-base-info">
				<BAvatar
					size="82px"
					:src="guestProfile.avatar"
					style="box-shadow: rgba(0, 0, 0, 0.15) 2px 4px 10px"
				/>
				<div class="guest-text">
					<div class="guest-name fw-bold">{{ guestProfile.username }}</div>
					<div class="guest-sign text-secondary">{{ guestProfile.sign }}</div>
				</div>
			</div>

			<div class="guest-actions ms-auto d-flex align-items-center">
				<BButton
					variant="outline-secondary"
					class="me-2"
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
					@click="activeTab = 'blog'"
				>
					博客
				</BButton>
				<BButton
					:variant="activeTab === 'music' ? 'danger' : 'outline-secondary'"
					size="sm"
					@click="activeTab = 'music'"
				>
					音乐
				</BButton>
				<BButton
					:variant="activeTab === 'fav' ? 'danger' : 'outline-secondary'"
					size="sm"
					@click="activeTab = 'fav'"
				>
					收藏
				</BButton>

				<span class="ms-auto text-secondary small">仅浏览模式，不支持编辑</span>
			</div>

			<div class="guest-content px-3 pb-3">
				<div class="content-head d-flex align-items-center justify-content-between py-2">
					<h6 class="m-0 fw-bold">{{ tabTitle }}</h6>
					<span class="badge-count">{{ activeCount }} 条</span>
				</div>

				<div class="waterfall-box" v-if="activeTab === 'blog'">
					<div
						class="waterfall-item"
						v-for="item in mockBlogList"
						:key="`guest-blog-${item.id}`"
					>
						<BlogCard :blog="item" />
					</div>
				</div>

				<div class="music-grid-box" v-else-if="activeTab === 'music'">
					<div
						class="music-grid-item music-item"
						v-for="item in mockMusicList"
						:key="`guest-music-${item.id}`"
					>
						<MusicCase :music="item" />
					</div>
				</div>

				<div class="waterfall-box" v-else>
					<div
						class="waterfall-item"
						v-for="item in mockFavList"
						:key="`guest-fav-${item.id}`"
					>
						<BlogCard :blog="item" />
					</div>
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
