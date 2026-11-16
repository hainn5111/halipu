# SLCP — Thực thể & trường dữ liệu (dò API trực tiếp)

Dựng từ **659 endpoint đọc gọi thành công** trong buổi dò 2026-11-14 (gọi trực tiếp hàm API của frontend với `projectId` và ID lấy từ dữ liệu dự án). Trước đây chỉ 118; lần này phủ gần hết các thực thể, kể cả nhiều thực thể lần trước trả rỗng.

> Bộ 03 gồm 5 phần: `03-entities.md`, `03b-entities.md`, `03c-entities.md`, `03d-entities.md`, `03e-entities.md`

Kiểu: `id32` = hex 32; `datetime` = `YYYY-MM-DD HH:MM:SS`; `date`; còn lại number/string/boolean. Trường rỗng trong dữ liệu mẫu hiện là `null` (chưa suy được kiểu). Cột **FK?** suy theo tên. **Chỉ giữ tên trường + kiểu, không có giá trị thật.** Mức tin cậy: field = Chắc chắn (JSON thật), nghĩa = Suy luận.


# Lõi: dự án, địa lý, hệ thống


### `GET /v1.0/area/queryProjectByProjectId/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `projectId` | id32 | Project |
| `parentId` | string |  |
| `countryId` | id32 | Country |
| `provinceId` | id32 | Province |
| `cityId` | id32 | City |
| `name` | string |  |
| `remark` | string |  |
| `enabled` | string |  |
| `lat` | string |  |
| `lng` | string |  |
| `offSetLat` | string |  |
| `offSetLng` | string |  |
| `timeZone` | string |  |
| `onDeLay` | number |  |
| `offDeLay` | number |  |
| `upTime` | number |  |
| `maxDims` | number |  |
| `maxLampIndex` | number |  |
| `winterTimeStart` | null |  |
| `winterTimeEnd` | null |  |
| `winterTimeOffset` | null |  |
| `summerTimeStart` | null |  |
| `summerTimeEnd` | null |  |
| `summerTimeOffset` | number |  |
| `timingHour` | null |  |
| `detailAddress` | string |  |
| `domesticAccount` | null |  |
| `domesticPassword` | null |  |
| `domesticLink` | null |  |
| `foreignAccount` | null |  |
| `foreignPassword` | null |  |
| `foreignLink` | null |  |
| `sendMethod` | null |  |
| `smsUrl` | null |  |
| `smsPort` | null |  |
| `smsUid` | null |  |
| `c_lat` | null |  |
| `c_lng` | null |  |
| `platform` | null |  |
| `title` | null |  |
| `foreignTitle` | null |  |
| `transRate` | number |  |
| `lightCtrlMode` | number |  |
| `verifyEnabled` | number |  |
| `onlineRateLower` | number |  |
| `onlineRateTop` | number |  |
| `powerOffMode` | number |  |
| `importEnabled` | number |  |
| `taskMode` | number |  |
| `lcuDimMin` | number |  |
| `lcuDimMax` | number |  |
| `automaticEnd` | number |  |
| `hisDataConfig` | null |  |
| `controlSet` | number |  |
| `verifyType` | null |  |
| `personConfig` | null |  |
| `weekTaskEnabled` | number |  |
| `aiboxLinkageConfig` | number |  |
| `reportMinute` | null |  |
| `ptype` | string |  |

### `GET /v1.0/city/queryAllCity`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `cityId` | id32 | City |
| `countryId` | id32 | Country |
| `provinceId` | id32 | Province |
| `language` | string |  |
| `lat` | null |  |
| `lng` | null |  |
| `name` | string |  |
| `timeZone` | null |  |
| `remark` | null |  |
| `boundary` | null |  |
| `clat` | null |  |
| `clng` | null |  |

### `GET /v1.0/country/queryById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `countryId` | id32 | Country |
| `name` | string |  |
| `language` | string |  |

### `GET /v1.0/country/queryCountry`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `countryId` | id32 | Country |
| `name` | string |  |
| `language` | string |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/13`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/15`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/17`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/18`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/19`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/20`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/21`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/25`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/26`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/27`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/3`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/33`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/35`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/48`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/52`

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/{149}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/dictionary/queryDictionaryByKey/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `dictValue` | number |  |
| `dsName` | string |  |
| `dictStairRemark` | string |  |
| `dictName` | string |  |
| `dictStairId` | id32 | DictionaryGroup |
| `dictId` | id32 | Dictionary |
| `dictType` | number |  |

### `GET /v1.0/project/getCityOfProject/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `cityName` | string |  |
| `endSummerTime` | null |  |
| `offdelay` | number |  |
| `startSummerTime` | null |  |
| `ondelay` | number |  |
| `summerTimeOffset` | number |  |

### `GET /v1.0/project/getLcuAutoCtrlByProjectId/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `powerOffMode` | number |  |

### `GET /v1.0/project/queryLastProject`

| Trường | Kiểu | FK? |
|---|---|---|
| `lightCtrlMode` | number |  |
| `cityName` | string |  |
| `createTime` | datetime |  |
| `detailAddress` | string |  |
| `timeZone` | string |  |
| `countryName` | string |  |
| `provinceName` | string |  |
| `projectName` | string |  |
| `userName` | string |  |
| `projectId` | id32 | Project |
| `parentId` | string |  |
| `enabled` | string |  |

### `GET /v1.0/project/queryProjectControlSet/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `controlSet` | number |  |
| `projectId` | id32 | Project |
| `verifyType` | null |  |
| `personConfig` | null |  |

### `GET /v1.0/project/queryProjectInfoById/{e}`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | null |  |
| `createUserId` | null | User |
| `createTime` | null |  |
| `updateUserId` | null | User |
| `updateTime` | null |  |
| `projectId` | id32 | Project |
| `parentId` | null |  |
| `countryId` | null | Country |
| `provinceId` | null | Province |
| `cityId` | null | City |
| `name` | string |  |
| `remark` | null |  |
| `enabled` | null |  |
| `lat` | null |  |
| `lng` | null |  |
| `offSetLat` | null |  |
| `offSetLng` | null |  |
| `timeZone` | string |  |
| `onDeLay` | null |  |
| `offDeLay` | null |  |
| `upTime` | null |  |
| `maxDims` | null |  |
| `maxLampIndex` | null |  |
| `winterTimeStart` | null |  |
| `winterTimeEnd` | null |  |
| `winterTimeOffset` | null |  |
| `summerTimeStart` | null |  |
| `summerTimeEnd` | null |  |
| `summerTimeOffset` | number |  |
| `timingHour` | null |  |
| `detailAddress` | null |  |
| `domesticAccount` | null |  |
| `domesticPassword` | null |  |
| `domesticLink` | null |  |
| `foreignAccount` | null |  |
| `foreignPassword` | null |  |
| `foreignLink` | null |  |
| `sendMethod` | null |  |
| `smsUrl` | null |  |
| `smsPort` | null |  |
| `smsUid` | null |  |
| `c_lat` | null |  |
| `c_lng` | null |  |
| `platform` | null |  |
| `title` | null |  |
| `foreignTitle` | null |  |
| `transRate` | null |  |
| `lightCtrlMode` | null |  |
| `verifyEnabled` | number |  |
| `onlineRateLower` | null |  |
| `onlineRateTop` | null |  |
| `powerOffMode` | null |  |
| `importEnabled` | null |  |
| `taskMode` | number |  |
| `lcuDimMin` | number |  |
| `lcuDimMax` | number |  |
| `automaticEnd` | number |  |
| `hisDataConfig` | null |  |
| `controlSet` | null |  |
| `verifyType` | null |  |
| `personConfig` | null |  |
| `weekTaskEnabled` | null |  |
| `aiboxLinkageConfig` | number |  |
| `reportMinute` | null |  |
| `ptype` | null |  |

### `GET /v1.0/province/queryAllProvince`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `provinceId` | id32 | Province |
| `countryId` | id32 | Country |
| `name` | string |  |
| `language` | string |  |

### `POST /v1.0/city/queryCityByPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].createUserId` | id32 | User |
| `records[].lng` | string |  |
| `records[].createTime` | datetime |  |
| `records[].name` | string |  |
| `records[].timeZone` | string |  |
| `records[].language` | string |  |
| `records[].updateTime` | datetime |  |
| `records[].remark` | null |  |
| `records[].cityId` | id32 | City |
| `records[].provinceId` | id32 | Province |
| `records[].countryId` | id32 | Country |
| `records[].lat` | string |  |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

### `POST /v1.0/project/queryTree`

| Trường | Kiểu | FK? |
|---|---|---|
| `winterTimeStartLong` | null |  |
| `taskMode` | number |  |
| `lightCtrlMode` | number |  |
| `winterTimeOffset` | null |  |
| `lcuDimMax` | number |  |
| `cityId` | id32 | City |
| `importEnabled` | number |  |
| `countryId` | id32 | Country |
| `enabled` | string |  |
| `winterTimeEndLong` | null |  |
| `isAuth` | number |  |
| `summerTimeEndLong` | null |  |
| `lcuDimMin` | number |  |
| `weekTaskEnabled` | number |  |
| `aiboxLinkageConfig` | number |  |
| `lat` | string |  |
| `lng` | string |  |
| `timeZone` | string |  |
| `isChoose` | number |  |
| `provinceId` | id32 | Province |
| `parentId` | string |  |
| `summerTimeStartLong` | null |  |
| `reportMinute` | null |  |
| `name` | string |  |
| `controlSet` | number |  |
| `projectId` | id32 | Project |
| `summerTimeOffset` | number |  |
| `verifyType` | null |  |
| `icon` | number |  |

### `POST /v1.0/province/queryByPage`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].createUserId` | id32 | User |
| `records[].createTime` | datetime |  |
| `records[].name` | string |  |
| `records[].language` | string |  |
| `records[].updateTime` | datetime |  |
| `records[].provinceId` | id32 | Province |
| `records[].countryId` | id32 | Country |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |

# Tổ chức, người dùng, quyền


### `GET /v1.0/agency/queryById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | id32 | User |
| `updateTime` | datetime |  |
| `agencyId` | id32 | Agency |
| `parentId` | id32 |  |
| `agencyName` | string |  |
| `address` | string |  |
| `linkman` | string |  |
| `mobileAreaCode` | string |  |
| `mapConfig` | null |  |
| `phone` | string |  |
| `remark` | string |  |
| `proToolUserId` | null |  |
| `displaySettings` | number |  |
| `validateLogon` | number |  |
| `validateLogonType` | number |  |
| `domesticAccount` | null |  |
| `domesticPassword` | null |  |
| `domesticLink` | null |  |
| `foreignAccount` | null |  |
| `foreignPassword` | null |  |
| `foreignLink` | null |  |
| `sendMethod` | null |  |
| `smsUrl` | null |  |
| `smsPort` | null |  |
| `smsUid` | null |  |
| `platform` | null |  |
| `title` | null |  |
| `foreignTitle` | null |  |
| `parentAgencyName` | string |  |

### `GET /v1.0/agency/queryByParentId/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `agencyId` | id32 | Agency |
| `agencyName` | string |  |

### `GET /v1.0/agency/queryList`

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | id32 | User |
| `updateTime` | datetime |  |
| `agencyId` | id32 | Agency |
| `parentId` | id32 |  |
| `agencyName` | string |  |
| `address` | string |  |
| `linkman` | string |  |
| `mobileAreaCode` | string |  |
| `mapConfig` | null |  |
| `phone` | string |  |
| `remark` | string |  |
| `proToolUserId` | null |  |
| `displaySettings` | number |  |
| `validateLogon` | number |  |
| `validateLogonType` | number |  |
| `domesticAccount` | null |  |
| `domesticPassword` | null |  |
| `domesticLink` | null |  |
| `foreignAccount` | null |  |
| `foreignPassword` | null |  |
| `foreignLink` | null |  |
| `sendMethod` | null |  |
| `smsUrl` | null |  |
| `smsPort` | null |  |
| `smsUid` | null |  |
| `platform` | null |  |
| `title` | null |  |
| `foreignTitle` | null |  |

### `GET /v1.0/agency/queryTree`

| Trường | Kiểu | FK? |
|---|---|---|
| `agencyId` | id32 | Agency |
| `parentId` | string |  |
| `agencyName` | string |  |
| `icon` | number |  |

### `GET /v1.0/langActor/queryLangListByAgencyId/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `languageId` | id32 |  |
| `langName` | string |  |
| `langLogo` | string |  |

### `GET /v1.0/langActor/queryList`

| Trường | Kiểu | FK? |
|---|---|---|
| `languageId` | id32 |  |
| `langName` | string |  |
| `langLogo` | string |  |

### `GET /v1.0/massage/getMessageConfigurationOfProject/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `status` | number |  |
| `createUserId` | id32 | User |
| `createTime` | datetime |  |
| `updateUserId` | null | User |
| `updateTime` | datetime |  |
| `projectId` | id32 | Project |
| `parentId` | string |  |
| `countryId` | id32 | Country |
| `provinceId` | id32 | Province |
| `cityId` | id32 | City |
| `name` | string |  |
| `remark` | string |  |
| `enabled` | string |  |
| `lat` | string |  |
| `lng` | string |  |
| `offSetLat` | string |  |
| `offSetLng` | string |  |
| `timeZone` | string |  |
| `onDeLay` | number |  |
| `offDeLay` | number |  |
| `upTime` | number |  |
| `maxDims` | number |  |
| `maxLampIndex` | number |  |
| `winterTimeStart` | null |  |
| `winterTimeEnd` | null |  |
| `winterTimeOffset` | null |  |
| `summerTimeStart` | null |  |
| `summerTimeEnd` | null |  |
| `summerTimeOffset` | number |  |
| `timingHour` | null |  |
| `detailAddress` | string |  |
| `domesticAccount` | null |  |
| `domesticPassword` | null |  |
| `domesticLink` | null |  |
| `foreignAccount` | null |  |
| `foreignPassword` | null |  |
| `foreignLink` | null |  |
| `sendMethod` | null |  |
| `smsUrl` | null |  |
| `smsPort` | null |  |
| `smsUid` | null |  |
| `c_lat` | null |  |
| `c_lng` | null |  |
| `platform` | null |  |
| `title` | null |  |
| `foreignTitle` | null |  |
| `transRate` | number |  |
| `lightCtrlMode` | number |  |
| `verifyEnabled` | number |  |
| `onlineRateLower` | number |  |
| `onlineRateTop` | number |  |
| `powerOffMode` | number |  |
| `importEnabled` | number |  |
| `taskMode` | number |  |
| `lcuDimMin` | number |  |
| `lcuDimMax` | number |  |
| `automaticEnd` | number |  |
| `hisDataConfig` | null |  |
| `controlSet` | number |  |
| `verifyType` | null |  |
| `personConfig` | null |  |
| `weekTaskEnabled` | number |  |
| `aiboxLinkageConfig` | number |  |
| `reportMinute` | null |  |
| `ptype` | string |  |

### `GET /v1.0/systemInfo/getSystemInfo`

| Trường | Kiểu | FK? |
|---|---|---|
| `loransPort` | string |  |
| `telecomUrl` | string |  |
| `serverVersion` | string |  |
| `loraCallback` | string |  |
| `aepUrl` | string |  |
| `telePhone` | string |  |
| `mobileEnable` | string |  |
| `lcuGprsPort` | string |  |
| `aepEnable` | string |  |
| `mobileCallback` | string |  |
| `aepCallback` | string |  |
| `oneKeyport` | string |  |
| `unicomEnable` | string |  |
| `mobileUrl` | string |  |
| `rtuPort` | string |  |
| `lcuLtePort` | string |  |
| `email` | string |  |
| `tailongScreenPort` | string |  |
| `loraUrl` | string |  |
| `lcu2gPort` | string |  |
| `smartBoxPort` | string |  |
| `unicomUrl` | string |  |
| `userName` | string |  |
| `anti2gPort` | string |  |
| `telecomCallback` | string |  |
| `loraEnable` | string |  |
| `userAccount` | string |  |
| `solar2gPort` | string |  |
| `telecomEnable` | string |  |
| `unicomCallback` | string |  |

### `GET /v1.0/systemInfo/querySystemInfo`

| Trường | Kiểu | FK? |
|---|---|---|
| `systemInfoName` | string |  |
| `systemInfoId` | string |  |
| `logoUrl` | null |  |

### `GET /v1.0/user/queryById/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `userSuper` | boolean |  |
| `mail` | string |  |
| `accountType` | number |  |
| `telephone` | string |  |
| `remark` | string |  |
| `userName` | string |  |
| `userId` | id32 | User |
| `enabled` | number |  |
| `agencyName` | string |  |
| `mobileAreaCode` | string |  |
| `pwdGenerateMethod` | number |  |
| `profilePhoto` | null |  |
| `validEndTime` | null |  |
| `validBeginTime` | null |  |
| `userAccount` | string |  |
| `operatorUserGroup` | number |  |
| `job` | null |  |
| `userGroup` | string |  |

### `GET /v1.0/user/queryListByAgencyId/{e}`
*Tham số:* path param  

| Trường | Kiểu | FK? |
|---|---|---|
| `userName` | string |  |
| `userId` | id32 | User |

### `GET /v1.0/user/querySuperUserCount`

| Trường | Kiểu | FK? |
|---|---|---|
| `count` | number |  |

### `POST /v1.0/scanCode/getCustomList`

| Trường | Kiểu | FK? |
|---|---|---|
| `userAccount` | string |  |
| `userName` | string |  |
| `userId` | id32 | User |

### `POST /v1.0/scanCode/getProjectList`

| Trường | Kiểu | FK? |
|---|---|---|
| `jsonData.jsonData[].protocolId` | string | Protocol |
| `jsonData.jsonData[].port` | string |  |
| `jsonData.jsonData[].ip` | string |  |
| `jsonData.jsonData[].num` | number |  |
| `jsonData.jsonData[].checked` | boolean |  |
| `name` | string |  |
| `projectId` | id32 | Project |
| `userId` | string | User |

### `POST /v1.0/user/queryUserOfAgency`

| Trường | Kiểu | FK? |
|---|---|---|
| `records[].mail` | string |  |
| `records[].selection` | number |  |
| `records[].userAccount` | string |  |
| `records[].telephone` | string |  |
| `records[].userName` | string |  |
| `records[].userId` | id32 | User |
| `total` | number |  |
| `size` | number |  |
| `current` | number |  |
| `pages` | number |  |
