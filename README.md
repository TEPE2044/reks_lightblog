# ReKindlers 焠星者
> 旋律与文字在虚空中交织，以妄想为透镜的缔造者，正站在乐园的视界边缘，静候一道来自光年之外、尚未被解码的共振信号。    

## 音乐轻博客

#### 富文本 - 自定义音乐卡片
- 关键点（官方示例看不懂就记这 3 步）
- 写一个菜单类：实现 IModalMenu，重点是 getModalContentElem() 返回弹窗里的 DOM。
- 全局注册菜单：Boot.registerMenu({ key, factory })，而且要在编辑器渲染前执行一次（我放到 main.ts 里 import）。
- 把 key 加到工具栏：toolbarKeys 里加你的菜单 key。