<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
	router.push('/')
}

function goBack() {
	router.back()
}
</script>

<template>
	<div class="no-found">
		<div class="card">
			<div class="num">404</div>
			<div class="msg">页面未找到</div>
			<p class="sub">抱歉，您访问的页面不存在或已被移除。</p>
			<div class="actions d-flex gap-2 justify-content-center">
				<button class="btn btn-outline-secondary" @click="goBack">返回上一页</button>
				<button class="btn btn-danger" @click="goHome">返回首页</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.no-found {
	min-height: calc(100vh - 6rem);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	background: transparent;
}
.card {
	width: 100%;
	max-width: 520px;
	background: #ffffffc4;
	padding: 2.2rem;
	border-radius: 12px;
	box-shadow: 0 8px 28px rgba(20,24,40,0.06);
	text-align: center;
}
.num {
	font-size: 4rem;
	color: rgb(237, 213, 180);
	font-family: 'Alibaba-PuHuiTi-Medium', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
	margin-bottom: 0.2rem;
}
.msg {
	font-size: 1.25rem;
	color: #333;
	margin-bottom: 0.4rem;
}
.sub {
	color: #6b6b6b;
	margin-bottom: 1rem;
}


@media (max-width: 480px) {
	.num { font-size: 3rem; }
	.card { padding: 1.2rem; }
	.actions { flex-direction: column; }
	.btn { width: 100%; }
}
</style>

