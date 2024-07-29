import serial
import time
import serial.tools.list_ports
import threading
import socket
import json
from datetime import datetime
import pytz
from collections import deque

read_command_header = bytearray([0x50, 0x03])
write_command_header = bytearray([0x50, 0x06])

angle_command = bytearray([0x00, 0x3D])
accel_command = bytearray([0x00, 0x34])
calsw_command = bytearray([0x00, 0x01])
save_command = bytearray([0x00, 0x00])

json_key = ["x_acc", "y_acc", "z_acc", "x_ang", "y_ang", "z_ang"]
MA_filter_json_key = [
    "x_acc_filtered",
    "y_acc_filtered",
    "z_acc_filtered",
    "x_ang_filtered",
    "y_ang_filtered",
    "z_ang_filtered",
]

com_port = "/dev/ttyUSB0"  # 串口号
MA_data = {key: deque(maxlen=5) for key in json_key}
upload_data = {}


def int_to_bytearray(data: int, length: int) -> bytearray:
    # 创建一个长度为length的bytearray，初始值为0
    result = bytearray(length)
    # 将整数data转换为bytearray，并填充到result中
    for i in range(length):
        result[length - 1 - i] = (data >> (i * 8)) & 0xFF
    return result


def crc16_modbus(data: bytearray) -> bytearray:
    crc = 0xFFFF
    for byte in data:
        crc ^= byte
        for _ in range(8):
            if crc & 0x0001:
                crc = (crc >> 1) ^ 0xA001
            else:
                crc >>= 1
    return int_to_bytearray(crc, 2)[::-1]


def command_create(header: bytearray, get_command: bytearray, index: int):
    command = header + get_command + int_to_bytearray(index, 2)
    command += crc16_modbus(command)
    return command


def hwt9053_data():

    command_set_xy_angle = command_create(write_command_header, calsw_command, 8)
    command_set_z_angle = command_create(write_command_header, calsw_command, 4)
    command_get_angle = command_create(read_command_header, angle_command, 6)
    command_get_accel = command_create(read_command_header, accel_command, 3)
    ser.write(command_set_xy_angle)
    ser.write(command_set_z_angle)
    ser.reset_input_buffer()
    ser.reset_output_buffer()
    while 1:
        ser.write(command_get_angle)
        input = ser.read(6 * 4 + 5)
        if input:
            byte_array_input = bytearray(input)
            array_output = [int(byte) for byte in byte_array_input]
            for i in range(3):
                data = (
                    array_output[i * 4 + 5] << 24
                    | array_output[i * 4 + 6] << 16
                    | array_output[i * 4 + 3] << 8
                    | array_output[i * 4 + 4]
                )
                if data >= pow(2, 31):
                    data -= pow(2, 32)
                data /= 1000
                upload_data[json_key[i + 3]] = data
                MA_data[json_key[i+3]].append(data)

        # print(MA_data)

        ser.write(command_get_accel)
        input = ser.read(3 * 4 + 5)
        if input:
            byte_array_input = bytearray(input)
            array_output = [int(byte) for byte in byte_array_input]
            for i in range(3):
                data = array_output[i * 2 + 3] << 8 | array_output[i * 2 + 4]
                if data >= pow(2, 15):
                    data -= pow(2, 16)
                data = data / 32768 * 16
                upload_data[json_key[i]] = data
                MA_data[json_key[i]].append(data)
        try:
            for filter_key, key in zip(MA_filter_json_key, json_key):
                upload_data[filter_key] = sum(MA_data[key]) / len(MA_data[key])
        except ZeroDivisionError:
            pass

        # 獲取當前的GMT時間
        # print(MA_data)
        # print(upload_data)

        current_time_gmt = datetime.now(gmt)
        # 將datetime對象轉換為字符串
        current_time_gmt_str = str(current_time_gmt)

        # 將字符串轉換為JSON
        current_time_gmt_json = json.dumps(current_time_gmt_str)
        upload_data["time"] = current_time_gmt_json

        socket_data = json.dumps(upload_data).encode()
        # print(upload_data)
        client_socket.sendall(socket_data)
        time.sleep(1)


ser = serial.Serial(com_port, 9600, timeout=0.5)  # 打开COM6，将波特率配置为9600，其余参数使用默认值
if ser.isOpen():  # 判断串口是否成功打开
    print("打开串口成功。")
    print(ser.name)  # 输出串口号
    server_address = '192.168.50.76'
    server_port = 8888
    # 創建一個timezone對象
    gmt = pytz.timezone('GMT')
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        # 連線到伺服器
        client_socket.connect((server_address, server_port))

    except ConnectionRefusedError:
        print("錯誤：連線被拒絕。請確認伺服器是否正在運行。")
        client_socket.close()

    data_get = threading.Thread(target=hwt9053_data())
    data_get.start()
else:
    print("打开串口失败。")

# 開啟虛擬環境
# python3 -m venv .venv
# source ./.venv/bin/activate
