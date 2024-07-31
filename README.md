### 5. 安裝 PM2

安裝 build-essential：

```bash
sudo apt install build-essential
```

安裝 PM2：

```bash
sudo npm install pm2 -g && pm2 update
```

設置 PM2 開機自動啟動：

```bash
sudo pm2 startup
```

### 6. 安裝 Python 虛擬環境

安裝 python3-venv：

```bash
sudo apt install python3-venv
```

進入 pressure.py 所在的資料夾：

```bash
cd 到 pressure.py 所在的資料夾
```

創建並啟動虛擬環境：

```bash
python3 -m venv .venv
source ./.venv/bin/activate
```

安裝所需的 Python 庫：

```bash
pip install paho-mqtt adafruit-circuitpython-ads1x15 apscheduler
```

停止虛擬環境：

```bash
deactivate
```