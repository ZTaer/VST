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
     * #0 初始化区域
     */
    // a) dom
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

    // b) 渲染css
    const BuildStyles = ( mainCss ) => {
        const writeTextContainerStyles = document.createElement('style');
        writeTextContainerStyles.textContent=mainCss;
        headTarget.appendChild( writeTextContainerStyles );
    };


    // c) 逻辑执行
    BuildStyles( mainCss );     // 渲染css

    /**
     * #1 String
     */
    const GetString = {
        WATCH_TARGET: ".well--text--2H_p0",                             // 监听字幕
        WRITE_TARGET_POS: ".curriculum-item-view--content--3ABmp",      // 渲染字幕位置
        WRITE_TEXT_CONTAINER: "writeTextContainer",                     // 渲染字幕容器
        WRITE_TARGET: "writeText",                                      // 渲染字幕
        AUTHOR_MSG: "Udemy 翻译字幕v0.0.1 - 作者: __OO7__",
        NO_TEXT: "( 空 )",
    };

    /**
     * #2 Dom
     */
    let watchTarget = document.querySelector( GetString.WATCH_TARGET );
    let writeTargetPos = document.querySelector(GetString.WRITE_TARGET_POS);
    let writeTarget = document.querySelector(`#${GetString.WRITE_TARGET}`);
    let timer, median, timerForUrl;
    let oldUrl = location.href;

    /**
     * #3 HTML
     */

    // a) 渲染字幕
    const BuildWriteText = () => {
        const writeTextContainer = document.createElement('div');
        writeTextContainer.id = GetString.WRITE_TEXT_CONTAINER;

        const writeText = document.createElement('p');
        writeText.id = GetString.WRITE_TARGET;
        writeText.textContent = GetString.AUTHOR_MSG;

        writeTargetPos.appendChild( writeTextContainer );
        writeTextContainer.appendChild( writeText );
    };  

    /**
     * #4 逻辑构建区域
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
                    writeTarget = document.querySelector(`#${GetString.WRITE_TARGET}`);
                }
                if( watchTextNoSpace !== writeTextNoSpace ){
                    writeTarget.textContent = watchText;
                    median = watchText;
                }
            }else{
                watchTarget = document.querySelector( GetString.WATCH_TARGET );
                writeTargetPos = document.querySelector(GetString.WRITE_TARGET_POS);
                console.log( "检测字幕中...." );
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
     * #5 逻辑执行区域
     */
    handleWatchTarget();
    handleWatchUrl();

})();