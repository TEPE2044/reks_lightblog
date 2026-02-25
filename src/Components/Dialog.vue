<script lang="ts" setup>
import { useToggle as vuseToggle } from "@vueuse/core";
import { computed, nextTick, onMounted, ref, watch } from "vue";

const messages = ref([
  { id: 1, type: "op", name: "傻呗1号", content: "怎么换行？" },
  { id: 2, type: "my", name: "傻呗2号", content: "我tm哪知道" },
]);

const inputText = ref("");
const dialogBodyRef = ref<HTMLElement | null>(null);
const contacts = ref([
  { id: 1, name: "梦璃東", lastMsg: "点击进入会话" },
  { id: 2, name: "小林", lastMsg: "今晚一起打游戏吗？" },
  { id: 3, name: "阿泽", lastMsg: "文档我已更新" },
  { id: 4, name: "小艾", lastMsg: "收到，稍后回复" },
  { id: 5, name: "Mika", lastMsg: "明天见" },
  { id: 6, name: "Kenny", lastMsg: "你看看这个方案" },
  { id: 7, name: "Noah", lastMsg: "OK" },
  { id: 8, name: "Yuna", lastMsg: "已发送文件" },
]);
const activeContactId = ref(1);
const messagesByContact = ref<Record<number, typeof messages.value>>({
  1: [
    { id: 1, type: "op", name: "梦璃東", content: "怎么换行？" },
    { id: 2, type: "my", name: "傻呗2号", content: "Ctrl+Enter 发送" },
  ],
  2: [{ id: 3, type: "op", name: "小林", content: "今晚一起打游戏吗？" }],
  3: [{ id: 4, type: "op", name: "阿泽", content: "文档我已更新" }],
  4: [{ id: 5, type: "op", name: "小艾", content: "收到，稍后回复" }],
  5: [{ id: 6, type: "op", name: "Mika", content: "明天见" }],
  6: [{ id: 7, type: "op", name: "Kenny", content: "你看看这个方案" }],
  7: [{ id: 8, type: "op", name: "Noah", content: "OK" }],
  8: [{ id: 9, type: "op", name: "Yuna", content: "已发送文件" }],
});

const currentMessages = computed(() => {
  return messagesByContact.value[activeContactId.value] || [];
});

const sendMessage = () => {
  const text = inputText.value.trim();
  if (!text) return;

  const session =
    messagesByContact.value[activeContactId.value] ||
    (messagesByContact.value[activeContactId.value] = []);

  session.push({
    id: Date.now(),
    type: "my",
    name: "傻呗2号",
    content: text,
  });

  const activeContact = contacts.value.find(
    (contact) => contact.id === activeContactId.value,
  );
  if (activeContact) {
    activeContact.lastMsg = text;
  }

  inputText.value = "";
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== "Enter") return;
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
    sendMessage();
  }
};

const [isTalk, toggleTalk] = vuseToggle();

const selectContact = (id: number) => {
  activeContactId.value = id;
  isTalk.value = true;
};

const getActiveContactName = () => {
  return (
    contacts.value.find((contact) => contact.id === activeContactId.value)
      ?.name || "小明"
  );
};

const scrollToBottom = async () => {
  await nextTick();
  if (!dialogBodyRef.value) return;
  dialogBodyRef.value.scrollTop = dialogBodyRef.value.scrollHeight;
};

onMounted(() => {
  isTalk.value = true;
  scrollToBottom();
});

watch(
  () => [activeContactId.value, currentMessages.value.length],
  () => {
    scrollToBottom();
  },
);
</script>

<template>
  <div class="dialog-container">
    <aside class="sidebar">
      <div class="sidebar-title">聊天列表</div>
      <div
        class="contacts border rounded d-flex flex-row align-items-center gap-3 px-2 py-2 mb-2"
        :class="{ active: activeContactId === item.id }"
        v-for="item in contacts"
        :key="item.id"
        @click="selectContact(item.id)"
      >
        <div class="avatar">
          <BAvatar />
        </div>
        <div class="detail">
          <div class="username">{{ item.name }}</div>
          <div class="last-msg">{{ item.lastMsg }}</div>
        </div>
      </div>
    </aside>

    <div
      v-if="isTalk == true"
      class="dialog border shadow-sm d-flex rounded-3 flex-column mx-auto"
    >
      <div
        class="dialog-header border-bottom rounded-2 px-3 py-2 d-flex flex-row align-items-center justify-content-center"
      >
        <div class="name fw-bold">{{ getActiveContactName() }}</div>
        <BDropdown
          no-caret
          variant="light"
          offset="25"
          text="..."
          class="options"
        >
          <BDropdownItem>举报</BDropdownItem>
          <BDropdownItem variant="danger" @click="toggleTalk()"
            >关闭聊天</BDropdownItem
          >
        </BDropdown>
      </div>
      <div ref="dialogBodyRef" class="dialog-body p-3">
        <div
          v-for="msg in currentMessages"
          :key="msg.id"
          :class="['message-row', msg.type]"
        >
          <div class="op-avatar">
            <BAvatar v-if="msg.type === 'op'" />
            <BAvatar v-else src="s.png" />
          </div>

          <div
            :class="['msg-box', msg.type === 'op' ? 'op-box' : 'my-box']"
            class="border rounded p-2"
          >
            <div class="content">{{ msg.content }}</div>
          </div>
        </div>
      </div>
      <div class="dialog-footer border-top p-2">
        <div class="input-group">
          <textarea
            v-model="inputText"
            class="form-control"
            placeholder="Ctrl+Enter发送消息"
            rows="2"
            style="resize: none"
            @keydown="handleKeydown"
          ></textarea>
          <BButton variant="primary" class="send-btn" @click="sendMessage"
            >发送</BButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialog-container {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 1rem;
  width: min(100%, 1100px);
  height: 700px;
  margin: 0 auto;

  .sidebar {
    padding: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 1rem;
    background-color: rgba(255, 255, 255, 0.6);
    max-height: 700px;
    overflow-y: auto;
    overflow-x: hidden;
    overflow-anchor: none;
    direction: ltr;
    scrollbar-width: thin;
    scrollbar-color: #9aa0a6 transparent;

    .sidebar-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #6c757d;
      margin-bottom: 0.8rem;
      padding-left: 0.2rem;
    }

    &::-webkit-scrollbar {
      width: 8px;
      background: transparent;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #9aa0a6;
      border-radius: 6px;
      border: 2px solid transparent;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #6b7280;
    }

    .contacts {
      min-height: 64px;
      background-color: rgba(255, 255, 255, 0.7);
      transition: transform 0.3s ease;
      will-change: transform;

      .avatar {
        position: relative;
      }

      .detail {
        min-width: 0;

        .username {
          max-width: 170px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-weight: 600;
          font-size: 0.92rem;
        }

        .last-msg {
          max-width: 170px;
          color: #6c757d;
          font-size: 0.78rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      &:hover {
        cursor: pointer;
        transform: scale(1.02);
      }

      &.active {
        border-color: rgba(13, 110, 253, 0.4) !important;
        background-color: rgba(13, 110, 253, 0.08);
      }
    }
  }
}

.dialog {
  height: 700px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f8f9fa;

  .dialog-header {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.75);
    position: relative;

    .name {
      max-width: calc(100% - 80px);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .options {
      position: absolute;
      right: 0;
    }
  }

  .dialog-body {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    width: 100%;
    overflow-y: auto;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);

    .message-row {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      max-width: 100%;

      &.my {
        flex-direction: row-reverse;

        .msg-box {
          text-align: right;
        }
      }
    }

    .msg-box {
      max-width: min(72%, 36rem);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .my-box {
      background-color: #e7f1ff;
    }

    .op-box,
    .my-box {
      flex-wrap: wrap;
      height: fit-content;

      .content {
        width: 100%;
        display: block;
        overflow-wrap: anywhere;
        word-break: break-word;
        white-space: pre-wrap;
      }
    }
  }

  .dialog-footer {
    width: 100%;
    max-height: 150px;
    background-color: rgba(255, 255, 255, 0.75);

    textarea {
      overflow-y: auto;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .send-btn {
      min-width: 88px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}

@media (max-width: 960px) {
  .dialog-container {
    grid-template-columns: 1fr;
    height: auto;

    .sidebar {
      max-height: 220px;
    }
  }

  .dialog {
    height: 600px;
  }
}
</style>
