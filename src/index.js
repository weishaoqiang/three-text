< !DOCTYPE html >
  <html lang="en">
    <head>
      <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>第一个threejs</title>
          <style>
            input, button {
              outline: none;
      border: 0 none;
      padding: 0;
      background-color: transparent;
    }
    .container {
              position: relative;
    }
    .operation {
              position: absolute;
      top: 50px;
      left: 30px;
      width: 240px;
      height: auto;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 2px 2px 4px 2px rgba(23, 23, 23, 0.3);
      padding: 20px 0;
    }
    .item {
              width: 180px;
      margin: 0 auto 10px;
      border: 1px solid #cecece;
      box-sizing: border-box;
      border-radius: 3px;
      overflow: hidden;
    }
    .item > input {
              height: 32px;
      line-height: 32px;
      text-indent: 10px;
    }
    .item > button {
              width: 100%;
      text-align: center;
      height: 32px;
      line-height: 32px;
      text-indent: 10px;
      color: #fff;
      background-color: #4b4bd2;
    }
  </style>
</head>
        <body>
          <div class="container">
            <div class="operation">
              <div class="item">
                <input type="text" placeholder="请输入字体大小">
      </div>
                <div class="item">
                  <input type="text" placeholder="请输入字体间隙">
      </div>
                  <div class="item">
                    <input type="text" placeholder="请输入字体厚度">
      </div>
                    <div class="item btn">
                      <button>确定</button>
                    </div>
                  </div>
                  <div id="app"></div>
                </div>
</body>
</html>