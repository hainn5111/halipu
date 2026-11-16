# SLCP — Thực thể & trường dữ liệu (phần 3)

> Bộ 03 gồm 5 phần: `03-entities.md`, `03b-entities.md`, `03c-entities.md`, `03d-entities.md`, `03e-entities.md`

Tiếp theo của `03-entities.md`. Xem phần đầu cho ghi chú nguồn & kiểu.


# Đèn & LCU


### `GET /v1.0/lcuActor/queryLcuAndRelatedByLcuId/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `roadLevelName` | null |  |
| `remoteUpgrade` | number |  |
| `roadId` | string | Road |
| `dimMode` | null |  |
| `roadLevelId` | null |  |
| `deviceId` | id32 | Device |
| `deviceName` | string |  |
| `protocolValue` | number |  |
| `temDetection` | number |  |
| `lightOperated` | number |  |
| `superTypeValue` | number |  |
| `deviceGrade` | number |  |
| `deviceModelId` | id32 | DeviceModel |
| `deviceModelRemark` | null |  |
| `runTime` | null |  |
| `poleId` | id32 | Pole |
| `lat` | number |  |
| `deviceConfig.lampHolderNum` | string |  |
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
| `deviceConfig.dimmingLevel` | string |  |
| `deviceConfig.wide` | string |  |
| `deviceConfig.productId` | string |  |
| `deviceConfig.factoryId` | string |  |
| `deviceConfig.ai` | string |  |
| `deviceConfig.heig` | string |  |
| `deviceConfig.lampLifetime` | number |  |
| `deviceConfig.totalChargingPorts` | number |  |
| `deviceConfig.cameraType` | number |  |
| `deviceConfig.currentsNum` | number |  |
| `deviceConfig.loopType` | number |  |
| `deviceConfig.nominalPower` | number |  |
| `deviceConfig.ratedCurrent` | number |  |
| `deviceConfig.extensions[].name` | string |  |
| `deviceConfig.extensions[].label` | string |  |
| `deviceConfig.extensions[].value` | boolean |  |
| `deviceConfig.ratedPowerFactor` | number |  |
| `deviceConfig.gatewayTypes` | string |  |
| `deviceConfig.powerProtocol` | number |  |
| `deviceConfig.lampPower` | number |  |
| `offNum` | null |  |
| `lng` | number |  |
| `deviceTypeName` | string |  |
| `lcuTask` | number |  |
| `cls` | string |  |
| `gps` | number |  |
| `version` | null |  |
| `port` | null |  |
| `heartbeatDelay` | null |  |
| `systemConfig` | number |  |
| `geographicAddress` | string |  |
| `projectId` | id32 | Project |
| `fileId` | null | SysFile |
| `server` | null |  |
| `deviceTypeId` | id32 | DeviceType |
| `networkStatus` | number |  |
| `poleSlant` | number |  |
| `freq` | null |  |
| `lightDecline` | null |  |
| `remark` | string |  |
| `lwan` | string |  |
| `imsi` | string |  |
| `protocolMode` | number |  |
| `energyAccumulation` | number |  |
| `deviceStatus` | number |  |
| `fcntbits` | string |  |
| `diDetection` | number |  |
| `networkTime` | null |  |
| `uid` | string | (device UID) |
| `protocolName` | string |  |
| `ccid` | string |  |
| `sim` | string |  |
| `protocolVersion` | string |  |
| `connectId` | string |  |
| `dimDirection` | null |  |
| `deviceTypeValue` | number |  |

### `GET /v1.0/lcuActor/queryLcuDeatilById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `lng` | string |  |
| `fitstTime` | string |  |
| `lcuUid` | string |  |
| `deviceModelName` | string |  |
| `remark` | string |  |
| `deviceName` | string |  |
| `version` | string |  |
| `deviceStatus` | number |  |
| `light.1` | string |  |
| `lcuId` | id32 | LCU |
| `angle` | string |  |
| `poleModelName` | string |  |
| `rtuUid` | string |  |
| `lat` | string |  |

### `GET /v1.0/lcuActor/statisticsOfLcuByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `dualLampUnboundTotal` | number |  |
| `lampFaultsYear` | number |  |
| `lcuAlarmTotal` | number |  |
| `poleEnableTotal` | number |  |
| `lcuTotal` | number |  |
| `lcuUnableTotal` | number |  |
| `poleUnEnableTotal` | number |  |
| `lightRate` | number |  |
| `uidRecordsMonth` | number |  |
| `lcuEnableTotal` | number |  |
| `poleTotal` | number |  |
| `lcuDualLampTotal` | number |  |
| `singleLampUnknownTotal` | number |  |
| `dualLampOnTotal` | number |  |
| `lcuOnlineTotal` | number |  |
| `uidRecordsYear` | number |  |
| `singleLampOffTotal` | number |  |
| `powerFaultsMonth` | number |  |
| `uidRecordsWeek` | number |  |
| `lcuOfflineTotal` | number |  |
| `dualLampUnknownTotal` | number |  |
| `dualLampOffTotal` | number |  |
| `powerFaultsYear` | number |  |
| `lcuLightUnknownTotal` | number |  |
| `powerFaultsWeek` | number |  |
| `lcuLightOffTotal` | number |  |
| `lampFaultsMonth` | number |  |
| `lampFaultsWeek` | number |  |
| `lcuSingleLampTotal` | number |  |
| `singleLampOnTotal` | number |  |

### `GET /v1.0/lcuActor/statisticsOfNonDirectLcuByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `lcuTotal` | number |  |
| `lcuUnableTotal` | number |  |
| `lcuEnableTotal` | number |  |

### `GET /v1.0/luxActor/statisticsOfLuxByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `luxOfflineTotal` | number |  |
| `luxTotal` | number |  |
| `luxEnableTotal` | number |  |
| `luxOnlineTotal` | number |  |

### `GET /v1.0/poleActor/queryLcusOfPoleByLcuId/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `lamp[].dims` | number |  |
| `lamp[].lampIdentificationName` | null |  |
| `lamp[].lampId` | id32 | Lamp |
| `lamp[].groupId` | null | DeviceGroup |
| `lamp[].lightDistributionType` | null |  |
| `lamp[].ls` | null |  |
| `lamp[].channel` | number |  |
| `lamp[].lgnum` | number |  |
| `lamp[].dim` | number |  |
| `lamp[].lampTypeName` | string |  |
| `lamp[].lampIdentificationNumber` | null |  |
| `lamp[].deviceName` | string |  |
| `lamp[].lampGtin` | null |  |
| `lamp[].deviceStatus` | number |  |
| `lamp[].maxchannel` | number |  |
| `lamp[].protocolName` | string |  |
| `lamp[].luid` | string | (LCU UID) |
| `lamp[].deviceModelId` | id32 | DeviceModel |
| `lamp[].nominalPowerInput` | null |  |
| `lamp[].angle` | null |  |
| `lamp[].lat` | number |  |
| `lamp[].losted` | number |  |
| `lamp[].nominalLightOutput` | null |  |
| `lamp[].direction` | null |  |
| `lamp[].lampDate` | null |  |
| `lamp[].cuid` | null | (parent UID) |
| `lamp[].lampColour` | null |  |
| `lamp[].powerMinDimlevel` | null |  |
| `lamp[].lng` | number |  |
| `lamp[].deviceModelName` | string |  |
| `lamp[].alarms` | null |  |
| `lamp[].powerTypeName` | string |  |
| `lamp[].groupName` | null |  |
| `lamp[].signals` | number |  |
| `lamp[].ctype` | number |  |
| `lamp[].colourRenderingIndex` | null |  |
| `lamp[].snr` | null |  |
| `lamp[].colourTemperature` | null |  |
| `lamp[].lcuId` | id32 | LCU |
| `lamp[].daliType` | null |  |
| `lamp[].minPowerVoltage` | null |  |
| `lamp[].maxPowerVoltage` | null |  |
| `lamp[].projectId` | id32 | Project |
| `lamp[].powerProtocol` | number |  |
| `lamp[].kgnum` | number |  |
| `lamp[].lampType` | number |  |
| `lamp[].powerType` | number |  |
| `lamp[].lampPower` | number |  |
| `pole[].poleHeight` | null |  |
| `pole[].lng` | null |  |
| `pole[].poleProduceTime` | null |  |
| `pole[].deviceModelName` | null |  |
| `pole[].supplier` | null |  |
| `pole[].poleColor` | null |  |
| `pole[].deviceCode` | null |  |
| `pole[].deviceName` | null |  |
| `pole[].deviceId` | id32 | Device |
| `pole[].basicMaterial` | null |  |
| `pole[].lat` | null |  |
| `lcu[].createUserId` | id32 | User |
| `lcu[].roadId` | string | Road |
| `lcu[].roadLevelId` | null |  |
| `lcu[].deviceName` | string |  |
| `lcu[].roadName` | null |  |
| `lcu[].upgradeStatus` | null |  |
| `lcu[].lcuType` | null |  |
| `lcu[].rtuId` | null | RTU |
| `lcu[].gisDisplay` | number |  |
| `lcu[].areaName` | null |  |
| `lcu[].superTypeValue` | number |  |
| `lcu[].lg2` | number |  |
| `lcu[].deviceGrade` | number |  |
| `lcu[].lg1` | number |  |
| `lcu[].deviceModelId` | id32 | DeviceModel |
| `lcu[].lg4` | number |  |
| `lcu[].llg1` | null |  |
| `lcu[].lg3` | number |  |
| `lcu[].zoneId` | null |  |
| `lcu[].llg2` | null |  |
| `lcu[].lcuInfoId` | null |  |
| `lcu[].poleId` | id32 | Pole |
| `lcu[].lat` | string |  |
| `lcu[].llg3` | null |  |
| `lcu[].remoteep` | null |  |
| `lcu[].lng` | string |  |
| `lcu[].updateUserId` | null | User |
| `lcu[].bandName` | null |  |
| `lcu[].cls` | string |  |
| `lcu[].version` | null |  |
| `lcu[].platformDeviceId` | null |  |

### `GET /v1.0/solarActor/querySolarDeatilById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `light` | null |  |

### `GET /v1.0/solarActor/statisticsOfSolarByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `solarTotal` | number |  |
| `solarOnlineTotal` | number |  |
| `solarOnlineRate` | number |  |
| `solarOfflineTotal` | number |  |
| `solarUnableTotal` | number |  |
| `solarEnableTotal` | number |  |

### `GET /v1.0/solarLcuActor/querySolarLcuDeatilById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `lng` | string |  |
| `fitstTime` | string |  |
| `deviceModelName` | string |  |
| `deviceName` | string |  |
| `version` | string |  |
| `deviceStatus` | string |  |
| `solarLcuId` | string |  |
| `light` | string |  |
| `solarLcuUid` | string |  |
| `angle` | string |  |
| `poleModelName` | string |  |
| `rtuUid` | string |  |
| `lat` | string |  |

### `GET /v1.0/solarLcuActor/statisticsOfSolarLcuByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `solarLcuEnableTotal` | number |  |
| `solarLcuUnableTotal` | number |  |
| `solarLcuOnlineRate` | number |  |
| `solarLcuOfflineTotal` | number |  |
| `solarLcuOnlineTotal` | number |  |
| `solarLcuTotal` | number |  |

### `POST /v1.0/lampOnOffConfigActor/getList`

| Trường | Kiểu | FK? |
|---|---|---|
| `hourMin` | string |  |
| `action` | number |  |
| `id` | number |  |

### `POST /v1.0/lcuActor/getConfigLcuList`
*Tham số:* projectId, current, size  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].superDeviceName` | string |  |
| `records[].isCheck` | number |  |
| `records[].superDeviceUid` | string |  |
| `records[].ctype` | number |  |
| `records[].luid` | string | (LCU UID) |
| `records[].superTypeValue` | number |  |
| `records[].isSolar` | number |  |
| `records[].deviceModelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].kmId` | id32 | KM |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/lcuActor/getLcuListByProjectId`

| Trường | Kiểu | FK? |
|---|---|---|
| `luid` | string | (LCU UID) |
| `lcuId` | id32 | LCU |
| `lcuName` | string |  |

### `POST /v1.0/lcuActor/getLcuLogPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].upTime` | datetime |  |
| `records[].logData` | string |  |
| `records[].id` | number |  |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/lcuActor/mapLcuPageList`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].leakageVoltage` | null |  |
| `records[].dtime` | null |  |
| `records[].networkStatus` | number |  |
| `records[].num` | number |  |
| `records[].ls` | null |  |
| `records[].freq` | null |  |
| `records[].lastSource` | null |  |
| `records[].dim` | number |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].temps` | null |  |
| `records[].lotime` | null |  |
| `records[].life` | null |  |
| `records[].deviceStatus` | number |  |
| `records[].rtuName` | null |  |
| `records[].uid` | string | (device UID) |
| `records[].lcuType` | null |  |
| `records[].gisDisplay` | number |  |
| `records[].lastAction` | null |  |
| `records[].poleCode` | string | Pole |
| `records[].angle` | null |  |
| `records[].labelName` | null |  |
| `records[].qttime` | null |  |
| `records[].leakageCurrent` | null |  |
| `records[].lat` | number |  |
| `records[].phase` | null |  |
| `records[].rssi` | null |  |
| `records[].lng` | number |  |
| `records[].transmissionPower` | null |  |
| `records[].e` | null |  |
| `records[].upChannel` | null |  |
| `records[].i` | null |  |
| `records[].lcuLightId` | id32 |  |
| `records[].phaseRtuUid` | null |  |
| `records[].labelColor` | null |  |
| `records[].p` | null |  |
| `records[].alarmStatus` | number |  |
| `records[].signals` | number |  |
| `records[].ctype` | number |  |
| `records[].createTime` | datetime |  |
| `records[].poleName` | string |  |
| `records[].u` | null |  |
| `records[].regionId` | null |  |
| `records[].snr` | null |  |
| `records[].pf` | null |  |
| `records[].defaultUid` | null |  |
| `records[].lltime` | null |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/lcuActor/page`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].modelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].lcuId` | id32 | LCU |
| `records[].geographicAddress` | string |  |
| `records[].deviceCode` | string |  |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/lcuActor/queryLcuDataRecords`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].luid` | string | (LCU UID) |
| `records[].dtime` | datetime |  |
| `records[].lcuId` | id32 | LCU |
| `records[].deviceName` | string |  |
| `records[].intervalTime` | null |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/lcuActor/queryLcuOfRtuPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].deviceTypeValue` | number |  |
| `records[].superTypeValue` | number |  |
| `records[].deviceModelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].geographicAddress` | string |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/lcuActor/queryParamById`
*Tham số:* projectId, current, size, lcuId  

| Trường | Kiểu | FK? |
|---|---|---|
| `server` | string |  |
| `staggerNetwork` | null |  |
| `transmissionPower` | null |  |
| `upChannel` | null |  |
| `freq` | null |  |
| `lightDecline` | null |  |
| `linkTime` | null |  |
| `dimMode` | null |  |
| `latLimit` | null |  |
| `disappearedCeiling` | null |  |
| `port` | null |  |
| `reportMinute` | null |  |
| `regionId` | null |  |
| `serverType` | number |  |
| `heartbeatDelay` | null |  |
| `gatewayUpdateCycle` | null |  |
| `lcuId` | id32 | LCU |
| `liveTime` | null |  |
| `lngLimit` | null |  |
| `lightDeclineType` | null |  |
| `dimDirection` | null |  |
| `dimmingEnable` | null |  |

### `POST /v1.0/lcuActor/queryUnrelatedLcuPage`
*Tham số:* projectId, current, size, parentDeviceId  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].deviceTypeValue` | number |  |
| `records[].deviceModelName` | string |  |
| `records[].parentDeviceId` | id32 |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].geographicAddress` | string |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/lcuRoute/queryLcuByRtuId`
*Tham số:* projectId, current, size, rtuId  

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].uid` | string | (device UID) |
| `records[].rtuId` | id32 | RTU |
| `records[].lng` | number |  |
| `records[].deviceModelName` | string |  |
| `records[].deviceModelId` | id32 | DeviceModel |
| `records[].geographicAddress` | string |  |
| `records[].deviceId` | id32 | Device |
| `records[].deviceName` | string |  |
| `records[].lat` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/luxActor/queryLightControl`

| Trường | Kiểu | FK? |
|---|---|---|
| `thiMin` | null |  |
| `luxStatus` | number |  |
| `firMin` | null |  |
| `secDim` | null |  |
| `thiDim` | null |  |
| `fixedTimeEnable` | null |  |
| `sunsetOnHour` | null |  |
| `sunsetOnMinute` | null |  |
| `luxOff` | null |  |
| `dimOff` | null |  |
| `luxEnable` | number |  |
| `latLngStatus` | number |  |
| `firMax` | null |  |
| `sunriseOffHour` | null |  |
| `endMin` | null |  |
| `luxOn` | null |  |
| `latLngEnable` | null |  |
| `secMax` | null |  |
| `startMin` | null |  |
| `endHour` | null |  |
| `firDim` | null |  |
| `thiMax` | null |  |
| `dimOn` | null |  |
| `startHour` | null |  |
| `sunriseOffMinute` | null |  |
| `secMin` | null |  |
| `fouDim` | null |  |

### `POST /v1.0/luxActor/queryMaxLight`

| Trường | Kiểu | FK? |
|---|---|---|
| `offRangeAfter` | null |  |
| `onRangeFront` | number |  |
| `offRangeFront` | number |  |
| `onRangeAfter` | null |  |

### `POST /v1.0/poleActor/queryPoleOfProject`

| Trường | Kiểu | FK? |
|---|---|---|
| `lng` | string |  |
| `remark` | null |  |
| `deviceCode` | string |  |
| `deviceId` | id32 | Device |
| `deviceName` | string |  |
| `poleGenre` | number |  |
| `deviceStatus` | number |  |
| `deviceGrade` | number |  |
| `deviceModelId` | id32 | DeviceModel |
| `deviceSource` | number |  |
| `lcuId` | null | LCU |
| `geographicAddress` | string |  |
| `projectId` | id32 | Project |
| `lat` | string |  |

### `POST /v1.0/projectLampActor/queryProjectLamp`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].createUserId` | id32 | User |
| `records[].dims` | number |  |
| `records[].lampId` | id32 | Lamp |
| `records[].groupId` | null | DeviceGroup |
| `records[].channel` | number |  |
| `records[].lgnum` | number |  |
| `records[].remark` | null |  |
| `records[].lcuModelId` | id32 | DeviceModel |
| `records[].maxchannel` | number |  |
| `records[].luid` | string | (LCU UID) |
| `records[].superTypeValue` | number |  |
| `records[].deviceModelId` | string | DeviceModel |
| `records[].labelName` | null |  |
| `records[].lat` | number |  |
| `records[].taskNum` | number |  |
| `records[].cuid` | string | (parent UID) |
| `records[].lng` | number |  |
| `records[].updateUserId` | id32 | User |
| `records[].updateTime` | datetime |  |
| `records[].lampindex` | number |  |
| `records[].isChoose` | number |  |
| `records[].luxGroupId` | null |  |
| `records[].labelColor` | null |  |
| `records[].kmId` | null | KM |
| `records[].lgchs` | number |  |
| `records[].ctype` | number |  |
| `records[].createTime` | datetime |  |
| `records[].overhaul` | null |  |
| `records[].name` | string |  |
| `records[].lcuId` | id32 | LCU |
| `records[].deviceModel` | id32 | DeviceModel |
| `records[].projectId` | id32 | Project |
| `records[].kgnum` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/scenesLightDevice/queryProjectKmByColumn`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[][].rtuName` | string |  |
| `records[][].cuid` | string | (parent UID) |
| `records[][].list[].rtuName` | … |  |
| `records[][].list[].kch` | … |  |
| `records[][].list[].rtuId` | … | RTU |
| `records[][].list[].cuid` | … | (parent UID) |
| `records[][].list[].deviceTypeValue` | … |  |
| `records[][].list[].kadd` | … |  |
| `records[][].list[].kmName` | … |  |
| `records[][].list[].kmId` | … | KM |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/scenesLightDevice/queryProjectKmByRow`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].rtuName` | string |  |
| `records[].kch` | number |  |
| `records[].rtuId` | id32 | RTU |
| `records[].cuid` | string | (parent UID) |
| `records[].deviceTypeValue` | number |  |
| `records[].kadd` | number |  |
| `records[].kmName` | string |  |
| `records[].kmId` | id32 | KM |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/scenesLightGroup/queryScenesLightTask`

| Trường | Kiểu | FK? |
|---|---|---|
| `executeHour` | number |  |
| `dimValue` | number |  |
| `scenesLightGroupId` | null |  |
| `cycle` | number |  |
| `lux` | number |  |
| `executeType` | number |  |
| `taskType` | number |  |
| `executeMinute` | number |  |
| `executeModel` | number |  |
| `taskName` | string |  |
| `executeEndTime` | number |  |
| `projectId` | id32 | Project |
| `operation` | number |  |
| `taskId` | id32 | Task |
| `executeStartTime` | number |  |
| `loopTime` | string |  |

### `POST /v1.0/sunriseAndSunset/page`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].startSummerStamp` | null |  |
| `records[].cityName` | string |  |
| `records[].endSummerTime` | null |  |
| `records[].endSummerStamp` | null |  |
| `records[].offdelay` | number |  |
| `records[].startSummerTime` | null |  |
| `records[].ondelay` | number |  |
| `records[].summerTimeOffset` | number |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/sunriseAndSunset/queryPrimevalSunriseSunset`

| Trường | Kiểu | FK? |
|---|---|---|
| `sunriseMin` | number |  |
| `month` | number |  |
| `sunsetHour` | number |  |
| `sunsetMin` | number |  |
| `day` | number |  |
| `sunriseHour` | number |  |
