// ==UserScript==
// @name         UdemyTranslation
// @namespace    https://github.com/ZTaer/VST
// @version      0.1.8
// @description  辅助Udemy进行视频字幕，实时翻译
// @author       __OO7__
// @match        *www.udemy.com/course/*
// @updateURL    https://cdn.jsdelivr.net/gh/ZTaer/VST@master/main.js
// @grant        none
// ==/UserScript==

(async () => {
  "use strict";

  /**
   * #0 初始化区域
   */
  // a) dom
  let headTarget = document.querySelector("head");
  let mainCss = `
    .write-text-container {
    text-align: center;
    position: fixed;
    bottom: 5%;
    left: 0;
    width: 100%;
    margin: 0px;
    padding: 0px;
    z-index: 9999;
    }
    .write-text-container .write-text {
    border-radius: 5px;
    width: 75%;
    margin: 0px auto;
    text-align: center;
    padding: 0.5rem;
    font-size: 45px;
    background-color: #000;
    color: #fff;
    min-height: 64px;
    max-width: unset;
    }
    .write-text-container .write-text::selection {
    color: #F48982;
    background-color: #007791;
    }

    .temporarily-hide {
    opacity: 0;
    z-index: -1;
    }

    `;

  // b) 渲染css
  const BuildStyles = (mainCss) => {
    const writeTextContainerStyles = document.createElement("style");
    writeTextContainerStyles.textContent = mainCss;
    headTarget.appendChild(writeTextContainerStyles);
  };

  // c) 逻辑执行
  BuildStyles(mainCss); // 渲染css

  /**
   * #1 String
   */
  const GetString = {
    WATCH_TARGET: ".well--text--J1-Qi", // 监听字幕
    // WRITE_TARGET_POS: ".curriculum-item-view--content--3ABmp",      // 渲染字幕位置
    WRITE_TARGET_POS: "body", // 渲染字幕位置
    WRITE_TEXT_CONTAINER: "writeTextContainer", // 渲染字幕容器
    WRITE_TEXT: "writeText", // 渲染字幕
    WRITE_TEXT_CONTAINER_FULL_SCREEN: "writeTextContainerFullScreen", // 渲染全屏字幕容器
    WRITE_TEXT_FULL_SCREEN: "writeTextFullScreen", // 渲染全屏字幕
    AUTHOR_MSG: "Udemy 翻译字幕v0.1.7 - 作者: __OO7__",
  };

  /**
   * #2 Dom
   */
  let watchTarget = document.querySelector(GetString.WATCH_TARGET);
  let writeTargetPos = document.querySelector(GetString.WRITE_TARGET_POS);
  let writeTarget = document.querySelector(`#${GetString.WRITE_TEXT}`);
  let timer, median, timerForUrl, timerForCN;
  let oldUrl = location.pathname;
  let buildStart = false;

  /**
   * #3 HTML
   */

  // a) 渲染字幕
  const BuildWriteText = () => {
    const writeTextContainer = document.createElement("div");
    writeTextContainer.id = GetString.WRITE_TEXT_CONTAINER;
    writeTextContainer.classList.add(
      "write-text-container",
      "temporarily-hide"
    );

    const writeTextContainerFullScreen = document.createElement("div");
    writeTextContainerFullScreen.id =
      GetString.WRITE_TEXT_CONTAINER_FULL_SCREEN;
    writeTextContainerFullScreen.classList.add("write-text-container");

    const writeText = document.createElement("p");
    writeText.id = GetString.WRITE_TEXT;
    writeText.textContent = GetString.AUTHOR_MSG;
    writeText.classList.add("write-text");

    const writeTextFullScreen = document.createElement("p");
    writeTextFullScreen.id = GetString.WRITE_TEXT_FULL_SCREEN;
    writeTextFullScreen.textContent = GetString.AUTHOR_MSG;
    writeTextFullScreen.classList.add("write-text");

    writeTargetPos.appendChild(writeTextContainer);
    writeTextContainer.appendChild(writeText);

    watchTarget.parentElement.appendChild(writeTextContainerFullScreen);
    writeTextContainerFullScreen.appendChild(writeTextFullScreen);

    buildStart = true;
  };

  /**
   * #4 逻辑构建区域
   */

  // a) 清除字符串空格
  const clearStringSpace_utils = (str) => {
    return str.replace(/\s+/g, "");
  };

  // b) 字幕渲染监听逻辑
  const handleWatchTarget = () => {
    timer = setInterval(() => {
      if (watchTarget && writeTargetPos) {
        let watchText = watchTarget.textContent;

        let watchTextNoSpace = clearStringSpace_utils(watchText);
        let writeTextNoSpace = median ? clearStringSpace_utils(median) : "";

        if (!writeTarget) {
          // 渲染字幕组件
          BuildWriteText();
          writeTarget = document.querySelector(`#${GetString.WRITE_TEXT}`);
        }
        if (watchTextNoSpace !== writeTextNoSpace) {
          writeTarget.textContent = watchText;
          median = watchText;
        }
      } else {
        watchTarget = document.querySelector(GetString.WATCH_TARGET);
        writeTargetPos = document.querySelector(GetString.WRITE_TARGET_POS);
        console.log("检测字幕中....");
      }
    }, 150);
  };

  // c) 停止字幕渲染操控逻辑
  const handleCloseTarget = () => {
    clearInterval(timer);
  };

  // d) 监听url，如果url发生变化，则重新加载页面
  const handleWatchUrl = () => {
    timerForUrl = setInterval(() => {
      const nowUrl = location.pathname;
      if (nowUrl !== oldUrl) {
        oldUrl = nowUrl;
        handleCloseTarget();
        handleCloseWatchCN();
        location.reload();
      }
    }, 500);
  };

  // e) 关闭监听url
  const handleCloseWatchUrl = () => {
    clearInterval(timerForUrl);
  };

  // d) 监听翻译后的内容( 临时性功能，未来将删除 )
  const handleWatchCN = () => {
    timerForCN = setInterval(() => {
      if (buildStart) {
        const text = document.querySelector(`#${GetString.WRITE_TEXT}`);
        const target = document.querySelector(
          `#${GetString.WRITE_TEXT_FULL_SCREEN}`
        );
        if (text && target && text.textContent !== target.textContent) {
          target.textContent = text.textContent;
        }
      }
    }, 100);
  };

  // e) 关闭监听翻译后的内容( 临时性功能，未来将删除 )
  const handleCloseWatchCN = () => {
    clearInterval(timerForCN);
  };

  /**
   * #5 逻辑执行区域
   */
  handleWatchTarget();
  handleWatchCN();
  handleWatchUrl();
})();
