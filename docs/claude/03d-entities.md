# SLCP — Thực thể & trường dữ liệu (phần 4)

> Bộ 03 gồm 5 phần: `03-entities.md`, `03b-entities.md`, `03c-entities.md`, `03d-entities.md`, `03e-entities.md`

Tiếp theo của `03-entities.md`. Xem phần đầu cho ghi chú nguồn & kiểu.


# Tủ, gateway, cảm biến tủ


### `GET /v1.0/dtuActor/statisticsOfDtuByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `dtuUnableTotal` | number |  |
| `dtuOnlineTotal` | number |  |
| `dtuOnlineRate` | number |  |
| `dtuOfflineTotal` | number |  |
| `dtuEnableTotal` | number |  |
| `dtuTotal` | number |  |

### `GET /v1.0/powerBoxActor/getKmsById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `kch` | number |  |
| `deviceId` | id32 | Device |
| `deviceName` | string |  |

### `GET /v1.0/powerBoxActor/queryInternalLcuInfoOfPowerBox/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `name` | string |  |
| `channel` | number |  |
| `deviceId` | id32 | Device |
| `enabled` | number |  |

### `GET /v1.0/rtuActor/getRtuById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `lng` | string |  |
| `roadId` | null | Road |
| `remark` | null |  |
| `ais[].atype` | number |  |
| `ais[].name` | string |  |
| `ais[].channel` | number |  |
| `ais[].deviceId` | id32 | Device |
| `deviceCode` | string |  |
| `deviceId` | id32 | Device |
| `deviceName` | string |  |
| `deviceStatus` | number |  |
| `dis[].atype` | number |  |
| `dis[].name` | string |  |
| `dis[].channel` | number |  |
| `dis[].deviceId` | id32 | Device |
| `kms[].name` | string |  |
| `kms[].channel` | number |  |
| `kms[].deviceId` | id32 | Device |
| `kms[].enabled` | number |  |
| `uid` | string | (device UID) |
| `areaId` | null | Area |
| `sceneType` | null |  |
| `roadDirection` | null |  |
| `deviceModelId` | id32 | DeviceModel |
| `geographicAddress` | string |  |
| `projectId` | id32 | Project |
| `lat` | string |  |

### `GET /v1.0/rtuActor/queryAllRtuByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `rtuName` | string |  |
| `uid` | string | (device UID) |
| `rtuId` | id32 | RTU |
| `ctype` | number |  |
| `lng` | string |  |
| `networkStatus` | number |  |
| `lat` | string |  |

### `GET /v1.0/rtuActor/queryInternalInfoOfRtu/{e,"/"}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `kms[].name` | string |  |
| `kms[].channel` | number |  |
| `kms[].deviceId` | id32 | Device |
| `kms[].enabled` | number |  |
| `ais[].atype` | number |  |
| `ais[].name` | string |  |
| `ais[].channel` | number |  |
| `ais[].deviceId` | id32 | Device |
| `dis[].atype` | number |  |
| `dis[].name` | string |  |
| `dis[].channel` | number |  |
| `dis[].deviceId` | id32 | Device |

### `GET /v1.0/rtuActor/queryRtuAndRelatedByUid/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `remark` | null |  |
| `deviceId` | id32 | Device |
| `deviceName` | string |  |
| `deviceStatus` | number |  |
| `uid` | string | (device UID) |
| `protocolValue` | number |  |
| `ccid` | string |  |
| `protocolName` | string |  |
| `sim` | null |  |
| `deviceGrade` | number |  |
| `deviceModelId` | id32 | DeviceModel |
| `protocolVersion` | string |  |
| `deviceModelRemark` | null |  |
| `lat` | string |  |
| `losted` | number |  |
| `deviceConfig.lampHolderNum` | number |  |
| `deviceConfig.ratedApparentPower` | number |  |
| `deviceConfig.hasTaskNum` | number |  |
| `deviceConfig.di` | string |  |
| `deviceConfig.voltageP` | string |  |
| `deviceConfig.poleType` | null |  |
| `deviceConfig.radarType` | null |  |
| `deviceConfig.nominalCurrent` | number |  |
| `deviceConfig.waterTankCapacity` | string |  |
| `deviceConfig.lcuType` | null |  |
| `deviceConfig.coverTypes` | string |  |
| `deviceConfig.ratedVoltage` | number |  |
| `deviceConfig.smartBoxType` | string |  |
| `deviceConfig.tempsNum` | number |  |
| `deviceConfig.power` | string |  |
| `deviceConfig.rtuType` | number |  |
| `deviceConfig.taskNum` | number |  |
| `deviceConfig.dimmingLevel` | number |  |
| `deviceConfig.wide` | string |  |
| `deviceConfig.productId` | string |  |
| `deviceConfig.factoryId` | string |  |
| `deviceConfig.ai` | string |  |
| `deviceConfig.heig` | string |  |
| `deviceConfig.lampLifetime` | number |  |
| `deviceConfig.cameraType` | number |  |
| `deviceConfig.currentsNum` | number |  |
| `deviceConfig.nominalPower` | number |  |
| `deviceConfig.ratedCurrent` | number |  |
| `deviceConfig.ratedPowerFactor` | number |  |
| `deviceConfig.gatewayTypes` | string |  |
| `deviceConfig.lampPower` | number |  |
| `deviceTypeValue` | number |  |
| `lng` | string |  |
| `deviceModelName` | string |  |
| `deviceTypeName` | string |  |
| `deviceCode` | string |  |
| `url` | null |  |
| `comModel` | number |  |
| `alarmStatus` | number |  |
| `protocolId` | id32 | Protocol |
| `signals` | number |  |
| `ctype` | number |  |
| `imei` | string |  |
| `systemConfig` | number |  |
| `geographicAddress` | string |  |
| `alarmColor` | string |  |
| `projectId` | id32 | Project |
| `fileId` | null | SysFile |

### `GET /v1.0/rtuActor/queryRtuById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | id32 | User |
| `updateTime` | datetime |  |
| `rtuId` | id32 | RTU |
| `projectId` | id32 | Project |
| `stationId` | null | Station |
| `cuid` | string | (parent UID) |
| `ctype` | number |  |
| `deviceModelId` | id32 | DeviceModel |
| `deviceName` | string |  |
| `deviceCode` | string |  |
| `deviceStatus` | number |  |
| `deviceGrade` | number |  |
| `deviceSource` | number |  |
| `geographicAddress` | string |  |
| `gisDisplay` | number |  |
| `groupId` | null | DeviceGroup |
| `networkStatus` | number |  |
| `ccid` | string |  |
| `sim` | null |  |
| `imei` | string |  |
| `tel` | null |  |
| `apn` | string |  |
| `server` | null |  |
| `port` | null |  |
| `communicationModel` | number |  |
| `electricCollectInterval` | null |  |
| `runningModel` | null |  |
| `signals` | number |  |
| `loginIp` | null |  |
| `version` | string |  |
| `quickLight` | null |  |
| `lightDecline` | null |  |
| `nodeCheck` | null |  |
| `frequency` | null |  |
| `alarmStatus` | number |  |
| `stime` | datetime |  |
| `ftime` | datetime |  |
| `offlineTime` | datetime |  |
| `onlineTime` | datetime |  |
| `netChange` | number |  |
| `systemTime` | datetime |  |
| `timingOn` | number |  |
| `timingResult` | number |  |
| `rtcTime` | datetime |  |
| `routeTime` | datetime |  |
| `lat` | string |  |
| `lng` | string |  |
| `remark` | null |  |
| `areaId` | null | Area |
| `roadId` | null | Road |
| `roadDirection` | null |  |
| `sceneType` | null |  |
| `rfVersion` | null |  |
| `zoneId` | null |  |
| `moduleType` | null |  |
| `frePoint` | null |  |
| `dbm` | null |  |
| `rtuType` | number |  |
| `upgradeFail` | null |  |
| `upgradeStatus` | null |  |
| `upgradeStartTime` | null |  |
| `upgradeEndTime` | null |  |
| `timeBefore` | null |  |
| `timeAfter` | null |  |
| `serialNum` | null |  |
| `serverType` | number |  |
| `qtimeOn` | datetime |  |
| `qtimeResult` | datetime |  |

### `GET /v1.0/rtuActor/queryRtuDeatilById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `rtuModelName` | string |  |
| `stime` | datetime |  |
| `digitalNum` | number |  |
| `remark` | string |  |
| `ilkg` | number |  |
| `rtuName` | string |  |
| `rtuId` | id32 | RTU |
| `kmNum` | number |  |
| `lampNum` | number |  |
| `meterNum` | number |  |
| `simulationNum` | number |  |
| `zoneId` | null |  |
| `rfVersion` | null |  |
| `rtuType` | number |  |
| `lat` | string |  |
| `ftime` | datetime |  |
| `lng` | string |  |
| `rtuStatus` | number |  |
| `theft` | string |  |
| `version` | string |  |
| `ctype` | number |  |
| `lightVal` | null |  |
| `isAlarm` | boolean |  |
| `surgeNum` | string |  |
| `rtuUid` | string |  |
| `lcuNum` | number |  |

### `GET /v1.0/rtuActor/statisticsOfRtuByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `rtuOnlineRate` | number |  |
| `rtuTotal` | number |  |
| `rtuOnlineTotal` | number |  |
| `rtuOfflineTotal` | number |  |
| `rtuOfflineAlarmTotal` | number |  |
| `rtuOfflineNormalTotal` | number |  |
| `rtuAlarmTotal` | number |  |
| `rtuEnableTotal` | number |  |
| `rtuUnableTotal` | number |  |

### `GET /v1.0/smartBoxActor/statisticsOfSmartBoxByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `smartBoxOnlineTotal` | number |  |
| `smartBoxOfflineTotal` | number |  |
| `smartBoxOfflineAlarmTotal` | number |  |
| `smartBoxOnlineRate` | number |  |
| `smartBoxEnableTotal` | number |  |
| `smartBoxOfflineNormalTotal` | number |  |
| `smartBoxUnableTotal` | number |  |
| `smartBoxTotal` | number |  |
| `smartBoxAlarmTotal` | number |  |

### `GET /v1.0/wcuActor/statisticsOfWcuByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `wcuOnlineTotal` | number |  |
| `wcuTotal` | number |  |
| `wcuOfflineTotal` | number |  |
| `wcuOnlineRate` | number |  |
| `wcuUnableTotal` | number |  |
| `wcuEnableTotal` | number |  |

### `POST /v1.0/ProjectStationActor/queryProjectStation`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].rtuId` | id32 | RTU |
| `records[].cuid` | string | (parent UID) |
| `records[].deviceTypeValue` | number |  |
| `records[].ctype` | number |  |
| `records[].createTime` | datetime |  |
| `records[].name` | string |  |
| `records[].projectId` | id32 | Project |
| `records[].gatewayId` | null | Gateway |
| `records[].stationId` | null | Station |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/aidi/getUnRelatedDIByRtuId`
*Tham số:* projectId, current, size, rtuId, superDiId  

| Trường | Kiểu | FK? |
|---|---|---|
| `channel` | number |  |
| `superDiId` | null |  |
| `addr` | number |  |
| `lowDiId` | null |  |
| `deviceId` | id32 | Device |
| `deviceName` | string |  |
| `kmId` | null | KM |

### `POST /v1.0/aidi/queryAIOrDIByProject`
*Tham số:* projectId, current, size, configParamId  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].aidiStatus` | number |  |
| `records[].dtime` | null |  |
| `records[].channel` | number |  |
| `records[].lowDiId` | null |  |
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
| `records[].dtype` | null |  |
| `records[].otherUsed` | boolean |  |
| `records[].deviceCode` | null |  |
| `records[].check` | boolean |  |
| `records[].sync` | string |  |
| `records[].kmId` | null | KM |
| `records[].ctype` | number |  |
| `records[].deviceSource` | number |  |
| `records[].kChannel` | null |  |
| `records[].superDiId` | null |  |
| `records[].kAddr` | null |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/aidi/queryAiDi`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].aidiStatus` | number |  |
| `records[].dtime` | null |  |
| `records[].networkStatus` | number |  |
| `records[].channel` | number |  |
| `records[].deviceName` | string |  |
| `records[].deviceStatus` | number |  |
| `records[].alarmCount` | number |  |
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

### `POST /v1.0/antiActor/queryAisleList`

| Trường | Kiểu | FK? |
|---|---|---|
| `aUid` | string |  |
| `aCh` | number |  |
| `aAdd` | string |  |

### `POST /v1.0/cabinet/getCabinetPlatformPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].cabinetPlatformId` | id32 |  |
| `records[].cabinetUid` | string |  |
| `records[].updateTime` | datetime |  |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/cableInspectionActor/getNumByProjectId`

| Trường | Kiểu | FK? |
|---|---|---|
| `rtuCount` | number |  |
| `ldEnableCount` | number |  |
| `cableInspectionCount` | number |  |

### `POST /v1.0/kmActor/getGroupKmByRtuId`
*Tham số:* projectId, current, size, deviceId  

| Trường | Kiểu | FK? |
|---|---|---|
| `expansionSwitch[].createUserId` | id32 | User |
| `expansionSwitch[].color` | null |  |
| `expansionSwitch[].groupId` | null | DeviceGroup |
| `expansionSwitch[].detect` | string |  |
| `expansionSwitch[].elecShow` | number |  |
| `expansionSwitch[].stime` | datetime |  |
| `expansionSwitch[].remark` | null |  |
| `expansionSwitch[].mtime` | null |  |
| `expansionSwitch[].deviceName` | string |  |
| `expansionSwitch[].enabled` | number |  |
| `expansionSwitch[].deviceStatus` | number |  |
| `expansionSwitch[].qtime` | datetime |  |
| `expansionSwitch[].kch` | number |  |
| `expansionSwitch[].rtuId` | id32 | RTU |
| `expansionSwitch[].superTypeValue` | number |  |
| `expansionSwitch[].deviceGrade` | number |  |
| `expansionSwitch[].deviceModelId` | id32 | DeviceModel |
| `expansionSwitch[].ctime` | datetime |  |
| `expansionSwitch[].attribute` | null |  |
| `expansionSwitch[].power` | null |  |
| `expansionSwitch[].stationId` | null | Station |
| `expansionSwitch[].cuid` | string | (parent UID) |
| `expansionSwitch[].kmStatus` | number |  |
| `expansionSwitch[].atime` | datetime |  |
| `expansionSwitch[].kadd` | number |  |
| `expansionSwitch[].updateUserId` | id32 | User |
| `expansionSwitch[].updateTime` | datetime |  |
| `expansionSwitch[].deviceCode` | null |  |
| `expansionSwitch[].kmId` | id32 | KM |
| `expansionSwitch[].relatedId` | null |  |
| `expansionSwitch[].deviceModelType` | number |  |
| `expansionSwitch[].ctype` | number |  |
| `expansionSwitch[].createTime` | datetime |  |
| `expansionSwitch[].deviceSource` | number |  |
| `expansionSwitch[].width` | null |  |
| `expansionSwitch[].projectId` | id32 | Project |
| `expansionSwitch[].status` | number |  |

### `POST /v1.0/kmActor/queryKmByRtuId`
*Tham số:* projectId, current, size, rtuId  

| Trường | Kiểu | FK? |
|---|---|---|
| `groupId` | null | DeviceGroup |
| `channel` | number |  |
| `detect` | string |  |
| `remark` | null |  |
| `stime` | datetime |  |
| `deviceStatus` | number |  |
| `qtime` | datetime |  |
| `rtuId` | id32 | RTU |
| `superTypeValue` | number |  |
| `deviceGrade` | number |  |
| `deviceModelId` | id32 | DeviceModel |
| `ctime` | datetime |  |
| `tasked` | string |  |
| `power` | null |  |
| `addr` | number |  |
| `stationId` | null | Station |
| `cuid` | string | (parent UID) |
| `kmStatus` | number |  |
| `src` | null |  |
| `deviceCode` | null |  |
| `cableInspectionLoopMap` | null |  |
| `sync` | string |  |
| `kmId` | id32 | KM |
| `ctype` | number |  |
| `kmName` | string |  |
| `deviceSource` | number |  |
| `projectId` | id32 | Project |

### `POST /v1.0/kmActor/queryKmsByRtuId`
*Tham số:* projectId, current, size, rtuId  

| Trường | Kiểu | FK? |
|---|---|---|
| `kmName` | string |  |
| `channel` | number |  |
| `elecShow` | number |  |
| `addr` | number |  |
| `deviceId` | id32 | Device |

### `POST /v1.0/kmActor/queryProjectKm`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].cuid` | string | (parent UID) |
| `records[].kmStatus` | number |  |
| `records[].kadd` | number |  |
| `records[].src` | null |  |
| `records[].groupId` | null | DeviceGroup |
| `records[].deviceModelName` | string |  |
| `records[].detect` | string |  |
| `records[].remark` | null |  |
| `records[].isChoose` | number |  |
| `records[].sync` | string |  |
| `records[].kmId` | id32 | KM |
| `records[].deviceStatus` | number |  |
| `records[].kch` | number |  |
| `records[].rtuId` | id32 | RTU |
| `records[].ctype` | number |  |
| `records[].kmName` | string |  |
| `records[].superTypeValue` | number |  |
| `records[].cuidName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].tasked` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/kmActor/queryProjectKmByColumn`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[][].cuid` | string | (parent UID) |
| `records[][].lampNum` | null |  |
| `records[][].pbType` | null |  |
| `records[][].deviceModelName` | string |  |
| `records[][].name` | string |  |
| `records[][].list[].createUserId` | … | User |
| `records[][].list[].groupId` | … | DeviceGroup |
| `records[][].list[].detect` | … |  |
| `records[][].list[].stime` | … |  |
| `records[][].list[].remark` | … |  |
| `records[][].list[].deviceStatus` | … |  |
| `records[][].list[].kch` | … |  |
| `records[][].list[].rtuId` | … | RTU |
| `records[][].list[].superTypeValue` | … |  |
| `records[][].list[].cuidName` | … |  |
| `records[][].list[].deviceModelId` | … | DeviceModel |
| `records[][].list[].ctime` | … |  |
| `records[][].list[].tasked` | … |  |
| `records[][].list[].power` | … |  |
| `records[][].list[].cuid` | … | (parent UID) |
| `records[][].list[].kmStatus` | … |  |
| `records[][].list[].kadd` | … |  |
| `records[][].list[].src` | … |  |
| `records[][].list[].updateUserId` | … | User |
| `records[][].list[].updateTime` | … |  |
| `records[][].list[].isChoose` | … |  |
| `records[][].list[].sync` | … |  |
| `records[][].list[].kmId` | … | KM |
| `records[][].list[].ctype` | … |  |
| `records[][].list[].createTime` | … |  |
| `records[][].list[].kmName` | … |  |
| `records[][].list[].projectId` | … | Project |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/kmActor/queryUnRelatedKmOfRtu`
*Tham số:* projectId, current, size, rtuId, aidiId  

| Trường | Kiểu | FK? |
|---|---|---|
| `groupId` | null | DeviceGroup |
| `channel` | number |  |
| `detect` | string |  |
| `remark` | null |  |
| `stime` | datetime |  |
| `deviceStatus` | number |  |
| `qtime` | datetime |  |
| `rtuId` | id32 | RTU |
| `superTypeValue` | number |  |
| `deviceGrade` | number |  |
| `deviceModelId` | id32 | DeviceModel |
| `ctime` | datetime |  |
| `tasked` | string |  |
| `power` | null |  |
| `addr` | number |  |
| `stationId` | null | Station |
| `cuid` | string | (parent UID) |
| `kmStatus` | number |  |
| `src` | null |  |
| `deviceCode` | null |  |
| `cableInspectionLoopMap` | null |  |
| `sync` | string |  |
| `kmId` | id32 | KM |
| `ctype` | number |  |
| `kmName` | string |  |
| `deviceSource` | number |  |
| `projectId` | id32 | Project |

### `POST /v1.0/phaseAuto/getAreaAndRoad`

| Trường | Kiểu | FK? |
|---|---|---|
| `areaId` | id32 | Area |
| `code` | string |  |
| `name` | string |  |
| `systemConfig` | number |  |
| `remark` | string |  |
| `cityId` | id32 | City |
| `id` | id32 |  |
| `provinceId` | id32 | Province |
| `projectId` | null | Project |
| `countryId` | id32 | Country |

### `POST /v1.0/phaseAuto/getRtuList`

| Trường | Kiểu | FK? |
|---|---|---|
| `uid` | string | (device UID) |
| `deviceId` | id32 | Device |
| `deviceName` | string |  |

### `POST /v1.0/rtuActor/deployPageList`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].thermometerStatusTime` | null |  |
| `records[].sensorStatusTime` | null |  |
| `records[].waterDetectorStatus` | null |  |
| `records[].cuid` | string | (parent UID) |
| `records[].kmStatus` | null |  |
| `records[].sensorStatus` | null |  |
| `records[].networkStatus` | number |  |
| `records[].luxStatus` | null |  |
| `records[].deviceModelName` | string |  |
| `records[].tiltSensorStatus` | null |  |
| `records[].luxStatusTime` | null |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].lockStatusTime` | null |  |
| `records[].tiltSensorStatusTime` | null |  |
| `records[].waterDetectorStatusTime` | null |  |
| `records[].meterStatus` | null |  |
| `records[].thermometerStatus` | null |  |
| `records[].ctype` | number |  |
| `records[].lockStatus` | null |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].meterStatusTime` | null |  |
| `records[].kmStatusTime` | null |  |
| `records[].rtuType` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/rtuActor/getMeterDataByRtuId`
*Tham số:* projectId, current, size, rtuId, type  

| Trường | Kiểu | FK? |
|---|---|---|
| `addr` | number |  |
| `deviceName` | string |  |

### `POST /v1.0/rtuActor/getRtuAndMeterInfoList`

| Trường | Kiểu | FK? |
|---|---|---|
| `uid` | string | (device UID) |
| `name` | string |  |
| `rtuName` | string |  |
| `stationName` | null |  |
| `rtuId` | id32 | RTU |
| `list[].meterId` | id32 | Meter |
| `list[].meterName` | string |  |
| `list[].addr` | number |  |
| `list[].mtype` | number |  |
| `list[].ctype` | number |  |
| `list[].mmodelType` | number |  |

### `POST /v1.0/rtuActor/mapRtuPageList`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].cuid` | string | (parent UID) |
| `records[].lng` | string |  |
| `records[].electricShockAlarm` | null |  |
| `records[].networkStatus` | number |  |
| `records[].roadId` | null | Road |
| `records[].remark` | null |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].deviceStatus` | number |  |
| `records[].reference` | null |  |
| `records[].alarmStatus` | number |  |
| `records[].areaId` | null | Area |
| `records[].gisDisplay` | number |  |
| `records[].sceneType` | null |  |
| `records[].roadDirection` | null |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].higherDevice` | null |  |
| `records[].kmList[].rtuId` | id32 | RTU |
| `records[].kmList[].kmStatus` | number |  |
| `records[].kmList[].kmName` | string |  |
| `records[].kmList[].groupId` | null | DeviceGroup |
| `records[].kmList[].ctime` | datetime |  |
| `records[].kmList[].stime` | datetime |  |
| `records[].kmList[].cableInspectionLoopMap` | null |  |
| `records[].kmList[].kmId` | id32 | KM |
| `records[].leakageCurrent` | number |  |
| `records[].lat` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/rtuActor/pageList`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].modelName` | string |  |
| `records[].rtuId` | id32 | RTU |
| `records[].deviceTypeId` | id32 | DeviceType |
| `records[].cuid` | string | (parent UID) |
| `records[].ctype` | number |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].geographicAddress` | string |  |
| `records[].deviceCode` | string |  |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/rtuActor/queryGroupRtu`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].cuid` | string | (parent UID) |
| `records[].deviceModelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/rtuActor/queryLcuCanRelatedRtuPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].modelName` | string |  |
| `records[].rtuId` | id32 | RTU |
| `records[].deviceTypeId` | id32 | DeviceType |
| `records[].cuid` | string | (parent UID) |
| `records[].ctype` | number |  |
| `records[].networkStatus` | number |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].geographicAddress` | string |  |
| `records[].deviceCode` | string |  |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/rtuActor/queryRtuByluxId`
*Tham số:* projectId, current, size, luxId  

| Trường | Kiểu | FK? |
|---|---|---|
| `modelName` | string |  |
| `rtuId` | id32 | RTU |
| `cuid` | string | (parent UID) |
| `ctype` | number |  |
| `deviceModelId` | id32 | DeviceModel |
| `geographicAddress` | string |  |
| `projectId` | id32 | Project |
| `deviceName` | string |  |

### `POST /v1.0/rtuActor/queryUnrelatedRtuPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].deviceTypeValue` | number |  |
| `records[].deviceModelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].geographicAddress` | string |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

# Năng lượng & công tơ


### `GET /v1.0/meterActor/getMeterById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `madd` | number |  |
| `remark` | null |  |
| `deviceCode` | null |  |
| `deviceName` | string |  |
| `deviceStatus` | number |  |
| `mType` | number |  |
| `rtuId` | id32 | RTU |
| `meterId` | id32 | Meter |
| `superTypeValue` | number |  |
| `uMark` | number |  |
| `deviceModelId` | id32 | DeviceModel |
| `deviceSource` | number |  |
| `projectId` | id32 | Project |

### `GET /v1.0/meterActor/queryByMeterId/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | id32 | User |
| `updateTime` | datetime |  |
| `meterId` | id32 | Meter |
| `projectId` | id32 | Project |
| `rtuId` | id32 | RTU |
| `stationId` | null | Station |
| `ctype` | number |  |
| `cuid` | string | (parent UID) |
| `superTypeValue` | number |  |
| `superDeviceId` | null |  |
| `superSerialId` | null |  |
| `deviceModelId` | id32 | DeviceModel |
| `deviceName` | string |  |
| `deviceCode` | null |  |
| `deviceStatus` | number |  |
| `deviceGrade` | number |  |
| `deviceSource` | number |  |
| `cratio` | number |  |
| `htime` | null |  |
| `madd` | number |  |
| `mtype` | number |  |
| `num` | number |  |
| `price` | null |  |
| `sync` | null |  |
| `queryCheck` | null |  |
| `vratio` | number |  |
| `remark` | null |  |
| `geographicAddress` | null |  |
| `lat` | null |  |
| `lng` | null |  |
| `actCode` | null |  |
| `actStatus` | null |  |
| `billingMethod` | number |  |
| `alarmRemark` | null |  |
| `cycle` | null |  |
| `mmodelType` | number |  |

### `GET /v1.0/meterActor/queryMeterDataByRtuId/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `internalMeter[].dtime` | datetime |  |
| `internalMeter[].num` | number |  |
| `internalMeter[].freq` | number |  |
| `internalMeter[].mModelType` | number |  |
| `internalMeter[].uavg` | number |  |
| `internalMeter[].deviceName` | string |  |
| `internalMeter[].ilkg` | number |  |
| `internalMeter[].mtype` | number |  |
| `internalMeter[].superDeviceName` | string |  |
| `internalMeter[].current` | number |  |
| `internalMeter[].totalPe` | number |  |
| `internalMeter[].totalCurrent` | number |  |
| `internalMeter[].superUid` | string |  |
| `internalMeter[].totalPowerFactor` | number |  |
| `internalMeter[].power` | number |  |
| `internalMeter[].energy` | number |  |
| `internalMeter[].referenceValue` | number |  |
| `internalMeter[].phase` | string |  |
| `internalMeter[].reactivePower` | number |  |
| `internalMeter[].apparentPower` | number |  |
| `internalMeter[].madd` | number |  |
| `internalMeter[].superDeviceId` | id32 |  |
| `internalMeter[].voltage` | number |  |
| `internalMeter[].totalApparentPower` | number |  |
| `internalMeter[].totalReactivePower` | number |  |
| `internalMeter[].meterId` | id32 | Meter |
| `internalMeter[].totalPower` | number |  |
| `internalMeter[].powerFactor` | number |  |
| `externalMeterDtime` | null |  |
| `userMeterDtime` | null |  |
| `internalMeterDtime` | datetime |  |
| `ilkg` | number |  |
| `totalPower` | number |  |

### `GET /v1.0/meterActor/queryMeterTypeOfRtu/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `mtype` | number |  |
| `meterId` | id32 | Meter |
| `madd` | number |  |
| `num` | number |  |
| `mModelType` | number |  |

### `POST /v1.0/carbonExport/getPowerBoxData`
*Tham số:* projectId, current, size, deviceId, lcuId, rtuId, deviceTypeValue, startDate, endDate  

| Trường | Kiểu | FK? |
|---|---|---|
| `url` | string |  |

### `POST /v1.0/meterActor/getConfigMeterList`
*Tham số:* projectId, current, size  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].mtype` | number |  |
| `records[].isCheck` | number |  |
| `records[].cuid` | string | (parent UID) |
| `records[].ctype` | number |  |
| `records[].superTypeValue` | number |  |
| `records[].madd` | number |  |
| `records[].num` | number |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].name` | string |  |
| `records[].cuidName` | string |  |
| `records[].deviceCode` | null |  |
| `records[].deviceId` | id32 | Device |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/meterActor/getMeterQueryPage`

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
| `records[].alarmCount` | number |  |
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
| `records[].deviceModelName` | null |  |
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

### `POST /v1.0/meterReading/queryElectricityBillPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].valleyPrice` | number |  |
| `records[].createTimeLong` | number |  |
| `records[].meterName` | string |  |
| `records[].billType` | number |  |
| `records[].billUnit` | number |  |
| `records[].generalPrice` | number |  |
| `records[]._year` | number |  |
| `records[].mtype` | number |  |
| `records[]._month` | number |  |
| `records[]._day` | number |  |
| `records[].electricityBill` | number |  |
| `records[].createTime` | datetime |  |
| `records[].pe` | number |  |
| `records[].meterId` | id32 | Meter |
| `records[].billUnitName` | string |  |
| `records[].meterCode` | null |  |
| `records[].id` | id32 |  |
| `records[].billTypeName` | string |  |
| `records[].projectId` | id32 | Project |
| `records[].peakPrice` | number |  |
| `records[].flatPrice` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/projectEnergyConfigDevicetype/getConfigByProject`
*Tham số:* projectId, current, size  

| Trường | Kiểu | FK? |
|---|---|---|
| `innerMeter` | boolean |  |
| `createUserId` | id32 | User |
| `solarController` | boolean |  |
| `updateUserId` | id32 | User |
| `userMeter` | boolean |  |
| `updateTime` | datetime |  |
| `directLcu` | boolean |  |
| `solarLcu` | boolean |  |
| `createTime` | datetime |  |
| `noDirectLcu` | boolean |  |
| `id` | id32 |  |
| `projectId` | id32 | Project |
| `status` | number |  |