# SLCP — Bảng tra cứu (Dictionary)

API: `GET /api/v1.0/dictionary/queryDictionaryByKey/{key}` → danh sách `{dictValue, dictName, dsName}`. Đây là các bảng enum trung tâm, dùng cho hầu hết dropdown/nhãn trạng thái trong hệ thống.

| Key | Tên nhóm (dictName) | Ví dụ giá trị (dsName của value đầu) |
|---|---|---|
| 3 | Lamp Type | High Pressure Sodium Lamp (HPS) |
| 5 | Operation Type | Turn On |
| 6 | Task Execution Mode | Unlimited |
| 10 | Task Type | Circuit Switch Task |
| 15 | Current Rate | 150/5 |
| 17 | Power Type | Inductive Ballast |
| 19 | Number Of Lamp Heads | 1 |
| 20 | Dimming Level | 20 |
| 21 | Meter Type | 1-Way 3-Phase Meter |
| 26 | Status | Enable |
| 34 | Road Sideways | Unknown |
| 43 | Carrier Device Type | Special Change Box |
| 44 | Ticket Status Type | Pending Review |
| 45 | Ticket Task Source | Customize |
| 46 | Solution Type of the Tickets | General Maintenance |
| 55 | Ordinary pole lamp arm type | Willow leaf |
| 70 | Device registration status | Registered |
| 99 | Rtu Type | RTU 200 |
| 116 | Terminal type | LTE22 |
| 119 | Gateway Type | RTU500 |
| 135 | Task Recent Actions | Issue Task |
| 148 | Group Type | Centralized control strategy |
| 149 | Follow up status | Pending |

> Mỗi key là một *nhóm* (dictStair); mỗi giá trị con có `dictValue` (số lưu trong DB) và `dsName` (nhãn hiển thị). Bảng trên chỉ trích giá trị đầu tiên làm ví dụ.
