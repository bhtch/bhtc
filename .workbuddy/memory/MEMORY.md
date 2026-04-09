# MEMORY.md - 长期记忆

## 用户信息
- Gitee用户名: bhtc
- GitHub用户名: bhtch
- 邮箱: wlei85119@gmail.com
- 网络环境: 国内，需要VPN才能访问GitHub
- WhatsApp联系方式: +8618167856752

## 项目信息
- 项目: 俄语工程机械展示网站 (百贺天成 BHTC)
- 公司名: 百贺天成 (BHTC)
- 域名: bhtch.com
- 邮箱: info@bhtch.com
- GitHub仓库: https://github.com/bhtch/bhtc
- GitHub Pages地址: https://bhtch.github.io/bhtc/
- Gitee仓库: https://gitee.com/bhtc/stroytehnika (已推送，但Gitee Pages已下线)
- 技术栈: 纯静态HTML/CSS/JS，Bootstrap 5，无框架依赖
- 目标市场: 俄语区（俄罗斯、独联体）
- 语言切换: 中文/英文/俄文 (js/i18n.js, data-i18n属性)

## 网站内容 (2026-04-09 更新)
- 三个品牌: LiuGong(柳工)14台, SINOMACH(国机重工)27台, SAGMOTO(陕汽)11台 = 共52台(JSON中)
- SAGMOTO有实际美元报价（从PDF报价单提取），LiuGong和SINOMACH显示"По запросу"
- 所有页面已集成WhatsApp联系按钮
- 产品来源: 桌面文件夹 柳工/, 国机参数/, 陕商报价单/
- 产品数据提取: PDF用pdfplumber(python)，DOCX无法直接读取（SINOMACH参数从网上查）

## 后台管理系统 (2026-04-09)
- 位置: admin/admin.html (中文界面)
- 功能: 仪表盘统计、产品增删改查、搜索/品牌/分类筛选、JSON导出/导入
- 图片管理: 支持上传图片(Base64存储到JSON)和手动输入图片路径
- 图片压缩: Canvas压缩至最大800px宽, JPEG质量0.8, 限制5MB
- 数据持久化: localStorage (浏览器本地)，需手动导出JSON替换 data/products.json
- 前端渲染: js/products-render.js 从 data/products.json 动态加载产品卡片
- 技术栈: 纯HTML/CSS/JS + Bootstrap 5, 无后端服务器依赖
- 注意: admin.html 不会部署到 GitHub Pages(仅本地管理用)

## 重要经验
- Gitee Pages 已于2024年8月下线，不能再用于部署静态网站
- GitHub在国内需要VPN才能访问和推送代码
- 该网站是纯静态HTML/CSS/JS网站，无框架依赖
- PDF文件需用python pdfplumber库提取，不能直接read_file
- DOCX是ZIP格式二进制文件，不能直接read_file
- _server.js 已添加 no-cache 响应头，避免浏览器缓存旧版本问题
- product-detail.html 仍使用旧的 products.js 硬编码数据，未迁移到 i18n 和 products-render.js
