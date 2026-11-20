# SLCP — Bản đồ Màn hình → API

Khi mở mỗi màn hình, frontend gọi các API sau (ghi nhận thực tế khi duyệt).


## `#/NsServiceConfiguration`
- `POST /v1.0/lierdaProjectActor/getNsProjectList`

## `#/actility`
- `POST /v1.0/actilityProjectActor/getActilityProject`
- `POST /v1.0/actilityProjectActor/getGatewayList`

## `#/alarmHistorys`
- `GET /v1.0/dictionary/queryDictionaryByKey/149`
- `GET /v1.0/dictionary/queryDictionaryByKey/34`
- `POST /v1.0/alarmType/queryAlarmTypesOfDevice`
- `POST /v1.0/config/getAlarmHisPage`

## `#/alarmRealTime`
- `POST /v1.0/config/getAlarmPage`

## `#/alarmStatistic/index`
- `POST /v1.0/alarmStatistics/alarmStatistics`
- `POST /v1.0/alarmStatistics/alarmTypeStatistics`

## `#/assets/administrativeMaintenanceManagement/index`
- `GET /v1.0/area/queryProjectByProjectId/{id}`
- `GET /v1.0/city/queryByProvinceId/{id}`
- `GET /v1.0/country/queryCountry`
- `GET /v1.0/province/queryByProvinceId/{id}`
- `POST /v1.0/area/queryAreaPage`

## `#/assets/mapView`
- `POST /v1.0/device/countDeviceTotal`
- `POST /v1.0/deviceModel/queryDeviceModelByDeviceTypeAndProject`

## `#/billStatistics/index`
- `POST /v1.0/electricityBill/getOverview`
- `POST /v1.0/meterActor/getConfigMeterList`

## `#/cableTest/index`
- `POST /v1.0/cableInspectionDataHisActor/pageCableInspection`

## `#/commissioning/index`
- `GET /v1.0/cameraActor/statisticsOfCameraByProjectId/{id}`
- `GET /v1.0/dtuActor/statisticsOfDtuByProjectId/{id}`
- `GET /v1.0/lcuActor/statisticsOfLcuByProjectId/{id}`
- `GET /v1.0/lcuActor/statisticsOfLcuIntervalTimeByProjectId/{id}`
- `GET /v1.0/lcuActor/statisticsOfNonDirectLcuByProjectId/{id}`
- `GET /v1.0/luxActor/statisticsOfLuxByProjectId/{id}`
- `GET /v1.0/rtuActor/statisticsOfRtuByProjectId/{id}`
- `GET /v1.0/smartBoxActor/statisticsOfSmartBoxByProjectId/{id}`
- `GET /v1.0/solarActor/statisticsOfSolarByProjectId/{id}`
- `GET /v1.0/solarLcuActor/statisticsOfSolarLcuByProjectId/{id}`
- `GET /v1.0/wcuActor/statisticsOfWcuByProjectId/{id}`
- `POST /v1.0/config/alarmCount`
- `POST /v1.0/device/getLampModelByLatLng_v1`
- `POST /v1.0/luxGroupActor/page`

## `#/commissioning/rtu`
- `POST /v1.0/device/queryDeviceOverviewPage`

## `#/custody/assets/custodyConfiguration/index`
- `POST /v1.0/curyCompany/queryCuryCompanyPage`

## `#/datatransferManagement/index`
- `POST /v1.0/syslog/queryPage`

## `#/equipment/terminal`
- `GET /v1.0/deviceImportOrExport/getImportStatus`
- `GET /v1.0/deviceTypeController/queryDeviceTypesWithUidOfProject/{id}`
- `GET /v1.0/dictionary/queryDictionaryByKey/70`
- `POST /v1.0/device/queryDevicePage`
- `POST /v1.0/overseas/queryRoadLevel`

## `#/equipmentCorrelation`
- `GET /v1.0/ProjectStationActor/queryStationOfRootDirectoryByProjectId/{id}`
- `POST /v1.0/rtuActor/pageList`

## `#/equipments/equipmentModel`
- `GET /api/getSinglePageMenu/{id}/1`
- `GET /v1.0/dictionary/queryDictionaryByKey/116`
- `GET /v1.0/dictionary/queryDictionaryByKey/119`
- `GET /v1.0/dictionary/queryDictionaryByKey/15`
- `GET /v1.0/dictionary/queryDictionaryByKey/17`
- `GET /v1.0/dictionary/queryDictionaryByKey/19`
- `GET /v1.0/dictionary/queryDictionaryByKey/20`
- `GET /v1.0/dictionary/queryDictionaryByKey/21`
- `GET /v1.0/dictionary/queryDictionaryByKey/3`
- `GET /v1.0/dictionary/queryDictionaryByKey/55`
- `GET /v1.0/dictionary/queryDictionaryByKey/99`
- `GET /v1.0/protocolActor/queryList`
- `POST /v1.0/deviceModel/getDeviceModelPage`
- `POST /v1.0/deviceTypeController/queryProtocolByDeviceId`
- `POST /v1.0/lierdaProjectActor/getBandNameList`
- `POST /v1.0/poleType/getAllPoleTypeOfProjectList`

## `#/facility/assets/facilityPlan/index`
- `GET /v1.0/area/queryAreaByCityId/{id}/{id}`
- `GET /v1.0/dictionary/queryDictionaryByKey/43`
- `POST /v1.0/equipment/queryEquipmentPage`

## `#/gis/securityMonitoring`
- `POST /v1.0/aibox/getAIboxEventList`
- `POST /v1.0/aibox/getAIboxList`

## `#/lcuRunningAnalysis/index`
- `POST /v1.0/deviceModel/getDeviceModelByDeviceTypeId`
- `POST /v1.0/lcuLight/queryLcuDataReportRateDetailsPage`

## `#/mediaManagement/textLib`
- `POST /v1.0/informatrion/queryInformationMap`

## `#/mediaManagement/videoLib`
- `POST /v1.0/sysFile/queryFileById`

## `#/parameter/v_assets/parameterMangement/terminal`
- `GET /v1.0/curyCompany/queryCuryCompanyList`
- `GET /v1.0/dictionary/queryDictionaryByKey/26`
- `POST /v1.0/assetLedger/queryLedgerDevicePage`

## `#/passengerFlow`
- `POST /v1.0/passengerFlowGroup/queryPassengerFlowGroupListPage`

## `#/photoEntry`
- `POST /api/graphicRules/getPage`
- `POST /v1.0/deviceTypeController/queryDeviceTypesByProjectId`

## `#/policyManage/index`
- `GET /v1.0/dictionary/queryDictionaryByKey/10`
- `GET /v1.0/dictionary/queryDictionaryByKey/5`
- `GET /v1.0/dictionary/queryDictionaryByKey/6`
- `GET /v1.0/progress/queryList/{id}`
- `POST /v1.0/deviceGroup/deviceGroupPage`
- `POST /v1.0/deviceGroup/queryStationLamp`
- `POST /v1.0/task/getTaskByGroup`

## `#/policyManage/taskIssue/rtu`
- `GET /v1.0/dictionary/queryDictionaryByKey/135`
- `POST /v1.0/deviceGroup/queryDeviceGroupList`
- `POST /v1.0/deviceGroup/queryDeviceTaskPage`
- `POST /v1.0/deviceTypeController/getOverViewDeviceTypes`

## `#/policyManage/taskManage`
- `POST /v1.0/deviceTypeController/queryAllDeviceType`
- `POST /v1.0/task/page`

## `#/productionCenter/exceptionManagement`
- `GET /v1.0/dictionary/queryWorkFlowState/1`
- `POST /v1.0/inspectionPlan/queryPage`

## `#/productionCenter/maintenanceEvaluation`
- `POST /v1.0/overseas/getStreetLightOnRate`
- `POST /v1.0/overseas/getStreetWoOverhaulRate`

## `#/productionCenter/maintenanceLogs/index`
- `POST /v1.0/devOps/getDevOpsList`
- `POST /v1.0/devOpsBasicData/getDevOpsBasicDataList`

## `#/productionCenter/materialManagement`
- `GET /v1.0/MaterialCategoryName/queryMaterialCategoryList`
- `GET /v1.0/MaterialModel/queryMaterialModelList`
- `GET /v1.0/MaterialName/queryMaterialNameList`
- `GET /v1.0/MaterialWarehouse/queryMaterialWarehouseList`
- `POST /v1.0/MaterialInventory/queryMaterialInventoryPage`

## `#/reportRecord/index`
- `POST /v1.0/reportManage/queryReportsPage`

## `#/statisticAnalysis/index`
- `POST /v1.0/energy/getOverview`

## `#/strategicGrouping`
- `GET /v1.0/dictionary/queryDictionaryByKey/148`
- `GET /v1.0/lcuTaskImport/getImportStatus`
- `POST /v1.0/task/queryTaskGroupList`

## `#/workorderStatistics/index`
- `POST /v1.0/abnormalRecord/queryAbnormalRecordPage` — ⚠️ trả **500 Internal Server Error** khi mở Alarms → Event Management (quan sát 2026-11-19, nguồn `SmartLightingPlatform_TLTK/00`); lỗi phía server Fonda
- `POST /v1.0/workOrderStatistics/getStatisticsMap`
- `POST /v1.0/workOrderStatistics/getTodayWorkOrderData`
- `POST /v1.0/workOrderStatistics/getWorkOrderSourceMap`
- `POST /v1.0/workOrderStatistics/getWorkOrderStateMap`
- `POST /v1.0/workOrderStatistics/getYesterdayMonthYearOrders`

## `#/workorderSystem/delayManagement`
- `GET /v1.0/dictionary/queryDictionaryByKey/44`
- `GET /v1.0/dictionary/queryDictionaryByKey/45`
- `GET /v1.0/dictionary/queryDictionaryByKey/46`
- `POST /v1.0/delayOrder/queryPage`

## `#/workorderSystem/workorderManagement`
- `POST /v1.0/abnormalWorkOrder/querySpainPage`

## `#/workorderSystem/workorderOverview`
- `POST /v1.0/abnormalWorkOrderOverview/circulation`
- `POST /v1.0/abnormalWorkOrderOverview/tmOverview`
