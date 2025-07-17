---
title: "關於 Nest.js Blog - 我的部落格「backtoblack.blog」上線啦！"
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

## 開始接觸前端，用靜態手刻的方式做了前兩代部落格

2023年底先在 Figma 畫了網站的 Wireframe，剛好也跟著朋友的工程師朋友上了為期一年的前端課，便試著從 `HTML`、`CSS`、`JavaScript` 著手刻板，並用 GitHub Pages 發布，初代網站就這樣誕生了。

![Wireframe at Figma-1](/img/nextjsblog/nextjsblog2.png)
![Wireframe at Figma-2](/img/nextjsblog/nextjsblog3.png)

一路上跌跌撞撞，從`全手刻 + Github Pages 部署`、`全手刻 + Netlify 部署`、`全手刻 + Netlify CMS 寫內容與部署`、`手刻 + Hugo 模板 + Netlify`...全試過一輪。

還是想要一次到位，所以網站遲遲沒有公開，架構一路修修改改，內容也先停止更新。

因為想要做的網站需要不定期推出文章、相簿作為內容，因此去（2024）年九月開始嘗試搭配 Netlify CMS 做為內容後台。
某天晚上邊搜尋資料邊試，就成功開啟 CMS 權限，也可以開始使用後台編輯文章了——第二代網站登場。

趕緊把已經寫好了幾篇文章丟上去，按了 `Publish`，回到網站卻沒有看到文章順利跑出來。

「哎呀，看來是碰到 bug 了。」

---

之後幾天的嘗試都落得徒勞無功，問了工程師朋友才發現是 Markdown 與 HTML 的渲染問題，目前光靠 Netlify 無法做到，網站就又因此放置了兩個多月。

直到十一月底，花了週六整日的時間窩在咖啡廳尋找替代方案，`手刻 + Hugo 模板 + Netlify`的方案出現在搜尋引擎的搜尋結果上。

![Hugo and Netlify-1](/img/nextjsblog/nextjsblog4.png)
![Hugo and Netlify-2](/img/nextjsblog/nextjsblog5.png)


Hugo 作為靜態網站生成器，是很好的解決方案，適合透過不同主題展示一頁式，或者是簡單、不需頻繁更新內容的網站，但終究與部落格需要的內容後台、內容路徑管理不太相容。
時間快轉到今（2025）年六月，於最後一次測試後，確認無法滿足需求，便又捨棄了這條路。

## Next.js 登場

今（2025）年六月，也是離職後的第三個月，剛從歐洲走一圈回來的我正在比較有系統的整理前份工作比較凌亂碰到的 Python 架構，以及去（2024）跟著老師學的 JavaScript 內容，實際做了`API 串接永豐金證券的股票專案`，以及`爬蟲抓告示牌榜單自動更新並公告的專案`兩個小專案。

「靜態網站刻好後，可以接著研究框架」，想到去（2024）年中另一個做雲端工程師的朋友那時有給個這樣的回饋，似懂非懂的我開始三方作業——邊問 ChatGPT，邊問工程師朋友，邊上網爬資料，慢慢建構出概念。

--- 

先將去年做過的幾個前端小專案整理成的簡易作品集網站—— [我的 Frontend projects](https://frontend-projects-zeta-ivory.vercel.app/)當作 Beta 測試。

下載好 `Node.js` 後，`npm`會一起安裝好，就可以透過 VS Code Terminal 輸入以下指令可以開始安裝 Next.js 了。

```js
npm create next-app
```

依照步驟依序勾選，Next.js 也有支援 TypeScript，但基礎還不是很熟的我選擇先慢慢來，就維持 JavaScript 的語法。
勾選完會顯示 `Success: Create xxx at 絕對路徑`，等於把整個 Next.js 架構架好了。

![Create Next.js](/img/nextjsblog/nextjsblog6.png)
![Create Next.js-2](/img/nextjsblog/nextjsblog7.png)

VS Code 畫面左側就是整個資料夾的內容，可以依照下方指令開啟 localhost 即時查看目前的編輯狀況。

```js
nvm use --lts ## 查看目前的 Node.js 版本

npm run dev ## 執行本機 localhost，即時查看目前的編輯狀況
```

![Create Next.js-3](/img/nextjsblog/nextjsblog8.png)

## 初探 Next.js

`public`、`src`是主要的兩個資料夾，前者放置本機的資料，如內文圖片；後者則是主要編輯的地方，可以再細分為：

1. app：即 router，也是 `Next.js` 框架強大的地方，部署後會**自動抓取裡面子資料夾作為路徑**，如 `posts` 資料夾的就是每篇文章的路徑，e.g. backtoblack.blog/posts/kyoto-2025、backtoblack.blog/posts/london-2024。
2. components：因 Next.js 是使用 React 作為基礎，所以 React 模組化的概念同樣能夠使用，可以將會於網站重複出現的區塊，e.g. Header、HeroImage、Footer 等獨立放在這裡，再**引用到其他路徑，減輕各路徑的內容複雜度，有更新需求時，僅需要更改這裡的內容即可套用在所有使用到的路徑**。
  
---

## Markdown 撰寫文章內容、調整文章列表版型

Next.js 提供 `react-markdown` module，可以將 markdown 渲染成 html，再把它引入到 Posts 頁面，即可呈現內容。

不同的套件，只要輸入以下指令即可快速安裝使用，[npmjs](https://www.npmjs.com/)有提供多種第三方套件使用，安裝後也會同步記錄在資料夾的 `package.json`。

```js
npm install react-markdown

npm install googleapis ## 串接 Google Sheet API

npm install yet-another-react-lightbox ## 支援內文圖片可點擊放大
```

考慮到現在內容量體不大，也為了保持日後發展擴張的彈性，因此現在先採取 markdown 編輯——透過`git 語法 add、commit、push 再 merge 回 origin main 的方式做更新`。

稍微重新複習 markdown 語法後，便將版面用的簡單漂亮了。

![Post page](/img/nextjsblog/nextjsblog11.png)
![Post page-2](/img/nextjsblog/nextjsblog12.png)
![Post page-3](/img/nextjsblog/nextjsblog13.png)
![Post page-4](/img/nextjsblog/nextjsblog14.png)

---

`React markdown` 中包的`content`就是 markdown 的文章內容，Next.js 會透過`React markdown`自動渲染呈現。

而下方的`Footer`就是先做成 Footer component，再引入到該路徑，保持內容簡潔跟更改的即時性。

![react markdown](/img/nextjsblog/nextjsblog15.png)

---

文章列表的版面也從原本只有簡單的標題與日期，改成 cover photo、h2、discription、date 的漂亮版型。

![Posts](/img/nextjsblog/nextjsblog9.png)
![Posts-2](/img/nextjsblog/nextjsblog10.png)

## Json 製作陣列，保存相簿內容

目前部落格類別安排了旅遊、相簿，以及隨筆，其中旅遊與隨筆是文章格式，相簿現階段則是希望把拍過的照片，用照片牆的方式展出，因此簡單利用 Json 陣列物件，存取多個陣列，每個陣列代表一個相簿，相簿的照片可點擊放大縮小。

![Photos json](/img/nextjsblog/nextjsblog19.png)
![Photos](/img/nextjsblog/nextjsblog20.png)
![Photos page](/img/nextjsblog/nextjsblog22.png)
![Photos page-2](/img/nextjsblog/nextjsblog23.png)

## 結合 Vercel 完成部署

由於現階段不打算碰後端內容，雖然也是可以將內容寫在 Google Sheet，再透過 Google Sheet API 跟 Next.js 整合，但還是想要使用 markdown 介面來好好編輯，所以一直都使用免費託管服務做部署。

前陣子網路爬文的時候，發現有人推 Vercel 作為託管工具，研究一下覺得使用體驗上相較 Netlify 更直觀好用，同樣整合 GitHub 的原始碼，設定一次後，之後每當有新的 `push`，就會自動化部署新的內容，且支援多種前端架構託管，更可支援靜態或是動態的渲染，保留後續網站優化的彈性（如 GitHub Pages 僅能使用靜態渲染）。

![Vercel](/img/nextjsblog/nextjsblog17.png)
![Vercel-2](/img/nextjsblog/nextjsblog18.png)

## 到這裡第三代網站算是成熟版上線了

從使用 GitHub Pages 的初代網站，到 Netlify 的二代網站作為過渡，再到現在使用 Next.js 架構的第三代網站，總算是步上軌道，可以在不定期優化功能、版型之餘，專心產出內容。

先簡單復盤一下使用到的內容：
1. Next.js：React 架構，負責前端渲染（支援 SSG/SSR/ISR）、SEO、路由、資料取得。
2. Vercel：部署平台，與 GitHub 連動，每次 push 自動部署新版網站。
3. 內容儲存：Markdown（文章）/ JSON/陣列（相簿）
1.  圖片：主要集中存放在 Flickr，動態拉取。
2. 內容管理：可用如 Notion /自製後台 / 第三方 headless CMS（保留未來彈性擴充空間）。
3. 其他：使用 Git 管理版本，也設置 GitHub Actions，每當 push 回 main 後，即會把目前內容的 metadata 抓到 gsheet 保存。

> "Don't wait for the tide just to dip both your feet in." - Beabadoobee

從上線到現在約莫十天，也陸續增加了一些功能，如`ImageSlider`、`SidebarMenu`、`內容末段點擊前往上下篇`、`ImageLightbox`，已經算是非常符合當初對於部落格的想像，其他如`DarkModeTuggle`、`PhotoAlbum`等優化也在排程中，希望能在**維持簡潔的版型下，透過舒服的使用者體驗瀏覽內容**。

覺得有趣就 give yourself a try，才會知道是不是真的有趣，共勉之。😎
