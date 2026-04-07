import dayjs from "dayjs";
import dompdf from "dompdf.js";
import type { SubscribeMessage } from "../Store/subscribe";

export interface EventPayloadData {
  authorId?: number;
  authorName?: string;
  title?: string;
  name?: string;
  kind?: string;
}

export const isFollowingEvent = (eventType: string) =>
  eventType.startsWith("following.");

export const parseEventPayload = (payload: string): EventPayloadData => {
  try {
    const data = JSON.parse(payload) as EventPayloadData;
    return data || {};
  } catch {
    return {};
  }
};

export const makeSubscribeMessage = (
  eventType: string,
  details: string,
  title?: string,
): Partial<SubscribeMessage> => ({
  eventType,
  details,
  title: title || resolveEventTitle(eventType),
  createdAt: new Date().toISOString(),
});

export const resolveEventTitle = (eventType: string) => {
  const map: Record<string, string> = {
    "user.login": "登录成功",
    "self.blog.published": "博客发布成功",
    "self.music.uploaded": "音频发布成功",
    "following.blog.published": "关注动态",
    "following.music_blog.published": "关注动态",
    "following.music.published": "关注动态",
  };
  return map[eventType] || "系统通知";
};

export const formatEventDetails = (eventType: string, payload: string) => {
  try {
    const data = parseEventPayload(payload);

    if (eventType === "following.blog.published") {
      const author = data.authorName || "你关注的人";
      const title = data.title || "(未命名)";
      return `${author} 发布了博客《${title}》`;
    }

    if (eventType === "following.music_blog.published") {
      const author = data.authorName || "你关注的人";
      const title = data.title || "(未命名)";
      return `${author} 发布了音乐博客《${title}》`;
    }

    if (eventType === "following.music.published") {
      const author = data.authorName || "你关注的人";
      const name = data.name || "(未命名)";
      return `${author} 发布了音频《${name}》`;
    }
  } catch {
    // ignore parse errors and fallback to payload text
  }
  return payload;
};

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const buildSubscribeExportElement = (
  list: SubscribeMessage[],
  exportedAt: string,
) => {
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-100000px";
  wrapper.style.top = "0";
  wrapper.style.width = "794px";
  wrapper.style.padding = "28px";
  wrapper.style.boxSizing = "border-box";
  wrapper.style.background = "#ffffff";
  wrapper.style.color = "#1f2937";
  wrapper.style.fontFamily =
    "'Alibaba-PuHuiTi-Medium', 'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', sans-serif";
  wrapper.style.fontSize = "14px";
  wrapper.style.lineHeight = "1.75";

  const rows = list.length
    ? list
        .map((item, index) => {
          const time = dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
          return `
            <article class="subscribe-export__item">
              <div class="subscribe-export__index">${index + 1}</div>
              <div class="subscribe-export__body">
                <div class="subscribe-export__title">${escapeHtml(item.title)}</div>
                <div class="subscribe-export__detail">${escapeHtml(item.details)}</div>
                <div class="subscribe-export__time">${time}</div>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="subscribe-export__empty">暂无日志</div>`;

  wrapper.innerHTML = `
    <style>
      .subscribe-export {
        width: 100%;
      }

      .subscribe-export__header {
        margin-bottom: 18px;
        padding-bottom: 14px;
        border-bottom: 1px solid #e5e7eb;
      }

      .subscribe-export__title-main {
        margin: 0;
        font-size: 22px;
        font-weight: 800;
        color: #111827;
      }

      .subscribe-export__meta {
        margin-top: 6px;
        color: #6b7280;
        font-size: 12px;
      }

      .subscribe-export__list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .subscribe-export__item {
        display: flex;
        gap: 12px;
        padding: 14px 16px;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .subscribe-export__index {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: #f3f4f6;
        color: #4b5563;
        font-size: 12px;
        font-weight: 700;
        display: grid;
        place-items: center;
      }

      .subscribe-export__body {
        flex: 1;
        min-width: 0;
      }

      .subscribe-export__title {
        font-size: 15px;
        font-weight: 800;
        color: #111827;
      }

      .subscribe-export__detail {
        margin-top: 4px;
        color: #374151;
        word-break: break-word;
      }

      .subscribe-export__time {
        margin-top: 8px;
        color: #9ca3af;
        font-size: 12px;
      }

      .subscribe-export__empty {
        padding: 18px 0;
        color: #6b7280;
      }
    </style>
    <section class="subscribe-export">
      <header class="subscribe-export__header">
        <h1 class="subscribe-export__title-main">ReKindlers 日志</h1>
        <div class="subscribe-export__meta">导出时间：${exportedAt}</div>
      </header>
      <div class="subscribe-export__list">
        ${rows}
      </div>
    </section>
  `;

  return wrapper;
};

export const exportSubscribePdf = async (list: SubscribeMessage[]) => {
  const now = dayjs();
  const filename = `ReKindlers${now.format("YYYYMMDD_HHmmss")}日志.pdf`;
  const wrapper = buildSubscribeExportElement(list, now.format("YYYY-MM-DD HH:mm:ss"));
  document.body.appendChild(wrapper);

  try {
    const result = await dompdf(wrapper, {
      pagination: true,
      format: "a4",
      backgroundColor: "#ffffff",
    });

    const blob =
      result instanceof Blob
        ? result
        : await new Promise<Blob>((resolve, reject) => {
            result.toBlob((canvasBlob) => {
              if (canvasBlob) {
                resolve(canvasBlob);
                return;
              }

              reject(new Error("Failed to create PDF blob."));
            });
          });

    downloadBlob(blob, filename);
  } finally {
    document.body.removeChild(wrapper);
  }
};
