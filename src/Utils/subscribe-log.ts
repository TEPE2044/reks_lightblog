import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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

export const exportSubscribePdf = async (list: SubscribeMessage[]) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const now = dayjs();
  const filename = `ReKindlers${now.format("YYYYMMDD_HHmmss")}日志.pdf`;

  const wrapper = document.createElement("div");
  wrapper.style.width = "780px";
  wrapper.style.padding = "20px";
  wrapper.style.background = "#ffffff";
  wrapper.style.color = "#1f2937";
  wrapper.style.fontSize = "14px";
  wrapper.style.lineHeight = "1.7";
  wrapper.style.fontFamily =
    "'Microsoft YaHei','PingFang SC','Noto Sans CJK SC',sans-serif";
  wrapper.style.position = "fixed";
  wrapper.style.left = "-10000px";
  wrapper.style.top = "0";
  wrapper.style.zIndex = "-1";

  const header = `
    <h2 style="margin:0 0 8px 0;font-size:18px;">ReKindlers 日志</h2>
    <div style="margin-bottom:14px;color:#6b7280;">
      导出时间：${now.format("YYYY-MM-DD HH:mm:ss")}
    </div>
  `;

  const rows = list.length
    ? list
        .map((item) => {
          const time = dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
          return `
            <div style="padding:10px 0;border-top:1px solid #e5e7eb;">
              <div style="font-weight:600;">${escapeHtml(item.title)}</div>
              <div style="color:#374151;">${escapeHtml(item.details)}</div>
              <div style="color:#9ca3af;font-size:12px;">${time}</div>
            </div>
          `;
        })
        .join("")
    : `<div style="padding:10px 0;border-top:1px solid #e5e7eb;color:#6b7280;">暂无日志</div>`;

  wrapper.innerHTML = `${header}${rows}`;
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const printableWidth = pageWidth - margin * 2;
    const printableHeight = pageHeight - margin * 2;

    const pxPerPt = canvas.width / printableWidth;
    const pageSlicePx = Math.floor(printableHeight * pxPerPt);

    let offsetPx = 0;
    let firstPage = true;

    while (offsetPx < canvas.height) {
      const sliceHeightPx = Math.min(pageSlicePx, canvas.height - offsetPx);
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;
      const ctx = pageCanvas.getContext("2d");
      if (!ctx) {
        break;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        offsetPx,
        canvas.width,
        sliceHeightPx,
        0,
        0,
        canvas.width,
        sliceHeightPx,
      );

      const imgData = pageCanvas.toDataURL("image/png");
      const renderedHeight = sliceHeightPx / pxPerPt;

      if (!firstPage) {
        doc.addPage();
      }
      firstPage = false;

      doc.addImage(imgData, "PNG", margin, margin, printableWidth, renderedHeight);
      offsetPx += sliceHeightPx;
    }

    doc.save(filename);
  } finally {
    document.body.removeChild(wrapper);
  }
};
