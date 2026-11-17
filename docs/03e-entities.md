# SLCP — Thực thể & trường dữ liệu (phần 5)

> Bộ 03 gồm 5 phần: `03-entities.md`, `03b-entities.md`, `03c-entities.md`, `03d-entities.md`, `03e-entities.md`

Tiếp theo của `03-entities.md`. Xem phần đầu cho ghi chú nguồn & kiểu.


# Task & nhóm điều khiển


### `POST /v1.0/autoPollingGroup/queryUnassociatedDeviceOfAutoPollingGroup`
*Tham số:* projectId, current, size, autoPollingGroupId, deviceTypeValue  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].modelName` | string |  |
| `records[].rtuId` | null | RTU |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].rtuUid` | null |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/deviceGroup/deviceGroupPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].groupTypeName` | string |  |
| `records[].groupType` | number |  |
| `records[].solarFactory` | number |  |
| `records[].remark` | string |  |
| `records[].lcuCtype` | number |  |
| `records[].solarType` | number |  |
| `records[].hnVersion` | number |  |
| `records[].radarType` | number |  |
| `records[].loopType` | number |  |
| `records[].lcuType` | number |  |
| `records[].groupName` | string |  |
| `records[].deviceGroupId` | id32 | DeviceGroup |
| `records[].publishTaskTime` | null |  |
| `records[].groupIdStatus` | number |  |
| `records[].luxEnable` | number |  |
| `records[].publishTaskStatus` | number |  |
| `records[].projectId` | id32 | Project |
| `records[].taskStatus` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/deviceGroup/queryDeviceGroupList`

| Trường | Kiểu | FK? |
|---|---|---|
| `loopType` | number |  |
| `groupTypeName` | string |  |
| `groupType` | number |  |
| `groupName` | string |  |
| `groupId` | id32 | DeviceGroup |
| `luxEnable` | number |  |
| `projectId` | id32 | Project |

### `POST /v1.0/linkageStrategyActor/getKmsOfRtuId`
*Tham số:* projectId, current, size, rtuId  

| Trường | Kiểu | FK? |
|---|---|---|
| `kmName` | string |  |
| `channel` | number |  |
| `addr` | number |  |
| `kmId` | id32 | KM |

### `POST /v1.0/task/getGroupTask`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].createUserId` | id32 | User |
| `records[].sunsetFrontDim` | number |  |
| `records[].dimValue` | number |  |
| `records[].sunsetFrontOffset` | number |  |
| `records[].taskTypeName` | string |  |
| `records[].cycle` | number |  |
| `records[].lux` | number |  |
| `records[].executeType` | number |  |
| `records[].taskType` | number |  |
| `records[].protocol` | null |  |
| `records[].solarTask` | string |  |
| `records[].sunriseFrontOffset` | number |  |
| `records[].executeEndTime` | number |  |
| `records[].sunriseBackOffset` | number |  |
| `records[].loopTime` | string |  |
| `records[].fileJson` | string |  |
| `records[].executeHour` | number |  |
| `records[].updateUserId` | id32 | User |
| `records[].sunriseBackDim` | number |  |
| `records[].sunsetBackOffset` | number |  |
| `records[].updateTime` | datetime |  |
| `records[].operationName` | string |  |
| `records[].executeModelName` | string |  |
| `records[].loopType` | number |  |
| `records[].sunriseFrontDim` | number |  |
| `records[].executeMinute` | number |  |
| `records[].executeModel` | number |  |
| `records[].createTime` | datetime |  |
| `records[].sunsetBackDim` | number |  |
| `records[].taskName` | string |  |
| `records[].executeTypeName` | string |  |
| `records[].projectId` | id32 | Project |
| `records[].operation` | number |  |
| `records[].taskId` | id32 | Task |
| `records[].loopCycle` | string |  |
| `records[].executeStartTime` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/task/page`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].createUserId` | id32 | User |
| `records[].sunsetFrontDim` | number |  |
| `records[].dimValue` | number |  |
| `records[].sunsetFrontOffset` | number |  |
| `records[].taskTypeName` | string |  |
| `records[].cycle` | number |  |
| `records[].lux` | number |  |
| `records[].executeType` | number |  |
| `records[].taskType` | number |  |
| `records[].protocol` | null |  |
| `records[].solarTask` | string |  |
| `records[].sunriseFrontOffset` | number |  |
| `records[].executeEndTime` | number |  |
| `records[].sunriseBackOffset` | number |  |
| `records[].loopTime` | string |  |
| `records[].fileJson` | string |  |
| `records[].executeHour` | number |  |
| `records[].updateUserId` | id32 | User |
| `records[].sunriseBackDim` | number |  |
| `records[].sunsetBackOffset` | number |  |
| `records[].sunDimValue` | number |  |
| `records[].updateTime` | datetime |  |
| `records[].operationName` | string |  |
| `records[].executeModelName` | string |  |
| `records[].sunExecuteWay` | number |  |
| `records[].sunExecuteOffset` | number |  |
| `records[].loopType` | number |  |
| `records[].sunriseFrontDim` | number |  |
| `records[].executeMinute` | number |  |
| `records[].executeModel` | number |  |
| `records[].createTime` | datetime |  |
| `records[].sunsetBackDim` | number |  |
| `records[].taskName` | string |  |
| `records[].executeTypeName` | string |  |
| `records[].projectId` | id32 | Project |
| `records[].operation` | number |  |
| `records[].taskId` | id32 | Task |
| `records[].loopCycle` | string |  |
| `records[].executeStartTime` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/task/queryDeviceGroupByTaskGroupType`
*Tham số:* projectId, current, size, taskGroupType  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].loopType` | number |  |
| `records[].groupTypeName` | string |  |
| `records[].groupType` | number |  |
| `records[].groupName` | string |  |
| `records[].deviceGroupId` | id32 | DeviceGroup |
| `records[].projectId` | id32 | Project |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/task/queryTaskByTaskGroupId`
*Tham số:* projectId, current, size, taskGroupId  

| Trường | Kiểu | FK? |
|---|---|---|
| `createUserId` | id32 | User |
| `sunsetFrontDim` | number |  |
| `dimValue` | number |  |
| `sunsetFrontOffset` | number |  |
| `taskTypeName` | string |  |
| `cycle` | number |  |
| `lux` | number |  |
| `executeType` | number |  |
| `taskType` | number |  |
| `protocol` | null |  |
| `solarTask` | string |  |
| `sunriseFrontOffset` | number |  |
| `executeEndTime` | datetime |  |
| `sunriseBackOffset` | number |  |
| `loopTime` | string |  |
| `fileJson` | string |  |
| `executeHour` | number |  |
| `updateUserId` | id32 | User |
| `sunriseBackDim` | number |  |
| `sunsetBackOffset` | number |  |
| `sunDimValue` | number |  |
| `updateTime` | datetime |  |
| `operationName` | string |  |
| `executeModelName` | string |  |
| `sunExecuteWay` | number |  |
| `sunExecuteOffset` | number |  |
| `loopType` | number |  |
| `sunriseFrontDim` | number |  |
| `executeMinute` | number |  |
| `executeModel` | number |  |
| `createTime` | datetime |  |
| `sunsetBackDim` | number |  |
| `taskName` | string |  |
| `executeTypeName` | string |  |
| `projectId` | id32 | Project |
| `operation` | number |  |
| `taskId` | id32 | Task |
| `loopCycle` | string |  |
| `executeStartTime` | datetime |  |

### `POST /v1.0/task/queryTaskGroupByDeviceGroupType`
*Tham số:* projectId, current, size, deviceGroupType  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].loopType` | number |  |
| `records[].groupTypeName` | string |  |
| `records[].groupType` | number |  |
| `records[].groupName` | string |  |
| `records[].taskGroupId` | id32 | TaskGroup |
| `records[].projectId` | id32 | Project |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/task/queryTaskGroupList`

| Trường | Kiểu | FK? |
|---|---|---|
| `loopType` | number |  |
| `groupTypeName` | string |  |
| `groupType` | number |  |
| `groupName` | string |  |
| `taskGroupId` | id32 | TaskGroup |
| `projectId` | id32 | Project |

# Cảnh báo


### `POST /v1.0/abnormalToAlarmPloy/queryDeviceUnassociatedPloy`
*Tham số:* projectId, current, size, ployId, deviceTypeValue, abnormalType  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].deviceModelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/alarmType/queryAlarmTypesOfDevice`

| Trường | Kiểu | FK? |
|---|---|---|
| `alarmValue` | number |  |
| `solution` | null |  |
| `alarmName` | string |  |
| `id` | id32 |  |
| `pinyinInitial` | string |  |
| `enabled` | number |  |

### `POST /v1.0/alarmType/queryAlarmTypesOfDeviceByProjectId`

| Trường | Kiểu | FK? |
|---|---|---|
| `alarmValue` | number |  |
| `solution` | null |  |
| `alarmTypeName` | string |  |
| `alarmName` | string |  |
| `id` | id32 |  |
| `enabled` | number |  |

### `POST /v1.0/alarmType/queryAlarmTypesOfLinkageStrategy`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].alarmType` | number |  |
| `records[].deviceTypeValue` | number |  |
| `records[].solution` | null |  |
| `records[].alarmName` | string |  |
| `records[].id` | id32 |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/alarmType/queryAlarmTypesOfRtuStrategy`

| Trường | Kiểu | FK? |
|---|---|---|
| `alarmType` | number |  |
| `deviceTypeValue` | number |  |
| `solution` | null |  |
| `alarmName` | string |  |

### `POST /v1.0/alarmType/queryAlarmTypesOfStrategy`

| Trường | Kiểu | FK? |
|---|---|---|
| `alarmType` | number |  |
| `solution` | null |  |
| `alarmName` | string |  |

### `POST /v1.0/config/alarmCount`

| Trường | Kiểu | FK? |
|---|---|---|
| `alarmTypeList[].alarmType` | number |  |
| `alarmTypeList[].alarmTypeCount` | number |  |
| `hisCount` | number |  |
| `count` | number |  |
| `todayCount` | number |  |

### `POST /v1.0/config/countAlarmByLevel`

| Trường | Kiểu | FK? |
|---|---|---|
| `name` | string |  |
| `value` | number |  |

### `POST /v1.0/config/getAlarmEquipmentPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].deviceTypeValue` | number |  |
| `records[].lng` | string |  |
| `records[].typeName` | string |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].lat` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/config/getAlarmFollowUpLogHisPage`
*Tham số:* projectId, current, size  

| Trường | Kiểu | FK? |
|---|---|---|
| `createTime` | datetime |  |
| `userAccount` | null |  |
| `alarmId` | number | Alarm |
| `remark` | null |  |
| `id` | number |  |
| `source` | number |  |
| `userName` | null |  |
| `followUpStatusName` | string |  |
| `projectId` | id32 | Project |
| `followUpStatus` | number |  |

### `POST /v1.0/config/getAlarmFollowUpLogPage`
*Tham số:* projectId, current, size  

| Trường | Kiểu | FK? |
|---|---|---|
| `createTime` | datetime |  |
| `userAccount` | null |  |
| `alarmId` | number | Alarm |
| `remark` | null |  |
| `id` | number |  |
| `source` | number |  |
| `userName` | null |  |
| `followUpStatusName` | string |  |
| `projectId` | id32 | Project |
| `followUpStatus` | number |  |

### `POST /v1.0/config/getAlarmHisPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].deal` | number |  |
| `records[].firstAlarmValue` | null |  |
| `records[].alarmNum` | number |  |
| `records[].channel` | null |  |
| `records[].typeName` | string |  |
| `records[].roadId` | null | Road |
| `records[].remark` | null |  |
| `records[].alarmInfo` | string |  |
| `records[].source` | number |  |
| `records[].deviceId` | id32 | Device |
| `records[].followUpStatus` | number |  |
| `records[].deviceName` | string |  |
| `records[].roadName` | null |  |
| `records[].deviceStatus` | number |  |
| `records[].number` | number |  |
| `records[].uid` | string | (device UID) |
| `records[].protocolValue` | string |  |
| `records[].alarmRealValue` | null |  |
| `records[].errorBelong` | null |  |
| `records[].areaName` | null |  |
| `records[].alarmId` | number | Alarm |
| `records[].alarmhandle` | null |  |
| `records[].model` | id32 |  |
| `records[].id` | number |  |
| `records[].alarmCategory` | null |  |
| `records[].lat` | string |  |
| `records[].paramValue` | null |  |
| `records[].handleTime` | datetime |  |
| `records[].deviceTypeValue` | string |  |
| `records[].lng` | string |  |
| `records[].level` | number |  |
| `records[].alarmTime` | datetime |  |
| `records[].deviceCode` | string |  |
| `records[].firstTime` | datetime |  |
| `records[].modelName` | string |  |
| `records[].alarmType` | number |  |
| `records[].areaId` | null | Area |
| `records[].roadDirection` | null |  |
| `records[].name` | null |  |
| `records[].reset` | number |  |
| `records[].lastAlarmValue` | null |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/config/getAlarmPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].deal` | number |  |
| `records[].firstAlarmValue` | string |  |
| `records[].alarmNum` | number |  |
| `records[].channel` | null |  |
| `records[].typeName` | string |  |
| `records[].roadId` | null | Road |
| `records[].remark` | null |  |
| `records[].alarmInfo` | string |  |
| `records[].source` | number |  |
| `records[].deviceId` | id32 | Device |
| `records[].followUpStatus` | number |  |
| `records[].deviceName` | string |  |
| `records[].roadName` | null |  |
| `records[].deviceStatus` | number |  |
| `records[].uid` | string | (device UID) |
| `records[].protocolValue` | string |  |
| `records[].alarmRealValue` | null |  |
| `records[].errorBelong` | string |  |
| `records[].areaName` | null |  |
| `records[].alarmId` | number | Alarm |
| `records[].model` | id32 |  |
| `records[].alarmCategory` | null |  |
| `records[].resetTime` | null |  |
| `records[].lat` | string |  |
| `records[].paramValue` | null |  |
| `records[].firstMonment` | number |  |
| `records[].address` | string |  |
| `records[].deviceTypeValue` | string |  |
| `records[].lng` | string |  |
| `records[].level` | number |  |
| `records[].isShield` | number |  |
| `records[].alarmTime` | datetime |  |
| `records[].deviceCode` | string |  |
| `records[].firstTime` | datetime |  |
| `records[].modelName` | string |  |
| `records[].alarmType` | number |  |
| `records[].areaId` | null | Area |
| `records[].roadDirection` | null |  |
| `records[].name` | null |  |
| `records[].reset` | number |  |
| `records[].isStrategy` | null |  |
| `records[].lastAlarmValue` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/config/getLoudspeakerAlarmPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].alarmNum` | number |  |
| `records[].channel` | null |  |
| `records[].typeName` | string |  |
| `records[].roadId` | null | Road |
| `records[].remark` | null |  |
| `records[].alarmInfo` | string |  |
| `records[].source` | number |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].roadName` | null |  |
| `records[].deviceStatus` | number |  |
| `records[].number` | number |  |
| `records[].uid` | string | (device UID) |
| `records[].areaName` | null |  |
| `records[].alarmId` | number | Alarm |
| `records[].model` | id32 |  |
| `records[].lat` | string |  |
| `records[].address` | string |  |
| `records[].deviceTypeValue` | string |  |
| `records[].lng` | string |  |
| `records[].level` | number |  |
| `records[].isShield` | number |  |
| `records[].alarmTime` | datetime |  |
| `records[].modelName` | string |  |
| `records[].alarmType` | number |  |
| `records[].areaId` | null | Area |
| `records[].roadDirection` | null |  |
| `records[].reset` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

# Phiếu công việc


### `POST /v1.0/abnormalWorkOrder/getOrderCount`

| Trường | Kiểu | FK? |
|---|---|---|
| `result` | number |  |

### `POST /v1.0/delayOrder/excelAllPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `url` | string |  |

### `POST /v1.0/operationAbnormal/queryFirstExceptionType`

| Trường | Kiểu | FK? |
|---|---|---|
| `rownum` | number |  |
| `remark` | string |  |
| `id` | id32 |  |
| `source` | number |  |
| `type` | string |  |

### `POST /v1.0/operationAbnormal/queryFirstExceptionTypePage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].rownum` | number |  |
| `records[].remark` | string |  |
| `records[].id` | id32 |  |
| `records[].source` | number |  |
| `records[].type` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/workOrderStatistics/getTodayWorkOrderData`

| Trường | Kiểu | FK? |
|---|---|---|
| `todayFinishedOrder` | number |  |
| `todayNewOrder` | number |  |
| `finishedRate` | number |  |
| `untreatedNumber` | number |  |
| `yesterdayFinishedOrder` | number |  |
| `finishedOrder` | number |  |
| `processingOrder` | number |  |
| `delayOrder` | number |  |

### `POST /v1.0/workOrderStatistics/getWorkOrderSourceMap`

| Trường | Kiểu | FK? |
|---|---|---|
| `name` | string |  |
| `value` | number |  |

### `POST /v1.0/workOrderStatistics/getWorkOrderStateMap`

| Trường | Kiểu | FK? |
|---|---|---|
| `name` | string |  |
| `value` | number |  |

# Bảo trì, vật tư, xe


### `GET /v1.0/MaterialCategoryName/queryMaterialCategoryList`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `id` | id32 |  |
| `categoryName` | string |  |
| `remark` | null |  |

### `GET /v1.0/MaterialInventory/queryCustomMaterialInventory/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `inventoryNumber` | number |  |
| `modelName` | string |  |
| `materialName` | string |  |
| `registeredUseCount` | number |  |
| `materialInventoryId` | id32 |  |
| `materialModelId` | id32 | MaterialModel |
| `materialNameId` | id32 | MaterialName |
| `materialCategoryId` | id32 | MaterialCategory |
| `categoryName` | string |  |

### `GET /v1.0/MaterialName/queryMaterialNameById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | id32 | User |
| `updateTime` | datetime |  |
| `id` | id32 |  |
| `materialName` | string |  |
| `materialCategoryId` | id32 | MaterialCategory |
| `remark` | null |  |

### `GET /v1.0/MaterialName/queryMaterialNameList`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `id` | id32 |  |
| `materialName` | string |  |
| `materialCategoryId` | id32 | MaterialCategory |
| `remark` | null |  |

### `GET /v1.0/MaterialWarehouse/queryMaterialWarehouseInventoryList`

| Trường | Kiểu | FK? |
|---|---|---|
| `materialWarehouseId` | id32 |  |
| `warehouseName` | string |  |

### `GET /v1.0/MaterialWarehouse/queryMaterialWarehouseList`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `id` | id32 |  |
| `warehouseName` | string |  |
| `warehouseStatus` | number |  |
| `keeper` | string |  |
| `warehouseNumber` | string |  |
| `warehouseAddr` | string |  |
| `remark` | null |  |
| `lat` | string |  |
| `lng` | string |  |

### `GET /v1.0/curyCompany/queryCuryCompanyList`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `companyId` | id32 | MaintenanceCompany |
| `companyName` | string |  |
| `companyAddress` | string |  |
| `contactPerson` | string |  |
| `mobileAreaCode` | string |  |
| `phone` | string |  |
| `email` | string |  |
| `wechat` | string |  |
| `remark` | string |  |
| `companyType` | number |  |

### `GET /v1.0/curyCompany/queryCuryCompanyListByGovernment`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `companyId` | id32 | MaintenanceCompany |
| `companyName` | string |  |
| `companyAddress` | string |  |
| `contactPerson` | string |  |
| `mobileAreaCode` | string |  |
| `phone` | string |  |
| `email` | string |  |
| `wechat` | string |  |
| `remark` | string |  |
| `companyType` | number |  |

### `GET /v1.0/curyGroup/queryCuryGroupList`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `groupId` | id32 | DeviceGroup |
| `companyId` | id32 | MaintenanceCompany |
| `groupName` | string |  |
| `remark` | null |  |

### `GET /v1.0/vehicleLocatorController/countVehiclesInUpAndDownAgencyOfUser`

| Trường | Kiểu | FK? |
|---|---|---|
| `total` | number |  |
| `online` | number |  |
| `Offline` | number |  |

### `POST /v1.0/MaterialCategoryName/queryMaterialCategoryInventoryList`

| Trường | Kiểu | FK? |
|---|---|---|
| `id` | id32 |  |
| `categoryName` | string |  |

### `POST /v1.0/MaterialCategoryName/queryMaterialCategoryPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].remark` | string |  |
| `records[].id` | id32 |  |
| `records[].categoryName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/MaterialInventory/queryMaterialInventoryPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].create_user_id` | id32 |  |
| `records[].inventoryStatus` | string |  |
| `records[].remark` | null |  |
| `records[].categoryName` | string |  |
| `records[].materialUnit` | string |  |
| `records[].warehouseName` | string |  |
| `records[].inventoryMin` | number |  |
| `records[].inventoryMax` | number |  |
| `records[].materialName` | string |  |
| `records[].modelName` | string |  |
| `records[].inventoryNumber` | number |  |
| `records[].materialNumber` | string |  |
| `records[].usePercent` | string |  |
| `records[].id` | id32 |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/MaterialName/queryMaterialNameInventoryList`

| Trường | Kiểu | FK? |
|---|---|---|
| `materialName` | string |  |
| `materialNameId` | id32 | MaterialName |
| `materialCategoryId` | id32 | MaterialCategory |

### `POST /v1.0/MaterialName/queryMaterialNamePage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].materialName` | string |  |
| `records[].remark` | null |  |
| `records[].id` | id32 |  |
| `records[].categoryName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/MaterialWarehouse/queryMaterialWarehousePage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].warehouseNumber` | string |  |
| `records[].lng` | string |  |
| `records[].keeper` | string |  |
| `records[].warehouseStatus` | string |  |
| `records[].warehouseAddr` | string |  |
| `records[].remark` | null |  |
| `records[].id` | id32 |  |
| `records[].warehouseName` | string |  |
| `records[].lat` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/curyCompany/queryCuryCompanyPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].companyId` | id32 | MaintenanceCompany |
| `records[].phone` | string |  |
| `records[].companyType` | number |  |
| `records[].companyName` | string |  |
| `records[].companyAddress` | string |  |
| `records[].wechat` | string |  |
| `records[].contactPerson` | string |  |
| `records[].remark` | string |  |
| `records[].email` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/curyGroup/queryCuryGroupByCuryCompany`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | id32 | User |
| `updateTime` | datetime |  |
| `groupId` | id32 | DeviceGroup |
| `companyId` | id32 | MaintenanceCompany |
| `groupName` | string |  |
| `remark` | null |  |

### `POST /v1.0/curyGroup/queryCuryGroupPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].groupName` | string |  |
| `records[].groupId` | id32 | DeviceGroup |
| `records[].companId` | id32 |  |
| `records[].companyName` | string |  |
| `records[].remark` | null |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/devOpsBasicData/getDevOpsBasicDataMap`

| Trường | Kiểu | FK? |
|---|---|---|
| `numUnitList[].dataType` | number |  |
| `numUnitList[].id` | string |  |
| `numUnitList[].label` | string |  |
| `maintenanceTypeList[].dataType` | number |  |
| `maintenanceTypeList[].id` | string |  |
| `maintenanceTypeList[].label` | string |  |

### `POST /v1.0/materialEntry/queryMaterialEntryPageAll`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].entryTotalcount` | number |  |
| `records[].materialName` | string |  |
| `records[].createUserId` | id32 | User |
| `records[].createTime` | string |  |
| `records[].stateText` | string |  |
| `records[].approverId` | id32 |  |
| `records[].entryNumber` | string |  |
| `records[].state` | number |  |
| `records[].materialEntryId` | id32 |  |
| `records[].warehouseName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

# Cảm biến & thiết bị đô thị


### `POST /v1.0/radarCorrelationActor/queryDeviceChoosePage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].luid` | string | (LCU UID) |
| `records[].deviceModelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].lcuId` | id32 | LCU |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/radarCorrelationActor/queryDeviceConfigPage`
*Tham số:* projectId, current, size  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].deviceNum` | number |  |
| `records[].luid` | string | (LCU UID) |
| `records[].deviceModelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].lcuId` | id32 | LCU |
| `records[].ctime` | datetime |  |
| `records[].radarId` | id32 | Radar |
| `records[].id` | number |  |
| `records[].config` | number |  |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/radarCorrelationActor/queryRadarCorrelationTaskList`

| Trường | Kiểu | FK? |
|---|---|---|
| `dim` | number |  |
| `radarId` | id32 | Radar |
| `id` | number |  |
| `effectiveDuration` | number |  |
| `startMoment` | string |  |
| `taskNum` | number |  |
| `endMoment` | string |  |

# Camera & AI


### `GET /v1.0/cameraActor/statisticsOfCameraByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `cameraTotal` | number |  |
| `cameraOfflineTotal` | number |  |
| `cameraEnableTotal` | number |  |
| `cameraOnlineTotal` | number |  |

### `POST /v1.0/aiboxEvent/countFaceEventData`

| Trường | Kiểu | FK? |
|---|---|---|
| `count` | number |  |

### `POST /v1.0/aiboxEvent/getTrafficFlowStatistics`

| Trường | Kiểu | FK? |
|---|---|---|
| `carOutNum` | number |  |
| `carInNum` | number |  |

### `POST /v1.0/aiboxEvent/getVehicleTypeCount`

| Trường | Kiểu | FK? |
|---|---|---|
| `motorcycle` | number |  |
| `bus` | number |  |
| `other` | number |  |
| `suv` | number |  |
| `sedan` | number |  |
| `passengerCar` | number |  |
| `goodsTrain` | number |  |

### `POST /v1.0/aiboxEvent/getVehicleTypeStatistics`

| Trường | Kiểu | FK? |
|---|---|---|
| `motorcycle` | number |  |
| `bus` | number |  |
| `other` | number |  |
| `suv` | number |  |
| `sedan` | number |  |
| `passengerCar` | number |  |
| `goodsTrain` | number |  |

### `POST /v1.0/aiboxEvent/passengerFlowStatistics`

| Trường | Kiểu | FK? |
|---|---|---|
| `areaTotal` | number |  |
| `enterdToday` | number |  |
| `exitedToday` | number |  |

### `POST /v1.0/cameraActor/queryUnusedHikvisionCameraList`

| Trường | Kiểu | FK? |
|---|---|---|
| `port` | null |  |
| `ip` | null |  |
| `channel` | number |  |
| `name` | string |  |
| `indexCode` | id32 |  |
| `id` | id32 |  |
| `cameraSerialNum` | id32 |  |

# Media & phát thanh


### `POST /v1.0/loudspeakerActor/getBxLoudspeakerPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].loudspeakerBxId` | id32 |  |
| `records[].updateTime` | datetime |  |
| `records[].deviceName` | string |  |
| `records[].status` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

# Tài sản & hạ tầng


### `POST /v1.0/assetLedger/queryLedgerDevicePage`
*Tham số:* projectId, current, size, deviceTypeValue  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].curyGroupName` | null |  |
| `records[].deviceModelName` | string |  |
| `records[].roadId` | string | Road |
| `records[].deviceCode` | string |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].roadName` | null |  |
| `records[].deviceStatus` | number |  |
| `records[].curyCompanyName` | null |  |
| `records[].uid` | string | (device UID) |
| `records[].areaId` | string | Area |
| `records[].ctype` | number |  |
| `records[].createTime` | datetime |  |
| `records[].areaName` | null |  |
| `records[].roadDirection` | null |  |
| `records[].deviceGrade` | number |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].deviceSource` | number |  |
| `records[].higherDevice` | string |  |
| `records[].geographicAddress` | string |  |
| `records[].poleId` | id32 | Pole |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

# Thống kê & báo cáo


### `POST /v1.0/reportManage/queryReportsPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].reportTypeText` | string |  |
| `records[].code` | string |  |
| `records[].reportName` | string |  |
| `records[].year` | number |  |
| `records[].statisticalTypeText` | string |  |
| `records[].reportType` | number |  |
| `records[].statisticalType` | number |  |
| `records[].month` | number |  |
| `records[].createTime` | datetime |  |
| `records[].stateText` | string |  |
| `records[].recentSendTime` | null |  |
| `records[].fileUrl` | string |  |
| `records[].id` | id32 |  |
| `records[].state` | number |  |
| `records[].projectId` | id32 | Project |
| `records[].day` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

# Tuỳ biến dự án


### `POST /v1.0/westLakeBuilding/queryAiDiPageInWestLake`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].aidiStatus` | number |  |
| `records[].dtime` | null |  |
| `records[].networkStatus` | number |  |
| `records[].channel` | number |  |
| `records[].deviceName` | string |  |
| `records[].deviceStatus` | number |  |
| `records[].rtuId` | id32 | RTU |
| `records[].aidiId` | id32 |  |
| `records[].atype` | number |  |
| `records[].deviceGrade` | number |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].addr` | number |  |
| `records[].value` | null |  |
| `records[].cuid` | string | (parent UID) |
| `records[].deviceTypeValue` | number |  |
| `records[].dtype` | null |  |
| `records[].deviceCode` | null |  |
| `records[].sync` | string |  |
| `records[].kmId` | null | KM |
| `records[].ctype` | number |  |
| `records[].kmName` | null |  |
| `records[].deviceSource` | number |  |
| `records[].kChannel` | null |  |
| `records[].geographicAddress` | string |  |
| `records[].device` | string |  |
| `records[].kAddr` | null |  |
| `records[].alarmRemark` | null |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/westLakeBuilding/queryMeterPageInWestLake`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].vratio` | number |  |
| `records[].num` | number |  |
| `records[].networkStatus` | number |  |
| `records[].mModelType` | number |  |
| `records[].queryCheck` | null |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].deviceStatus` | number |  |
| `records[].mtype` | number |  |
| `records[].rtuId` | id32 | RTU |
| `records[].superTypeValue` | number |  |
| `records[].price` | null |  |
| `records[].deviceGrade` | number |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].htime` | null |  |
| `records[].stationId` | null | Station |
| `records[].actStatus` | null |  |
| `records[].cuid` | string | (parent UID) |
| `records[].madd` | number |  |
| `records[].deviceModelName` | string |  |
| `records[].deviceCode` | null |  |
| `records[].cratio` | number |  |
| `records[].sync` | null |  |
| `records[].actCode` | null |  |
| `records[].ctype` | number |  |
| `records[].deviceSource` | number |  |
| `records[].device` | string |  |
| `records[].alarmRemark` | null |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

# Đọc được nhưng chưa suy được trường

Các API sau trả `code 200` nhưng **không có bản ghi** để suy cấu trúc: hoặc `data` rỗng, hoặc chỉ trả vỏ phân trang `{total,size,current,pages}` với `records` rỗng. Thực thể có tồn tại nhưng dự án Hapulico chưa có dữ liệu loại đó. Tên đầy đủ + tham số xem ở `04-api-catalog.md`. Cách lấp: gọi lại khi dự án có dữ liệu loại đó, hoặc truyền ID thật từ màn hình tương ứng.

- **`abnormalToAlarmPloy`**: `queryAbnormalToAlarmPloyById/{e}`, `queryAbnormalToAlarmPloyList`, `queryAbnormalToAlarmPloyOfDevice/{e}`, `queryDeviceOfPloy`
- **`abnormalWorkOrder`**: `alarmWorkOrderList`, `queryAllPage`, `queryPage`, `queryPlanPathPage`, `querySpainAllPage`, `querySpainPage`
- **`abnormalWorkOrderOverview`**: `grandUndoneDetails`, `tmCompleteDetails`
- **`actilityProjectActor`**: `getActilityProject`, `getGatewayList`
- **`agency`**: `getMessageConfigurationOfAgency/{e}`, `queryPage`
- **`aibox`**: `getAIboxEventList`, `getAIboxList`
- **`aiboxEvent`**: `getEventDataArchivedList`, `getEventList`, `getEventStatistics`, `getFaceEventDataArchivedList`, `getFaceEventList`, `getPassengerFlowDataArchivedList`, `getPassengerFlowStatisticsList`, `getPassengerFlowlList`, `getTrafficFlow`, `getTrafficFlowCount`, `getTrafficFlowDataArchived`, `getVehicleCaptureEvent`, `getVehicleCaptureEventDataArchived`
- **`aiboxLinkageStrategyActor`**: `getAIboxLinkageHisGroupPage`, `queryAIboxLinkageHisPage`, `queryAIboxLinkageStrategyList`
- **`alarmStatistics`**: `alarmTypeStatistics`
- **`alarmType`**: `queryMultilingualAlarmTypesOfProject`, `queryMultilingualSolutionOfProject`
- **`antiActor`**: `getAntiIdListByRtuId`, `getAntiListByRtuId`, `pageList`, `queryRtuAndAntiList`
- **`appealActor`**: `pageList`
- **`area`**: `queryAreaByCityId/{e,"/"}`, `queryAreaByProjectId/{e}`, `queryAreaPage`
- **`areaRoad`**: `getAreaRoadsByProjectId/{e}`, `queryAreaPage`, `queryByAreaId/{e}`, `queryCityByAreaId/{e}`, `queryRoadByAreaId/{e,"/"}`, `queryRoadOfArea`
- **`artificialAbnormal`**: `queryArtificialAbnormalInOrderId/{e}`, `queryArtificialAbnormalPage`
- **`assessRecord`**: `getAssessRecordById/{e}`, `page`, `pageAssessRecordStatistics`
- **`assetLedger`**: `queryDALIInfo`, `queryLedgerDeviceDetails`, `querySubordinateDeviceDetailsInLedgerManagement`, `querySubordinateDeviceList`
- **`autoDispatchConfig`**: `queryAutoDispatchConfigById/{e}`
- **`autoPollingGroup`**: `queryAutoPollingGroupsOfProject/{e}`, `queryDeviceOfAutoPollingGroup`
- **`basicEnergyConsumption`**: `getBasicEnergy/{e}`
- **`cabinet`**: `getCabinetById/{e}`
- **`cabinetTask`**: `cabinetListByTaskId/{e}`, `getCabinetList`, `getCabinetTaskById/{e}`, `getCabinetTaskList`, `page`
- **`cableInspectionActor`**: `getCableInspectionById/{e}`, `getCableInspectionByRtuId/{e}`, `getCableInspectionInfoById/{e}`, `getRtuAlarmOfCableInspectionLoopPage`, `mapPageList`, `pageList`
- **`cableInspectionDataHisActor`**: `getTrend`, `page`, `pageCableInspection`
- **`cameraActor`**: `pageList`, `queryCameraIndexCode/{e}`, `queryCameraOfProject`, `queryRelationCamera`, `queryUnrelatedCameraPage`
- **`cameraEventMonitoringActor`**: `getConfigEventType/{e}`, `getTrafficEvent`, `queryPeopleNum/{e}`
- **`cameraPreset`**: `queryCameraByPoleId`
- **`carbon`**: `getCarbonReduction`, `getPowerBoxData`
- **`chargingActor`**: `queryChargingGunByChargingId/{e}`
- **`chargingPackage`**: `getChargingPackage`
- **`city`**: `queryByCountryId/{e}`, `queryByProvinceId/{e}`
- **`communicationTopology`**: `queryCommunicationTopologyOfDevice`
- **`config`**: `countAlarmHis`, `getDeviceAlarmHisById`, `getDeviceAlarmPage`, `getLcuAccidentLightConfig/{e}`, `getLcuBachOfflineConfig`, `getLcuTaskStatusConfig`
- **`country`**: `queryByName/{e}`
- **`curyGroup`**: `queryCuryGroupOfCuryCompany/{e}`, `queryUserByCuryGroupId`
- **`custodyRecord`**: `getCustodyRecordById/{e}`, `page`, `pageCustodyRecordStatistics`
- **`dayun`**: `queryPage`, `queryTaskInfo`
- **`delayOrder`**: `queryAllPage`, `queryPage`
- **`device`**: `boxSelectDeviceList`, `getChargingByPid/{e}`, `getDeviceByLatLng`, `getLatlngByEquipment`, `queryAlarmInformationOfPositioningDevice`, `queryAncillaryDevice`, `queryAuthorizationCodeOfPositioningDevice`, `queryDeviceInCuringArea`, `queryDeviceListInAlarmPage`, `queryDeviceNamesOfTypeInProject`, `queryInformationOfPositioningDevice`, `queryNetworkStatusData`, `queryPoleByAncillaryDeviceMap`, `queryUnrelatedAncillaryDevice`
- **`deviceActLog`**: `queryDeviceActLog`
- **`deviceGroup`**: `getGroupById`, `getSwitchTime/{e}`, `queryDeviceTaskPage`, `queryRadarGroupPage`
- **`deviceOverview`**: `getSmartBoxOverviewDetails`
- **`deviceTypeController`**: `querySupplyElecttricityDeviceType`
- **`devOps`**: `getDevOpsList`
- **`dictionary`**: `queryDictionaryByName/{e}`, `queryDictionaryPage`
- **`dtuActor`**: `getDtuAndMeterInfoList`, `queryAllDtuByProjectId/{e}`, `queryPage`, `querySerialPort/{e}`
- **`electronicLockActor`**: `getElectronicLockHisList`, `pageList`, `queryDetailById/{e}`
- **`energy`**: `getKmOfPowerBoxDataDetails`, `getKmOfPowerBoxDataTrend`, `getLcuDataDetails`, `getLcuDataTrend`, `getPowerBoxData`, `getSolarDataDetails`, `getSolarDataTrend`, `getSolarEnergyHisDetails`, `getSolarLcuDataDetails`, `getSolarLcuDataTrend`, `getSolarLcuEnergyHisDetails`, `getTrend`
- **`equipment`**: `getEquipmentById/{e}`, `queryEquipment`, `queryEquipmentPage`
- **`equipmentAbnormal`**: `queryEquipmentAbnormalByOrderId/{e}`, `queryEquipmentAbnormalPage`
- **`factoryController`**: `queryAllFactoriesPage`
- **`fireAlarmActor`**: `queryFireAlarm`
- **`fogPile`**: `getDataOnMapPanel/{e}`
- **`gatewayActor`**: `pageList`, `queryGatewayOfProject`, `queryPage`, `querySerialPort/{e}`, `queryUnrelatedGatewayPage`
- **`informatrion`**: `queryInformationMap`
- **`inspectionOrder`**: `queryAllPage`, `queryPage`
- **`inspectionPlan`**: `queryAllPage`, `queryPage`
- **`kmActor`**: `getKmsOfRtuPage`, `queryKmHisByRtu`
- **`kmDetectActor`**: `getKmDetectById/{e}`, `pageList`
- **`lcuActor`**: `getLcuByStatus`, `getLcuRealtionSmartBoxOrRtu`, `llLcuAllPage`, `queryAllLcuByProjectId/{e}`, `queryDisplaceById/{e}`, `queryLcuInWhiteSpace`, `queryLcuLightingHis`, `queryLcuListByGatewayId/{e}`, `queryLcuListByParenDeviceId/{e}`, `queryLcuNotAssociatedWithPole`, `queryLcuOutsideWhiteSpace`, `queryRelatedLcuOfDirectory`, `queryRelatedLcuPage`, `statisticsOfLcuIntervalTimeByProjectId/{e}`
- **`lcuAttributionActor`**: `queryLcuGroup`, `queryLcuGroupHis`
- **`lcuGpsQueryConfig`**: `queryLcuGpsQueryConfig`
- **`lcuLight`**: `queryLcuDataReportRateDetailsPage`, `queryLcuLightByLcuIdAndNum`, `queryLcuLightDataReportRate`
- **`lcuRoute`**: `queryByParam`, `queryRouteTopologyOfDevice`
- **`lierdaProjectActor`**: `getBandNameList`, `getGatewayInfo`, `getLcuOfNSProjectPage`, `getNsGatewayList`, `getNsProjectList`
- **`LightningProtectionActor`**: `pageList`, `queryDetailById/{e}`
- **`linkageStrategyActor`**: `getCableInspectionLoopOfRtu`, `getStrategyLoopOfRtu`, `queryLinkageHisOfAlarm`, `queryLinkageHisPage`, `queryLinkageStrategyList`, `queryStrategyCameraList`, `queryStrategyKmList`, `querySuperDevicePage`
- **`loudspeakerActor`**: `pageList`, `queryLoudspeakerBx`, `queryLoudspeakerList`
- **`loudspeakerbxTask`**: `getTaskById/{e}`, `page`
- **`luxActor`**: `getByProjectId`, `getLuxById/{e}`, `getLuxHisList`, `pageList`, `queryUnrelatedLuxPage`
- **`luxGroupActor`**: `page`, `queryAllLuxPage`
- **`managementRecord`**: `getManagementRecordById/{e}`, `page`, `pageManagementRecordStatistics`
- **`massage`**: `getSysMessageList`
- **`materialEntry`**: `queryMaterialEntryPage`
- **`MaterialName`**: `queryMaterialNameListByCategoryId/{e}`
- **`materialRequest`**: `queryMaterialRequestPage`, `queryMaterialRequestPageAll`
- **`materialUse`**: `queryMaterialUseDetail`, `queryMaterialUseDetailById/{e,"/"}`, `queryMaterialUseDetailByOrderId/{e}`, `queryMaterialUsePage`, `queryMaterialUsePageAll`, `queryMaterialUsesByOrderId`
- **`menu`**: `queryById/{e}`, `queryPage`
- **`messageActor`**: `getMessageById/{e}`, `getMessagesByUser`, `queryMessagesPage`
- **`messageType`**: `getAllMessageTypes`, `getMessageTypeById/{e}`, `queryMessageTypesPage`
- **`meterActor`**: `getRtuByProjectId`, `pageList`, `queryUserMeterDataOfStation/{e}`, `queryUserMeterListByRtuId/{e}`, `queryUserMeterOfRtuPage`
- **`meterReading`**: `queryConfigPage`
- **`municipal`**: `getDeviceByLatLng`
- **`nonIotDevice`**: `queryAcContactorOfStationInSupplyElectricity`, `queryDeviceAndRelated`, `queryNonIotDeviceInOtherDeviceDirectoryOfProject/{e}`, `queryRelatedNonIotDeviceOfDirectory`, `queryRelatedNonIotDeviceOfStation`, `queryRelatedNonIotDevicePage`, `querySubordinateDeviceDetailsInLedgerManagement`, `queryUnrelatedNonIotDevicePage`
- **`oilCard`**: `queryOilCardByOilCardId/{e}`, `queryOilCardsPage`
- **`oilChargeRecord`**: `queryOilChargeRecordsPage`
- **`oilConsumeRecord`**: `countOilConsumeRecordsByAgency`, `countOilConsumeRecordsByTime`, `queryOilConsumeRecordsPage`
- **`operationAbnormal`**: `queryOperationAbnormalPage`, `querySecondExceptionType`, `querySecondExceptionTypePage`
- **`overseas`**: `getStreetLightOnRate`, `getStreetWoOverhaulRate`, `queryRoadLevel`
- **`passengerFlowGroup`**: `queryPassengerFlowGroupListPage`
- **`phaseAuto`**: `allList`, `getInfo`
- **`poleActor`**: `queryPoleAndAttributeDeviceByLatAndLng`, `queryPoleAssociatedWithSensor`, `queryRelatedMutiPoleOfDirectory`, `queryRelatedMutiPolePage`, `queryUnrelatedMutiPolePage`
- **`powerBoxActor`**: `queryComTopologyPowerBoxPage`, `queryConfig`, `querySerialPort/{e}`
- **`progress`**: `queryList/{e}`
- **`project`**: `getHisDataConfigOfProject/{e}`, `queryList`, `queryProjectByUserId`, `queryUserCreatProject`
- **`projectLampActor`**: `queryLampOfLcu/{e}`, `queryLampOfSolarLcu/{e}`, `queryProjectSolarControllerLamp`, `queryProjectSolarLamp`
- **`ProjectStationActor`**: `getStationById/{e}`, `queryAllProjectStation`, `queryNormalAndAlarmStationList`, `queryRelatedStationOfDirectory/{e}`, `queryRelatedStationPage`, `queryStationAndRtuPage`, `queryStationOfRootDirectoryByProjectId/{e}`, `queryUnrelatedStationPage`, `queryWiringDiagramOfStation`
- **`protocolActor`**: `queryById/{e}`, `queryProtocolFunction`
- **`province`**: `queryByProvinceId/{e}`
- **`radarActor`**: `pageList`, `queryAll`, `queryByGroup`, `queryNoGroupRadar`, `queryRadarById`
- **`radarLinkageStrategyActor`**: `getRadarCarHisPage`, `getRadarLinkageHisDevicePage`, `getRadarLinkageHisGroupPage`, `queryRadarLinkageHisPage`, `queryRadarLinkageStrategyList`
- **`role`**: `queryIdAndName`, `queryList`, `queryPage`, `queryUserAndRoleByMenuId/{e}`
- **`rtuActor`**: `kmHisPageList`, `queryRelatedRtuOfDirectory/{e}`, `queryRelatedRtuPage`, `queryRtuAndAttributeDeviceOfStationInSupplyElectricity`, `querySerialPort/{e}`, `rtuAllPage`
- **`rtuServerInfo`**: `page`
- **`scenesLight`**: `queryScenesLight`, `queryScenesLightById/{e}`, `queryShowingMasterByScenesLight`, `queryShowingMasterList`
- **`scenesLightDevice`**: `queryScenesDevice`, `queryScenesLightGroupDevice`
- **`scenesLightGroup`**: `queryScenesLightGroup`, `queryScenesLightGroupById/{e}`, `queryScenesLightGroupList`
- **`screenActor`**: `pageList`, `queryScreenList`
- **`sensorActor`**: `pageList`, `querySensorAndInfo/{e}`, `queryUnrelatedSensorPage`
- **`showingAct`**: `getShowingActByShowingMasterId`
- **`showingMasterActor`**: `getShowingMasterById/{e}`, `pageList`
- **`signageActor`**: `getSignageById/{e}`
- **`smartBoxActor`**: `queryListByParams`, `queryRelatedSolarLcu`, `querySerialPort/{e}`, `querySmartBoxStatusHis`, `smartBoxAllPage`
- **`solarActor`**: `queryComDeviceAssociatedWithSolar`, `queryLcConfig/{e}`, `querySolarLightById/{e}`, `querySolarNotAssociatedWithPole`, `querySrLcConfig/{e}`
- **`solarLcuActor`**: `getSolarLcuRealtionSmartBox`, `mapPageList`, `queryControllerParam/{e}`, `queryLcConfig/{e}`, `queryNetParam/{e}`, `queryReportMinute/{e}`, `querySolarLcuNotAssociatedWithPole`
- **`solarLcuLight`**: `querySolarLcuLightByLcuIdAndNum`
- **`supplyElectricity`**: `queryDeviceTypeByParentDeviceType`
- **`supplyElectricityDevice`**: `pageSuppleyElectricityChildDevices`, `pageSuppleyElecttricityParentDevices`, `pageUnSuppleyElectricityChildDevices`, `queryPowerSupplyTopologyOfDevice`
- **`sysFile`**: `getCheckPage`, `getSubmitPage`, `queryFileBx`, `queryFileById`
- **`syslog`**: `queryPage`
- **`task`**: `getLcuTaskByGroup`, `getTaskAndGroupNameByGroup`, `getTaskByDeviceId`, `getTaskByGroup`, `getTaskModeConfig`, `queryLcuTaskByDeviceId_v3`, `queryTaskByDeviceId_v2`, `queryTaskGroupSyncHisPage`, `screenTaskList`
- **`taskHistory`**: `getTaskHisByDevice`, `getTaskHisByDevice_v2`
- **`thermometerActor`**: `historyTable`, `pageList`, `queryDetailById/{e}`
- **`tiltSensorActor`**: `getTiltSensorHisList`, `pageList`, `queryDetailById/{e}`
- **`trafficLightActor`**: `getTrafficLightIdById/{e}`
- **`uidRecord`**: `queryUidReplacementRecord`
- **`user`**: `getUserProfilePhotoById`, `queryAllUsersOfAllAgenciesUnderAgency/{e}`, `queryAllUsersUnboundWristbandOfAllAgenciesUnderAgency/{e}`, `queryPage`, `queryUserGroup`
- **`vehicle`**: `queryAllVehiclesInUpAndDownAgencyOfUser`, `queryIdleVehicles`, `queryVehicleByVehicleId/{e}`, `queryVehiclesPage`
- **`vehicleAnnualInspection`**: `queryVehicleAnnualInspectionsPage`
- **`vehicleInsurance`**: `queryVehicleInsurancesPage`
- **`vehicleLocatorController`**: `queryElectricFence/{e}`, `queryVehicleLocatorAndVehicleOfAllProjectInAgency`, `queryVehicleLocatorOfAllProjectInAgency`
- **`vehicleUse`**: `queryAllVehicleUsePage`, `queryApprovedVehicleUseOnThatDay/{e}`, `queryMaterialUsePage`, `queryProcessOfVehicleUse/{e}`, `queryVehicleUseDetails/{e}`, `queryVehiclesUseHistoryPage`
- **`verifyRecord`**: `queryVerifyRecordPage`
- **`waterImmerDetectActor`**: `getWaterImmerDetectHisList`, `pageList`, `queryDetailById/{e}`
- **`wcuActor`**: `getSlaveTypeOfWcu/{e}`, `queryReportMinute/{e}`, `querySerialPort/{e}`
- **`wellcoverActor`**: `getWellcoverDataOnMap/{e}`
- **`westLakeBuilding`**: `queryBuildingListPage`
- **`wifiActor`**: `queryWifiById/{e}`
- **`work`**: `pathPlanList`, `workList`
- **`workMatter`**: `queryAllWorkMatterPage`, `queryWorkMatterDetails/{e}`, `queryWorkMatterPage`
- **`workMatterType`**: `queryWorkMatterTypeList`, `queryWorkMatterTypePage`
- **`workOrderStatistics`**: `getYesterdayMonthYearOrders`
- **`wristbandController`**: `queryWristbandHistory`, `queryWristbandOfAllProjectInAgency`