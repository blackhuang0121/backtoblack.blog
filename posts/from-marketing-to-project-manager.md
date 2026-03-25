---
title: "Behind The Scenes - 從 B2B 行銷到 B2B 系統導入顧問（專案經理）的心路歷程"
draft: true
date: "2026-03-13"
travel_date: ""
cover: "/img/BlogSwitchCareer/DSCF2728.JPG"
description: "分享從手刻到使用 Next.js 框架架站、Markdown 直接撰寫內容，以及使用 Vercel 部署、透過 Git 在 GitHub 做版本控管的心路歷程。"
category: "essays"
tags: ["隨筆", "轉職", "Project Manager", "PM", "Consultant", "B2B", "CDP"]
city: "台北"
country: "台灣"
---

## 回顧過往職涯

前後在**行銷的工作也做了**幾年
1. B2B 日本市場行銷助理
2. 


後來有機會轉到甲方，選擇與鮮乳坊合作，針對會員經營
的職涯

- 行銷經驗
    - 內容行銷
    - SEO
    - 社群
    - 會員
    - B2B
- 2023 年選擇進入鮮乳坊，是因為專注在「會員經營」，以及「分析」，也因為對於工具的需求，也負責工具的導入，以及幾個專案的整體規劃，慢慢瞭解到，在大方向協助品牌（不論是 in-house 或乙方），是有興趣的事（更不論客觀來說比較有發展性。
- 工作到後來，發現流程 + 技術，是有興趣的事，也花了一年上了程式課，雖然後來覺得不一定要親身動手做，以 PM角色好好統整的話，可以更有影響力（尤其是自己以 PM 身份負責鮮乳坊專案時，也感受到缺乏經驗、缺乏技術、缺乏溝通的情況下，對於專案推進有影響 → 所以更覺得 `PM` 很重要。
    - 無法掌握最合適的機會何時出現，能做的只有準備好自己（轉職的時候尤其如此）

![Wireframe at Figma-2](/img/nextjsblog/nextjsblog3.png)

- 

## 為何想轉職

![Wireframe at Figma-2](/img/nextjsblog/nextjsblog3.png)



一路上跌跌撞撞，從`全手刻 + Github Pages 部署`、`全手刻 + Netlify 部署`、`全手刻 + Netlify CMS 寫內容與部署`、`手刻 + Hugo 模板 + Netlify`...全試過一輪。



---



## 做了什麼事（不是轉職才要做事，經驗是一路累積）

跟朋友上了課

PS 相關內容可以參考文章—— [我的 Frontend projects](https://frontend-projects-zeta-ivory.vercel.app/)



## 對於技術與 PM 的想像

1. 跟上市場趨勢、需求（以 CDP 系統為例，行銷經驗加分；產業商業面加分）
2. 多方溝通，將技術語言白話文
3. 注重細節，反應力

--- 

先將去年做過的幾個前端小專案整理成的簡易作品集網站—— [關於 Nest.js Blog - 我的部落格「backtoblack.blog」上線啦！](https://backtoblackblog.vercel.app/posts/build-blog-by-react-nextjs-vercel)。

下載好 `Node.js` 後，`npm`會一起安裝好，就可以透過 VS Code Terminal 輸入以下指令可以開始安裝 Next.js 了。

```js
npm create next-app
```


`public`、`src`是主要的兩個資料夾，前者放置本機的資料，如內文圖片；後者則是主要編輯的地方，可以再細分為：

1. app：即 router，也是 `Next.js` 框架強大的地方，部署後會**自動抓取裡面子資料夾作為路徑**，如 `posts` 資料夾的就是每篇文章的路徑，e.g. backtoblack.blog/posts/kyoto-2025、backtoblack.blog/posts/london-2024。
2. components：因 Next.js 是使用 React 作為基礎，所以 React 模組化的概念同樣能夠使用，可以將會於網站重複出現的區塊，e.g. Header、HeroImage、Footer 等獨立放在這裡，再**引用到其他路徑，減輕各路徑的內容複雜度，有更新需求時，僅需要更改這裡的內容即可套用在所有使用到的路徑**。
  
---

## 下一步？職涯目標是什麼？

重點：
- PM 身份用力工作，目標每個類型（客戶產業、整合平台、串接方式）都碰一次
- 持續靠近技術、產品（保留任何機會、產品經理、工程師、PM）
- 往上變成資深，累積籌碼

<!-- 1. Next.js：React 架構，負責前端渲染（支援 SSG/SSR/ISR）、SEO、路由、資料取得。
2. Vercel：部署平台，與 GitHub 連動，每次 push 自動部署新版網站。
3. 內容儲存：Markdown（文章）/ JSON/陣列（相簿）
4.  圖片：主要集中存放在 Flickr，動態拉取。
5. 內容管理：可用如 Notion /自製後台 / 第三方 headless CMS（保留未來彈性擴充空間）。
6. 其他：使用 Git 管理版本，也設置 GitHub Actions，每當 push 回 main 後，即會把目前內容的 metadata 抓到 gsheet 保存。 -->

> "Don't wait for the tide just to dip both your feet in." - Beabadoobee

從上線到現在約莫十天，也陸續增加了一些功能，如`ImageSlider`、`SidebarMenu`、`內容末段點擊前往上下篇`、`ImageLightbox`，已經算是非常符合當初對於部落格的想像，其他如`DarkModeTuggle`、`PhotoAlbum`等優化也在排程中，希望能在**維持簡潔的版型下，透過舒服的使用者體驗瀏覽內容**。

覺得有趣就 give yourself a try，才會知道是不是真的有趣，共勉之。😎
