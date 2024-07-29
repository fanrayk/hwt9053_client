const net = require("net");
const Respository = require("./Respository/Respository");

require("dotenv").config();

const token = process.env.TOKEN;

// 建立一個TCP伺服器
const server = net.createServer((socket) => {
  // 新的連線建立時的處理
  console.log("Client connected");

  let isFetchEnabled = true;
  // 當收到客戶端發送的資料時的處理
  socket.on("data", (data) => {
    // 創建本地時間的 Date 物件
    let localTime = new Date();

    // 格式化本地時間
    let formattedTime = localTime.toLocaleString("zh-TW", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });

    const user = new Respository("hwt9053");
    try {
      let jsondata = JSON.parse(data);
      // console.log(
      //   `Received data from client: ${JSON.stringify(jsondata, null, 2)}`
      // );
      user.create(jsondata).then(async (res) => {
        console.log(res.dataValues);
      });
    } catch (error) {
      if (isFetchEnabled) {
        // Your fetch code here
        fetch("https://notify-api.line.me/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: `message= ${formattedTime} ${data.toString()}`,
        });

        isFetchEnabled = false; // 禁用fetch
        setTimeout(() => {
          isFetchEnabled = true; // 5分钟后重新启用fetch
        }, 5 * 60 * 1000); // 5分钟，以毫秒为单位
      } else {
        console.log("距离上一次fetch不到5分钟，不执行fetch操作。");
      }
    }
  });

  // 當客戶端斷開連線時的處理
  socket.on("end", () => {
    console.log("Client disconnected");
  });

  // 當發生錯誤時的處理
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

// 聆聽指定的端口和主機
const port = 8888;
const host = "192.168.50.76";
server.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
