// ==UserScript==
// @name         UdemyTranslation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *www.udemy.com/course/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 初始化区域
     */
    // a) dom
    let bodyTarget = document.querySelector("body");
    let headTarget = document.querySelector("head");
    let mainCss = `
#writeTextContainer {
  text-align: center;
  position: fixed;
  bottom: 5%;
  left: 0;
  width: 100%;
  margin: 0px;
  padding: 0px;
  z-index: 9999;
}
#writeTextContainer #writeText {
  border-radius: 5px;
  width: 75%;
  margin: 0px auto;
  text-align: center;
  padding: 0.5rem;
  font-size: 45px;
  background-color: #000;
  color: #fff;
  min-height: 64px;
}
    `;

    // b) HTML渲染相关
    const BuildStyles = ( mainCss ) => {
        const writeTextContainerStyles = document.createElement('style');
        writeTextContainerStyles.textContent=mainCss;
        headTarget.appendChild( writeTextContainerStyles );
    };


    // c) 逻辑执行
    BuildStyles( mainCss );     // 渲染css

    /**
     * 主要内容区域 ↓
     */

    /**
     * Dom
     */
    let watchTarget = document.querySelector(".well--text--2H_p0");
    let writeTargetPos = document.querySelector(".curriculum-item-view--content--3ABmp");
    let writeTarget = document.querySelector("#writeText");
    let timer, median, timerForUrl;
    let oldUrl = location.href;

    /**
     * HTML
     */
    const BuildWriteText = () => {
        const writeTextContainer = document.createElement('div');
        writeTextContainer.id = "writeTextContainer";
        writeTextContainer.classList.add("write-text-container");

        const writeText = document.createElement('p');
        writeText.id = "writeText";
        writeText.classList.add("write-text");
        writeText.textContent="Udemy 翻译字幕v0.0.2 - 作者: __OO7__";

        writeTargetPos.appendChild( writeTextContainer );
        writeTextContainer.appendChild( writeText );
    };

    /**
     * 逻辑构建区域
     */

    // a) 清除字符串空格
    const clearStringSpace_utils = ( str ) => {
        return str.replace(/\s+/g, "");
    };

    // b) 字幕渲染监听逻辑
    const handleWatchTarget = () => {
        timer = setInterval( () => {
            if( watchTarget && writeTargetPos ){
                let watchText = watchTarget.textContent;

                let watchTextNoSpace = clearStringSpace_utils( watchText );
                let writeTextNoSpace = median ? clearStringSpace_utils( median ) : "";

                if( !writeTarget ){
                    // 渲染字幕组件
                    BuildWriteText();
                    writeTarget = document.querySelector("#writeText");
                }
                if( watchTextNoSpace !== writeTextNoSpace ){
                    console.log("更新",watchTextNoSpace, writeTextNoSpace, "xxx" );
                    writeTarget.textContent = watchText;
                    median = watchText;
                }
            }else{
                watchTarget = document.querySelector(".well--text--2H_p0");
                writeTargetPos = document.querySelector(".curriculum-item-view--content--3ABmp");
                console.log( "加载中...." );
            }

        }, 150 );
    };

    // c) 停止字幕渲染操控逻辑
    const handleCloseTarget = () => {
       clearInterval( timer );
    };

    // d) 监听url，如果url发生变化，则重新加载页面
    const handleWatchUrl = () => {
        timerForUrl = setInterval( () => {
           const nowUrl = location.href;
           if( nowUrl !== oldUrl ){
               console.log('重新加载');
               oldUrl = nowUrl;
               handleCloseTarget();
               location.reload();
           }
        }, 500 );
    };

    // e) 关闭监听url
    const handleCloseWatchUrl = () => {
        clearInterval( timerForUrl );
    };

    /**
     * 逻辑执行区域
     */
    handleWatchTarget();
    handleWatchUrl();

})();