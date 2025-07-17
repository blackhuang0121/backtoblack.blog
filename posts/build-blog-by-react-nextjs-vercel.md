---
title: "關於 Nest.js Blog 的誕生 - 我的「backtoblack.blog」上線啦！"
draft: false
date: "2025-07-15"
travel_date: ""
cover: "/img/nextjsblog/201389970005.JPEG"
description: "分享從手刻到使用 Next.js 框架架站、Markdown 直接撰寫內容，以及使用 Vercel 部署、透過 Git 在 GitHub 做版本控管的心路歷程。"
category: "essays"
tags: ["隨筆", "前端", "Next.js", "Vercel",]
city: "台北"
country: "台灣"
---

## 架設部落格的起心動念

就是想將**拍過的照片，去過的地方寫成的遊記**有地方紀錄，幾年前就先試著整理在 `Notion` 頁面並設為公開，但一方面又想追求完美，所以一直在尋找更好的呈現方式。
![描述文字3](/img/nextjsblog/nextjsblog1.png)
<!-- ![台南漁光島](/img/nextjsblog/201389970005.JPEG) -->

## 開始接觸前端，用靜態手刻的方式做了前兩代部落格

2023年底先在 Figma 畫了網站的 Wireframe，剛好也跟著朋友的工程師朋友上了為期一年的前端課，便試著從 `HTML`、`CSS`、`JavaScript` 著手刻板，並用 GitHub Pages 發布，初代網站就這樣誕生了。

![Wireframe at Figma-1](/img/nextjsblog/nextjsblog2.png)
![Wireframe at Figma-2](/img/nextjsblog/nextjsblog3.png)

一路上跌跌撞撞，從`全手刻 + Github Pages 部署`、`全手刻 + Netlify 部署`、`全手刻 + Netlify CMS 寫內容與部署`、`手刻 + Hugo 模板 + Netlify`...全試過一輪。

還是想要一次到位，所以網站遲遲沒有公開，架構一路修修改改，內容也先停止更新。

因為想要做的網站需要不定期推出文章、相簿作為內容，因此去（2024）年九月開始嘗試搭配 Netlify CMS 做為內容後台。
某天晚上邊搜尋資料邊試，就成功開啟 CMS 權限，也可以開始使用後台編輯文章了——第二代網站登場。

趕緊把已經寫好了幾篇文章丟上去，按了 `Publish`，回到網站卻沒有看到文章跑出來。

「哎呀，看來是碰到 bug 了。」

---

之後就是幾天的徒勞無功嘗試，問了工程師朋友才發現是 markdown 與 html 的渲染問題，目前光靠 Netlify 無法做到，網站就又因此放置了兩個多月。

直到十一月底，花了週六整日的時間窩在咖啡廳尋找替代方案，`手刻 + Hugo 模板 + Netlify`的方案出現在搜尋引擎的搜尋結果上。

![Hugo and Netlify-1](/img/nextjsblog/nextjsblog4.png)
![Hugo and Netlify-2](/img/nextjsblog/nextjsblog5.png)


Hugo 作為靜態網站生成器，是很好的解決方案，適合透過不同主題展示一頁式，或者是簡單、不需頻繁更新內容的網站，但終究與部落格需要的內容後台、內容路徑管理不太相容。
時間快轉到今（2025）年六月，於最後一次測試後，確認無法滿足需求，便又捨棄了這條路。

## Next.js 登場

今（2025）年六月，也是離職後的第三個月，剛從歐洲走一圈回來的我正在比較有系統的整理前份工作比較凌亂碰到的 Python 架構，以及去（2024）跟著老師學的 JavaScript 內容，實際做了`API 串接永豐金證券的股票專案`，以及`爬蟲抓告示牌榜單自動更新並公告的專案`兩個小專案。

「靜態網站刻好後，可以接著研究框架」，想到去（2024）年中另一個做雲端工程師的朋友那時有給個這樣的回饋，似懂非懂的我開始三方作業——邊問 ChatGPT，邊問工程師朋友，邊上網爬資料，慢慢建構出概念。

--- 

先將去年做過的幾個前端小專案整理成一個簡易作品集網站—— [我的 Frontend projects](https://frontend-projects-zeta-ivory.vercel.app/)，也當作 Next.js 架站的 Beta 測試，
安裝好 `npm` 後，在 VS Code Terminal 輸入以下指令就可以開始安裝了。

```js
npm create next-app
```

依照步驟依序勾選，Next.js 也有支援 TypeScript，但基礎還不是很熟的我選擇先慢慢來，就維持 JavaScript 的語法。
勾選完會顯示 `Success: Create xxx at 絕對路徑`，等於把整個 Next.js 架構架好了。

![Create Next.js](/img/nextjsblog/nextjsblog6.png)
![Create Next.js-2](/img/nextjsblog/nextjsblog7.png)

VS Code 畫面左側就是整個資料夾的內容，也有提供 local host，輸入

```js
npm run dev
```
即可看即時編輯的狀態。

![Create Next.js-3](/img/nextjsblog/nextjsblog8.png)

## Next.js 初探
架構就是 `src`、`public` 兩個資料夾，
src 的內容展開會有

1. app：即 router，會自動抓取裡面子資料夾作為路徑
2. components（後來建立）：放置 Header、HeroImage、Footer 等每個頁面都會出現的內容，維護性高。
  
---

## 文章列表與文章內容

Next.js 提供 `react-markdown` module，可以將 markdown 渲染成 html，再把它引入到 Posts 頁面，即可呈現內容。
因此現在就是採取 markdown 編輯，稍微重新複習 markdown 語法後，便將版面用的簡單漂亮了。

![Post page](/img/nextjsblog/nextjsblog11.png)
![Post page-2](/img/nextjsblog/nextjsblog12.png)
![Post page-3](/img/nextjsblog/nextjsblog13.png)
![Post page-4](/img/nextjsblog/nextjsblog14.png)

---

`React markdown` 就是引入在 code 裡面，就很簡單了
![react markdown](/img/nextjsblog/nextjsblog15.png)

版面也從原本基礎的文字，改成 cover photo、h2、discription、date 的漂亮版型。

![Posts](/img/nextjsblog/nextjsblog9.png)
![Posts-2](/img/nextjsblog/nextjsblog10.png)

## 目前架構與下一步

Blog 架構
1. Next.js：React 架構，負責前端渲染（支援 SSG/SSR/ISR）、SEO、路由、資料取得。
2. Vercel：部署平台，與 GitHub 連動，每次 push 自動部署新版網站。
3. 內容儲存：
   1. Markdown（文章）
   2. JSON/陣列（相簿）
4.  圖片：集中存放在 Flickr，動態拉取
5. 內容管理：可用如 Notion/自製後台/第三方 headless CMS（未來可彈性擴充）。

算是長久的路，也用了 Git 管理版本，也設置了 GitHub Actions，每當 push 回 main 後，即會把目前內容的 metadata 抓到 gsheet 保存

> "Don't wait for the tide just to dip both your feet in." - Beabadoobee，覺得有趣就 give yourself a try，共勉之。
