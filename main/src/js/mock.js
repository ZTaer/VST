(function() {
    'use strict';

    // Your code here...
    // 关闭clearInterval( timer );	

    /**
     * dom
     */
    let targetContent = document.querySelector("#targetContent"); 

    /**
     * mock数据
     */
    let initNumber = 0;
    let engFont = ["test", "apple", "ok", "yes", "door"];    

    /**
     * 模拟变换数据
     */
    const timer = setInterval( () => {    
        targetContent.textContent = engFont[ initNumber ];
        console.log('test')
        
        initNumber = initNumber + 1;
        if( initNumber >= engFont.length ){
            // 终止循环
            initNumber = 0;
        }
    }, 2000 );
    
})();