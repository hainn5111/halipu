# SLCP — Thực thể & trường dữ liệu (phần 2)

> Bộ 03 gồm 5 phần: `03-entities.md`, `03b-entities.md`, `03c-entities.md`, `03d-entities.md`, `03e-entities.md`

Tiếp theo của `03-entities.md`. Xem phần đầu cho ghi chú nguồn & kiểu.


# Mô hình & quản lý thiết bị


### `GET /v1.0/device/countDeviceNumByPid/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `wifiNum` | number |  |
| `chargingNum` | number |  |
| `dustbinNum` | number |  |
| `solarNum` | number |  |
| `appealNum` | number |  |
| `loudspeakerNum` | number |  |
| `lcuNum` | number |  |
| `cameraNum` | number |  |
| `sensorNum` | number |  |
| `wellcoverNum` | number |  |
| `solarLcuNum` | number |  |
| `screenNum` | number |  |

### `GET /v1.0/device/countDeviceNumsOfProject/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `luxNum` | number |  |
| `vehicleLocatorNum` | number |  |
| `underCableNum` | number |  |
| `showingMasterNum` | number |  |
| `underpipeNum` | number |  |
| `screenNum` | number |  |
| `lightningProtectionNum` | number |  |
| `radarNum` | number |  |
| `stationNum` | number |  |
| `cableInspectionNum` | number |  |
| `loudspeakerNum` | number |  |
| `electronicLockNum` | number |  |
| `fogPileNum` | number |  |
| `powerBoxNum` | number |  |
| `broadcastBoxNum` | number |  |
| `wellcoverNum` | number |  |
| `tiltSensorNum` | number |  |
| `wifiNum` | number |  |
| `transformerNum` | number |  |
| `rtuNum` | number |  |
| `lcuNum` | number |  |
| `cameraNum` | number |  |
| `antiNum` | number |  |
| `thermometerNum` | number |  |
| `transferSwitchNum` | number |  |
| `smNum` | number |  |
| `solarLcuNum` | number |  |
| `acContactorNum` | number |  |
| `chargingNum` | number |  |
| `dustNum` | number |  |
| `wristbandNum` | number |  |
| `lampNum` | number |  |
| `weakCabinetNum` | number |  |
| `meterNum` | number |  |
| `solarNum` | number |  |
| `gatewayNum` | number |  |
| `dtuNum` | number |  |
| `trafficLightNum` | number |  |
| `transBoxNum` | number |  |
| `poleNum` | number |  |
| `waterImmerDetectNum` | number |  |
| `antiExModuleNum` | number |  |
| `bsNum` | number |  |
| `repairWellNum` | number |  |
| `signageNum` | number |  |
| `appealNum` | number |  |
| `sensorNum` | number |  |
| `breakerNum` | number |  |
| `cabinetNum` | number |  |
| `kdNum` | number |  |

### `GET /v1.0/device/countTheDeviceNumberOfStates/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `dcLcu.lcuOnlineTotal` | number |  |
| `dcLcu.lcuAlarmTotal` | number |  |
| `dcLcu.lcuTotal` | number |  |
| `dcLcu.lcuOnlineRate` | number |  |
| `dcLcu.lcuOverhaulTotal` | number |  |
| `dcLcu.lcuUnknownTotal` | number |  |
| `dcLcu.lcuLostTotal` | number |  |
| `dcLcu.lcuEnableTotal` | number |  |
| `dcLcu.lcuOfflineTotal` | number |  |
| `rtu.rtuOnlineRate` | number |  |
| `rtu.rtuTotal` | number |  |
| `rtu.rtuOnlineTotal` | number |  |
| `rtu.rtuOfflineTotal` | number |  |
| `rtu.rtuAlarmTotal` | number |  |
| `rtu.rtuEnableTotal` | number |  |
| `solar.solarTotal` | number |  |
| `solar.solarOnlineTotal` | number |  |
| `solar.solarOnlineRate` | number |  |
| `solar.solarOfflineTotal` | number |  |
| `solar.solarAlarmTotal` | number |  |
| `idcLcu.lcuAlarmTotal` | number |  |
| `idcLcu.lcuUncontrollableTotal` | number |  |
| `idcLcu.lcuTotal` | number |  |
| `idcLcu.lcuControllableTotal` | number |  |
| `idcLcu.lcuControlRate` | number |  |
| `idcLcu.lcuLostTotal` | number |  |
| `lamp.halfBrightness` | number |  |
| `lamp.abnormalNum` | number |  |
| `lamp.lowBrightness` | number |  |
| `lamp.lampTotal` | number |  |
| `lamp.lightingTotal` | number |  |
| `lamp.lightRate` | number |  |
| `lamp.highBrightness` | number |  |
| `lcu.lcuAlarmTotal` | number |  |
| `lcu.lcuTotal` | number |  |
| `solarLcu.solarLcuAlarmTotal` | number |  |
| `solarLcu.solarLcuOnlineRate` | number |  |
| `solarLcu.solarLcuOfflineTotal` | number |  |
| `solarLcu.solarLcuOnlineTotal` | number |  |
| `solarLcu.solarLcuTotal` | number |  |

### `GET /v1.0/device/getAppealCountByStatus/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `uncallNum` | number |  |
| `oncallNum` | number |  |
| `callingNum` | number |  |

### `GET /v1.0/deviceSystemController/queryDeviceSystemList`

| Trường | Kiểu | FK? |
|---|---|---|
| `protocolId` | id32 | Protocol |
| `deviceSystemName` | string |  |
| `deviceSystemMark` | null |  |
| `systemConfig` | number |  |
| `remark` | string |  |
| `deviceSystemId` | id32 |  |

### `GET /v1.0/deviceTypeController/queryAllDeviceTypeByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceConfig` | number |  |
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `remark` | string |  |
| `choose` | number |  |

### `GET /v1.0/deviceTypeController/queryDeviceTypeById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `systemConfig` | number |  |
| `remark` | string |  |
| `isUsed` | number |  |

### `GET /v1.0/deviceTypeController/queryDeviceTypeByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `systemConfig` | number |  |
| `remark` | string |  |

### `GET /v1.0/deviceTypeController/queryDeviceTypeList`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `lang` | string |  |

### `GET /v1.0/deviceTypeController/queryDeviceTypeOfCarrierEquipment`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `systemConfig` | number |  |
| `remark` | string |  |

### `GET /v1.0/deviceTypeController/queryDeviceTypeOfIndependentByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `systemConfig` | number |  |
| `remark` | string |  |

### `GET /v1.0/deviceTypeController/queryDeviceTypeOnMap`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `systemConfig` | number |  |
| `remark` | string |  |

### `GET /v1.0/deviceTypeController/queryDeviceTypeOnMapOfProject/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `systemConfig` | number |  |
| `remark` | string |  |

### `GET /v1.0/deviceTypeController/queryDeviceTypesWithUidOfProject/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |

### `GET /v1.0/factoryController/queryFactoryList`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `factoryId` | id32 |  |
| `factoryName` | string |  |
| `remark` | string |  |
| `systemConfig` | number |  |

### `GET /v1.0/poleType/getPoleTypeById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `poleTypeValue` | number |  |
| `poleTypeName` | string |  |
| `systemConfig` | number |  |
| `remark` | string |  |
| `poleTypeId` | id32 | PoleType |
| `projectId` | null | Project |

### `GET /v1.0/protocolActor/queryList`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `protocolId` | id32 | Protocol |
| `protocolName` | string |  |
| `protocolValue` | number |  |
| `protocolVersion` | string |  |
| `protocolGroup` | string |  |
| `deviceTypeId` | id32 | DeviceType |

### `POST /v1.0/device/countDevicePage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].deviceTypeId` | id32 | DeviceType |
| `records[].deviceTypeValue` | number |  |
| `records[].deviceCount` | number |  |
| `records[].deviceModelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].deviceTypeName` | string |  |
| `records[].projectId` | id32 | Project |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/device/getBatchOpeFailedDevice`
*Tham số:* projectId, current, size, type  

| Trường | Kiểu | FK? |
|---|---|---|
| `actionType` | number |  |
| `fail` | number |  |
| `offline` | number |  |
| `opeStatus` | number |  |
| `total` | number |  |
| `disabledTotal` | null |  |
| `comTime` | datetime |  |
| `success` | number |  |
| `opeType` | number |  |
| `dType` | number |  |
| `electricShockTotal` | number |  |

### `POST /v1.0/device/getDeviceLog`
*Tham số:* projectId, current, size, deviceId  

| Trường | Kiểu | FK? |
|---|---|---|
| `port` | null |  |
| `serverAddress` | null |  |
| `updateTime` | datetime |  |
| `type` | number |  |
| `getStatus` | null |  |
| `deviceId` | id32 | Device |
| `url` | null |  |

### `POST /v1.0/device/queryDeviceByProjectAndDeviceTypePage`
*Tham số:* projectId, current, size, deviceTypeValue  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].superDeviceUid` | null |  |
| `records[].deviceTypeId` | id32 | DeviceType |
| `records[].curyGroupName` | null |  |
| `records[].networkStatus` | number |  |
| `records[].alarmParamsTimes` | null |  |
| `records[].freq` | null |  |
| `records[].imsi` | string |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].systemTime` | null |  |
| `records[].roadName` | null |  |
| `records[].deviceStatus` | number |  |
| `records[].curyCompanyName` | null |  |
| `records[].uid` | string | (device UID) |
| `records[].protocolValue` | number |  |
| `records[].gisDisplay` | number |  |
| `records[].ccid` | string |  |
| `records[].protocolName` | string |  |
| `records[].areaName` | null |  |
| `records[].superTypeValue` | number |  |
| `records[].deviceGrade` | number |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].lat` | number |  |
| `records[].poleId` | id32 | Pole |
| `records[].deviceConfig` | string |  |
| `records[].actStatus` | null |  |
| `records[].supplyDevice` | null |  |
| `records[].deviceTypeValue` | number |  |
| `records[].lng` | number |  |
| `records[].transmissionPower` | null |  |
| `records[].upChannel` | null |  |
| `records[].deviceModelName` | string |  |
| `records[].deviceTypeName` | string |  |
| `records[].deviceCode` | string |  |
| `records[].version` | null |  |
| `records[].alarmParamsStatus` | null |  |
| `records[].platformDeviceId` | null |  |
| `records[].deveui` | null |  |
| `records[].actCode` | null |  |
| `records[].alarmStatus` | number |  |
| `records[].ctype` | number |  |
| `records[].regionId` | null |  |
| `records[].deviceSource` | number |  |
| `records[].imei` | string |  |
| `records[].registerStatus` | number |  |
| `records[].higherDevice` | number |  |
| `records[].geographicAddress` | string |  |
| `records[].updated` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/device/queryDeviceOverviewPage`
*Tham số:* projectId, current, size, deviceTypeValue, ctype  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].superDeviceUid` | null |  |
| `records[].networkStatus` | number |  |
| `records[].freq` | null |  |
| `records[].imsi` | string |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].systemTime` | null |  |
| `records[].deviceStatus` | number |  |
| `records[].uid` | string | (device UID) |
| `records[].rtuId` | null | RTU |
| `records[].gisDisplay` | number |  |
| `records[].ccid` | string |  |
| `records[].superTypeValue` | number |  |
| `records[].deviceGrade` | number |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].higherDeviceTypeName` | null |  |
| `records[].labelName` | null |  |
| `records[].lat` | number |  |
| `records[].poleId` | id32 | Pole |
| `records[].actStatus` | null |  |
| `records[].supplyDevice` | null |  |
| `records[].lng` | number |  |
| `records[].transmissionPower` | null |  |
| `records[].isDeploy` | number |  |
| `records[].upChannel` | null |  |
| `records[].deviceModelName` | string |  |
| `records[].deviceCode` | string |  |
| `records[].version` | null |  |
| `records[].platformDeviceId` | null |  |
| `records[].labelColor` | null |  |
| `records[].deveui` | null |  |
| `records[].actCode` | null |  |
| `records[].alarmStatus` | number |  |
| `records[].ctype` | number |  |
| `records[].regionId` | null |  |
| `records[].deviceSource` | number |  |
| `records[].controllable` | number |  |
| `records[].imei` | string |  |
| `records[].geographicAddress` | string |  |
| `records[].updated` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/device/queryDevicePage`
*Tham số:* projectId, current, size, deviceTypeValue  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].roadLevelName` | null |  |
| `records[].roadId` | string | Road |
| `records[].roadLevelId` | null |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].roadName` | null |  |
| `records[].deviceStatus` | number |  |
| `records[].uid` | string | (device UID) |
| `records[].protocolValue` | string |  |
| `records[].ccid` | string |  |
| `records[].protocolName` | string |  |
| `records[].areaName` | null |  |
| `records[].deviceGrade` | number |  |
| `records[].poleCode` | string | Pole |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].superDeviceType` | number |  |
| `records[].poleId` | id32 | Pole |
| `records[].lat` | number |  |
| `records[].lng` | number |  |
| `records[].deviceModelName` | string |  |
| `records[].deviceCode` | string |  |
| `records[].platformDeviceId` | null |  |
| `records[].areaId` | string | Area |
| `records[].ctype` | number |  |
| `records[].createTime` | datetime |  |
| `records[].roadDirection` | null |  |
| `records[].deviceSource` | number |  |
| `records[].registerStatus` | number |  |
| `records[].higherDevice` | string |  |
| `records[].geographicAddress` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/device/queryLuxDeviceList`
*Tham số:* projectId, current, size, deviceId, lcuId, rtuId, deviceTypeValue, startDate, endDate  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].endMin` | null |  |
| `records[].luxOn` | null |  |
| `records[].networkStatus` | number |  |
| `records[].luxStatus` | number |  |
| `records[].deviceModelName` | string |  |
| `records[].startMin` | null |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].uid` | string | (device UID) |
| `records[].endHour` | null |  |
| `records[].luxOff` | null |  |
| `records[].ctype` | number |  |
| `records[].dimOn` | null |  |
| `records[].startHour` | null |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].dimOff` | null |  |
| `records[].luxEnable` | number |  |
| `records[].latLngStatus` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/device/searchDeviceOnMap`

| Trường | Kiểu | FK? |
|---|---|---|
| `history.historyList[].searchContent` | string |  |
| `allCount` | number |  |

### `POST /v1.0/deviceOverview/getRtuOverviewDetails`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].mtype` | number |  |
| `records[].meterName` | string |  |
| `records[].meterId` | id32 | Meter |
| `records[].deviceModelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].geographicAddress` | string |  |
| `records[].addr` | number |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].deviceStatus` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/deviceSystemController/queryDeviceSystemPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].deviceSystemName` | string |  |
| `records[].protocolId` | id32 | Protocol |
| `records[].protocolName` | string |  |
| `records[].remark` | string |  |
| `records[].deviceSystemId` | id32 |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/deviceTypeController/getOverViewDeviceTypes`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `remark` | string |  |

### `POST /v1.0/deviceTypeController/queryAllDeviceType`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceConfig` | number |  |
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `remark` | string |  |
| `choose` | number |  |
| `iotConfig` | number |  |

### `POST /v1.0/deviceTypeController/queryDeviceTypePage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].deviceTypeId` | id32 | DeviceType |
| `records[].deviceTypeValue` | number |  |
| `records[].deviceTypeName` | string |  |
| `records[].systemConfig` | number |  |
| `records[].remark` | string |  |
| `records[].dictKey` | null |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/deviceTypeController/queryLinkageStrategyAlarmDeviceType`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `remark` | string |  |

### `POST /v1.0/deviceTypeController/queryLinkageStrategySuperDeviceType`

| Trường | Kiểu | FK? |
|---|---|---|
| `deviceTypeId` | id32 | DeviceType |
| `deviceTypeValue` | number |  |
| `deviceTypeName` | string |  |
| `remark` | string |  |

### `POST /v1.0/nonIotDevice/queryNonIotDeviceOnMap`

| Trường | Kiểu | FK? |
|---|---|---|
| `allCount` | number |  |

### `POST /v1.0/poleType/getAllPoleTypeOfProjectList`

| Trường | Kiểu | FK? |
|---|---|---|
| `poleTypeValue` | number |  |
| `poleTypeName` | string |  |
| `systemConfig` | number |  |
| `remark` | string |  |
| `poleTypeId` | id32 | PoleType |
| `projectId` | null | Project |

### `POST /v1.0/poleType/getAllPoleTypeOfProjectPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].poleTypeValue` | number |  |
| `records[].poleTypeName` | string |  |
| `records[].systemConfig` | number |  |
| `records[].remark` | string |  |
| `records[].poleTypeId` | id32 | PoleType |
| `records[].projectId` | null | Project |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/poleType/getInPoleTypeOfProject`

| Trường | Kiểu | FK? |
|---|---|---|
| `poleTypeValue` | number |  |
| `poleTypeName` | string |  |
| `poleTypeId` | id32 | PoleType |

### `POST /v1.0/supplyElectricityDevice/queryMeterPhase`
*Tham số:* projectId, current, size, stationId, rtuId, kmId  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].phase` | number |  |
| `records[].mtype` | number |  |
| `records[].meterId` | id32 | Meter |
| `records[].madd` | number |  |
| `records[].mModelType` | number |  |
| `records[].check` | number |  |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |
