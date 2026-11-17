# SLCP — API Methods (đầy đủ) — phần 2 (controller m–z)

Tiếp theo của `04b-api-methods.md`. Mô tả & lớp R/W/C ở `04-api-catalog.md`.

**`managementRecord`**
- GET: `getManagementRecordById/{param}`
- POST: `delete`, `exportManagementRecord`, `exportManagementRecordStatistics`, `page`, `pageManagementRecordStatistics`, `save`, `update`

**`massage`**
- GET: `getMessageConfigurationOfProject/{param}`
- POST: `configureMassageOfProject`, `deleteSysMessage`, `getMassageByHandlerId`, `getSysMessageList`, `saveMassage`

**`MaterialCategoryName`**
- GET: `queryMaterialCategoryList`, `queryMaterialCategoryNameById/{param}`
- POST: `deleteMaterialCategoryBatch`, `queryMaterialCategoryInventoryList`, `queryMaterialCategoryPage`, `saveMaterialCategoryName`, `updateMaterialCategoryName`

**`materialEntry`**
- GET: `cancelMaterialEntry/{param}`, `exportMaterialEntryDoc/{param}`, `queryMaterialEntryDetailById/{param}`
- POST: `deleteMaterialEntryDetailById`, `queryMaterialEntryPage`, `queryMaterialEntryPageAll`, `reviewMaterialEntry`, `saveMaterialEntry`

**`MaterialInventory`**
- GET: `queryCustomMaterialInventory/{param}`, `queryMaterialInventoryById/{param}`, `queryWareHouseByMaterialModelId/{param}`
- POST: `deleteMaterialInventoryBatch`, `exportMaterialInventoryPage`, `queryMaterialInventoryPage`, `saveMaterialInventory`, `updateMaterialInventory`

**`MaterialModel`**
- GET: `queryMaterialModelById/{param}`, `queryMaterialModelList`, `queryMaterialModelsByMaterialNameId/{param}`
- POST: `deleteMaterialModelBatch`, `queryMaterialModelInventoryList`, `queryMaterialModelPage`, `saveMaterialModel`, `updateMaterialModel`

**`MaterialName`**
- GET: `queryMaterialNameById/{param}`, `queryMaterialNameList`, `queryMaterialNameListByCategoryId/{param}`
- POST: `deleteMaterialNameBatch`, `queryMaterialNameInventoryList`, `queryMaterialNamePage`, `saveMaterialCategoryName`, `updateMaterialName`

**`materialRequest`**
- GET: `cancelMaterialRequest/{param}`, `exportMaterialRequestDoc/{param}`, `queryMaterialRequestById/{param}`
- POST: `deleteMaterialRequestById`, `queryMaterialRequestPage`, `queryMaterialRequestPageAll`, `reviewMaterialRequest`, `saveMaterialRequest`

**`materialUse`**
- GET: `cancelMaterialUse/{param}`, `exportMaterialUseDoc/{param}`, `queryMaterialUseById/{param}`, `queryMaterialUseDetailById/{param}`, `queryMaterialUseDetailByOrderId/{param}`
- POST: `deleteMaterialUseById`, `exportMaterialUse`, `exportMaterialUseAll`, `queryMaterialUseDetail`, `queryMaterialUsePage`, `queryMaterialUsePageAll`, `queryMaterialUsesByOrderId`, `reviewMaterialUse`, `saveMaterialUse`

**`MaterialWarehouse`**
- GET: `queryMaterialWarehouseById/{param}`, `queryMaterialWarehouseDetailById/{param}`, `queryMaterialWarehouseInventoryList`, `queryMaterialWarehouseList`
- POST: `deleteMaterialWarehouseBatch`, `queryMaterialWarehousePage`, `saveMaterialWarehouse`, `updateMaterialWarehouse`

**`menu`**
- GET: `getMenuListByUserId/{param}`, `initialize`, `queryById/{param}`, `queryMenuListByAgencyId/{param}`, `queryMenuListByRoleId/{param}`, `queryMenuTree/{param}`, `queryTree`, `queryTreeExcludeSystem/{param}`, `resetMenu/{param}`
- POST: `bindAuthority`, `editMenu`, `queryMenuByUserId`, `queryPage`, `save`
- PUT: `update`
- DELETE: `delete/{param}`

**`menuExport`**
- POST: `exportMenu`, `exportMenuList`

**`messageActor`**
- GET: `getMessageById/{param}`
- POST: `delete`, `getMessagesByUser`, `queryMessagesPage`, `review`, `save`, `update`, `updateMessageUserStatus`

**`messageType`**
- GET: `getMessageTypeById/{param}`
- POST: `delete`, `getAllMessageTypes`, `queryMessageTypesPage`, `save`, `update`

**`meterActor`**
- GET: `getMeterById/{param}`, `queryByMeterId/{param}`, `queryMeterDataByRtuId/{param}`, `queryMeterDataOfRtu/{param}`, `queryMeterTypeOfRtu/{param}`, `queryMeterTypeOfStation/{param}`, `queryUserMeterDataOfStation/{param}`, `queryUserMeterListByRtuId/{param}`
- POST: `configMeter`, `deleteNew`, `getConfigMeterList`, `getMeterQueryPage`, `getOuterAndInnerMeterByProject`, `getOuterAndInnerMeterPhaseByNewPages`, `getOuterAndInnerMeterPhaseByRtus`, `getRtuByProjectId`, `pageList`, `queryOuterAndInnerMeterByRtus`, `queryUserMeterOfRtuPage`, `saveNew`, `setMeterListReference`, `setMeterReference`, `setParam`, `updateNew`, `updateRtuId`
- PUT: `associateUserMeterWithRtu`, `dissociateUserMeterFromRtu`

**`meterControl`**
- GET: `queryLeakageProtection/{param}`, `queryRemoteMeterAdder/{param}`, `queryRtu150UserMeterAdder/{param}`, `queryRtu190UserMeterAdder/{param}`
- POST: `queryDeployUserMeter`, `queryElectricalParam`, `queryRealTimeElectricalData`, `queryRealTimeMeterData`, `setDeployUserMeter`, `setElectricalParam`, `setLeakageProtection`

**`meterReading`**
- POST: `queryConfigPage`, `queryElectricityBillDetails`, `queryElectricityBillPage`, `saveElectricityBillConfig`
- DELETE: `delete/{param}`

**`municipal`**
- GET: `queryMunicipalDeviceById/{param}`
- POST: `getDeviceByLatLng`, `municipalSave`, `municipalUpdate`, `queryMunicipalDeviceOnMap`, `queryMunicipalDevicePage`
- DELETE: `deleteMunicipalDevice`

**`networkAudioCtrl`**
- POST: `getPlayList`, `getPlayStatus`, `playClear`, `playCtrl`, `setPlayArgs`, `setPlayList`, `setVolume`

**`nonIotDevice`**
- GET: `queryNonIotDeviceInOtherDeviceDirectoryOfProject/{param}`
- POST: `acContactorBoundKm`, `delete`, `nonIotDeviceBoundAI`, `nonIotDeviceBoundAIOrDI`, `nonIotDeviceBoundDI`, `nonIotDeviceBoundMeter`, `queryAcContactorOfStationInSupplyElectricity`, `queryDeviceAndRelated`, `queryDeviceDetailsInLedgerManagement`, `queryNonIotDeviceOnMap`, `queryRelatedNonIotDeviceOfDirectory`, `queryRelatedNonIotDeviceOfStation`, `queryRelatedNonIotDevicePage`, `querySubordinateDeviceDetailsInLedgerManagement`, `querySuperiorDeviceDetailsInLedgerManagement`, `queryUnrelatedNonIotDevicePage`, `save`, `supplyInformationInLedgerManagement`, `transferSwitchBoundAcContactor`, `update`, `updateNodeLocation`

**`oilCard`**
- GET: `queryOilCardByOilCardId/{param}`
- POST: `delete`, `queryOilCardsPage`, `save`, `update`

**`oilChargeRecord`**
- GET: `setOilChargeStatus/{param}`
- POST: `queryOilChargeRecordsPage`, `save`

**`oilConsumeRecord`**
- POST: `countOilConsumeRecordsByAgency`, `countOilConsumeRecordsByTime`, `queryOilConsumeRecordsPage`, `save`

**`operationAbnormal`**
- GET: `queryAbnormalTypeById/{param}`, `queryOperationAbnormalById/{param}`
- POST: `deleteOperationAbnormalBatch`, `deleteSecondTypeBatch`, `deletefirstTypeBatch`, `exportOperationAbnormal`, `exportOperationAbnormalPage`, `ignoreOperationAbnormalBatch`, `queryArrayFirstTypeIsUse`, `queryArraySecondTypeIsUse`, `queryFirstExceptionType`, `queryFirstExceptionTypePage`, `queryFirstTypeIsUse`, `queryOperationAbnormalPage`, `querySecondExceptionType`, `querySecondExceptionTypePage`, `querySecondTypeIsUse`, `save`, `saveFirstExceptionType`, `saveSecondExceptionType`, `update`, `updateFirstExceptionType`, `updateSecondExceptionType`

**`overseas`**
- GET: `refreshCache`
- POST: `addRoadLevel`, `getStreetLightOnRate`, `getStreetWoOverhaulRate`, `queryRoadLevel`, `removeRoadLevel`, `updateRoadLevel`, `updateRoadLevelOfLcu`

**`parkingActor`**
- POST: `getSign`

**`passengerFlowGroup`**
- POST: `deletePassengerFlowGroup`, `queryPassengerFlowGroupListPage`

**`phaseAuto`**
- POST: `allList`, `continueRun`, `getAreaAndRoad`, `getInfo`, `getRtuList`, `manualDeal`, `pause`, `queryStatus`, `querynoExistSupplyRtuIds`, `start`, `stop`

**`poleActor`**
- GET: `queryAttributeDeviceOfPole/{param}`, `queryLcusOfPoleByLcuId/{param}`, `queryPoleAndRelatedById/{param}`
- POST: `delete`, `fogPileAssociatedWithPole`, `queryPoleAndAttributeDeviceByLatAndLng`, `queryPoleAssociatedWithSensor`, `queryPoleOfProject`, `queryPoleThatCanBeAssociatedWithFogPile`, `queryPoleThatCanBeAssociatedWithSensor`, `queryPoleThatCanBeAssociatedWithSensorPage`, `queryRelatedMutiPoleOfDirectory`, `queryRelatedMutiPolePage`, `queryUnrelatedMutiPolePage`, `save`, `sensorAssociatedWithPole`
- PUT: `update`

**`poleType`**
- GET: `getPoleTypeById/{param}`
- POST: `delete`, `getAllPoleTypeOfProjectList`, `getAllPoleTypeOfProjectPage`, `getInPoleTypeOfProject`, `save`, `update`

**`powerBoxActor`**
- GET: `getBindDevice/{param}`, `getBindDeviceInfo/{param}`, `getKmsById/{param}`, `queryInternalLcuInfoOfPowerBox/{param}`, `queryNetMode/{param}`, `querySerialPort/{param}`, `queryServerConfig/{param}`
- POST: `bindDevice`, `deleteDeviceBatch`, `powerboxSyncPage`, `queryComTopologyPowerBoxPage`, `queryConfig`, `queryDeviceAndRelated`, `save`, `savePriorityNetMode`, `setConfig`, `setConfigOfLan`, `setSerialPort`, `setServerConfig`, `update`, `updateInternalLcuInfoOfPowerBox`

**`powerBoxControl`**
- GET: `getDHCPParam/{param}`, `getDOMode/{param}`, `getLanParam/{param}`, `getNetType/{param}`, `getRS485/{param}`, `getServer/{param}`, `getWanParam/{param}`, `setDHCPParam/{param}`, `setDOMode/{param}`, `setDeviceRS485/{param}`, `setEnvSensorInfo/{param}`, `setLanParam/{param}`, `setPriorityNetMode/{param}`, `setRS485/{param}`, `setServer/{param}`, `setWanParam/{param}`
- POST: `ctrlBroadcast`, `queryAlarmConfig`, `queryLedAlarmConfig`, `queryMeterData`, `setWebPwd`, `syncDevice`

**`powerBoxTaskCtrl`**
- POST: `deleteTask`, `deleteTask_v2`, `queryLatLng`, `queryTask`, `queryTask_v2`, `setLatLng`, `setTask`, `setTask_v2`

**`progress`**
- GET: `queryList/{param}`

**`project`**
- GET: `getCityOfProject/{param}`, `getHisDataConfigOfProject/{param}`, `getLatLngOffsetTime/{param}`, `getLcuAutoCtrlByProjectId/{param}`, `queryLastProject`, `queryProjectControlSet/{param}`, `queryProjectInfoById/{param}`, `queryProjectNameByProjectId/{param}`, `queryProjectSunriseSunsetSource/{param}`, `selectDataArchiveByProjectId/{param}`
- POST: `controlSetUpdate`, `delete`, `queryByCreateUserId`, `queryByName/{param}`, `queryByProjectIds`, `queryDeviceByProject`, `queryList`, `queryProjectById`, `queryProjectByUserId`, `queryTree`, `queryUserCreatProject`, `reportMinuteUpdate`, `save`, `saveDataArchive`, `saveOrUpdateSunSource`, `saveProjectDeviceType`, `saveProjectLcuAutoCtrl`, `saveProjectUserMap`, `updateConfigure`, `updateHisDataConfigOfProject`, `updateLightOnRate`, `updateUserOfProject`
- PUT: `update`

**`projectEnergyConfigDevicetype`**
- POST: `getConfigByProject`, `saveOrUpdateConfig`

**`projectImportExport`**
- POST: `exportProjectData`, `getExportProjectDataUrl`, `importProjectDataCheck`

**`projectLampActor`**
- GET: `queryLampAndRelatedById/{param}`, `queryLampOfLcu/{param}`, `queryLampOfPowerBox/{param}`, `queryLampOfRtu`, `queryLampOfSolarLcu/{param}`
- POST: `queryProjectLamp`, `queryProjectSolarControllerLamp`, `queryProjectSolarLamp`, `queryStationLamp`
- PUT: `update`

**`ProjectStationActor`**
- GET: `getStationById/{param}`, `getStationDataOnMap/{param}`, `queryRelatedStationOfDirectory/{param}`, `queryStationOfRootDirectoryByProjectId/{param}`
- POST: `deleteNew`, `queryAllProjectStation`, `queryNormalAndAlarmStationList`, `queryProjectStation`, `queryRelatedStationPage`, `queryStationAndRtuPage`, `querySubordinateMonitoringPointInWiringDiagramOfStation`, `queryUnrelatedStationPage`, `queryWiringDiagramOfStation`, `quickGenerateStations`, `saveNew`, `setDailyEnergy`, `updateNew`

**`projectSwitchTimeStatistics`**
- POST: `switchTimeStatisticsMap`

**`protocolActor`**
- GET: `queryById/{param}`, `queryList`
- POST: `queryProtocolFunction`, `queryUSeProtocol`, `updateProtocolName`

**`province`**
- GET: `queryAllProvince`, `queryByProvinceId/{param}`, `queryProvinceById/{param}`
- POST: `queryByPage`, `save`, `update`
- DELETE: `deleteById/{param}`

**`radarActor`**
- GET: `getNocarDelay/{param}`
- POST: `deleteDeviceBatch`, `insertGroupRadar`, `pageList`, `queryAll`, `queryByGroup`, `queryConfigFailed`, `queryNoGroupRadar`, `queryRadarById`, `save`, `setNocarDelay`, `update`, `updateRtuId`

**`radarControl`**
- POST: `configLcuUid`, `delConfigLcuUid`, `deploy`, `queryTimeTask`, `setConfig`, `setGruop`, `setLinkageTask`, `setParam`

**`radarCorrelationActor`**
- POST: `addDeviceToConfig`, `deleteDeviceToConfig`, `getRadarLinkageDevice`, `queryDeviceChoosePage`, `queryDeviceConfigPage`, `queryRadarCorrelationTaskList`, `saveBatch`

**`radarLinkageStrategyActor`**
- POST: `delete`, `exportRadarCarHis`, `getRadarCarHisPage`, `getRadarLinkageHisDevicePage`, `getRadarLinkageHisGroupPage`, `getRadarLinkageStrategyById`, `queryRadarLinkageHisPage`, `queryRadarLinkageStrategyList`, `save`, `update`

**`reportFormsExportTask`**
- GET: `getExportFileUrl/{param}`
- POST: `create`

**`reportManage`**
- POST: `autoSend`, `deleteReportsById`, `queryAutoSend`, `queryReportsPage`, `saveOrupdateAutoSend`, `saveReport`

**`role`**
- GET: `queryByAgencyId/{param}`, `queryById/{param}`, `queryIdAndName`, `queryTree`, `queryUserAndRoleByMenuId/{param}`
- POST: `bindAuthority`, `deleteBatch`, `queryList`, `queryPage`, `save`
- PUT: `update`
- DELETE: `delete/{param}`

**`rtuActor`**
- GET: `getBindDevice/{param}`, `getBindDeviceInfo/{param}`, `getRtuById/{param}`, `queryAllRtuByProjectId/{param}`, `queryInternalInfoOfRtu/{param}`, `queryRelatedRtuOfDirectory/{param}`, `queryRtuAndRelatedByUid/{param}`, `queryRtuById/{param}`, `queryRtuDeatilById/{param}`, `querySerialPort/{param}`, `statisticsOfRtuByProjectId/{param}`, `synchronizeRtuType`
- POST: `bindDevice`, `bindDevice_v1`, `deleteNew`, `deployPageList`, `getBindSubDeviceInfo`, `getMeterDataByRtuId`, `getRtuAndMeterInfoList`, `kmHisPageList`, `mapRtuPageList`, `pageList`, `queryGroupRtu`, `queryLcuCanRelatedRtuPage`, `queryRelatedRtuPage`, `queryRtuAndAttributeDeviceOfStationInSupplyElectricity`, `queryRtuByluxId`, `queryUnrelatedRtuPage`, `rtuAllPage`, `saveNew`, `setKmsEnabled`, `setSerialPort`, `updateInternalInfoOfRtu`, `updateNew`, `updateRtuData`

**`rtuExpor`**
- POST: `exportRtuMap`

**`rtuSdmpControl`**
- GET: `getAutoDev/{param}`, `getRS485/{param}`, `setRS485/{param}`
- POST: `setAutoDev`

**`rtuServerInfo`**
- GET: `deleteById/{param}`, `queryById/{param}`
- POST: `page`, `save`, `update`

**`rtuTaskCtrl`**
- POST: `deleteTask`, `deleteTask_v2`, `queryRtu190Task`, `queryTask`, `queryTask_v2`, `setRtu190Task`, `setTask`, `setTask_v2`

**`scanCode`**
- POST: `getCustomList`, `getProjectList`, `productionIpSet`

**`scenesLight`**
- GET: `queryScenesLightById/{param}`
- POST: `addScenesLight`, `addShowingMasterNumToScenes`, `addShowingMasterToScenes`, `deleteScenesLight`, `deleteScenesLightShowing`, `queryScenesLight`, `queryShowingMasterByScenesLight`, `queryShowingMasterList`, `updateScenesLight`

**`scenesLightControl`**
- POST: `sceneActivateImmediately`, `scenesEnableTimedExecution`, `scenesImmediateShutdown`

**`scenesLightDevice`**
- POST: `addScenesLightDevice`, `deleteScenesLightDevice`, `queryProjectKmByColumn`, `queryProjectKmByRow`, `queryScenesDevice`, `queryScenesLightGroupDevice`

**`scenesLightExport`**
- POST: `exportScenesGroupDevice`

**`scenesLightGroup`**
- GET: `queryScenesLightGroupById/{param}`, `queryScenesLightListByProjectId/{param}`
- POST: `addScenesLight`, `addScenesTask`, `deleteScenesLight`, `queryScenesLightGroup`, `queryScenesLightGroupList`, `queryScenesLightTask`, `updateScenesLight`, `updateScenesTask`

**`scheduleJob`**
- POST: `saveLcuAutoCtrl`

**`screenActor`**
- POST: `add`, `deleteDeviceBatch`, `pageList`, `queryDeviceAndRelated`, `queryScreenList`, `update`, `updateGatewayUid`

**`screenCtrl`**
- GET: `queryHDScreenStatus/{param}`, `queryHDScreenVersion/{param}`
- POST: `advancedConfig`, `callCardService`, `clearPlayList`, `clearScreen`, `continuePlay`, `downloadFileToLocal`, `getBrightness`, `getNtpServer`, `getPackageVersion`, `getPlayingProgram`, `getProgramTask`, `getServerAddress`, `getTimeSync`, `getTimedBrightness`, `getTimedScreening`, `getTimezone`, `invokeJs`, `loadUrl`, `pause`, `queryTimeOfXiXun`, `reboot`, `relay`, `screenshots`, `setAutoBrightness`, `setBrightness`, `setHDScreenPlayMode`, `setIPAndPort`, `setTimeSync`, `setVolume`, `syncHDScreen`, `timming`, `turnOffScreen`, `turnOnScreen`, `uninstallApp`, `updateApp`

**`screenTaskCtrl`**
- POST: `clearTask`, `clearTask_v2`, `submitScreenTask`, `submitScreenTask_v2`, `submitTask`

**`sensorActor`**
- GET: `querySensorAndInfo/{param}`
- POST: `deleteDeviceBatch`, `pageList`, `queryDeviceAndRelated`, `queryHistoricalTrendDataOfSensor`, `queryRelatedSensorOfDirectory`, `queryRelatedSensorPage`, `queryUnrelatedSensorPage`, `save`, `setSensorDisplayInfo`, `setSensorReport`, `setSensorReset`, `update`, `updateRtuId`

**`sensorControl`**
- GET: `getSensorInfo/{param}`, `rainfallResetGet/{param}`, `setEnvSensorInfo/{param}`
- POST: `rainfallResetSet`

**`showingAct`**
- POST: `getShowingActByShowingMasterId`, `saveAct`
- DELETE: `delete/{param}`

**`showingMasterActor`**
- GET: `getShowingMasterById/{param}`
- POST: `delete`, `pageList`, `save`, `update`, `updateRtuId`

**`showingMasterControl`**
- POST: `pauseOrPlay`, `playScenes`, `queryAct`, `queryParam`, `stopScenes`, `submitParam`, `submitProtocol`, `switchAct`

**`signageActor`**
- GET: `getSignageById/{param}`
- POST: `delete`, `save`, `update`

**`smartBoxActor`**
- GET: `getBindDevice/{param}`, `querySerialPort/{param}`, `queryServerConfig/{param}`, `statisticsOfSmartBoxByProjectId/{param}`
- POST: `bindDevice`, `delete`, `getBindRadarDeviceInfo`, `getBindSensorDeviceInfo`, `getSmartBoxAndRelatedById`, `queryListByParams`, `queryRelatedSolarLcu`, `querySmartBoxStatusHis`, `save`, `setSerialPort`, `setServerConfig`, `smartBoxAllPage`, `smartBoxSyncPage`, `update`, `updateDefaultUid`

**`smartBoxControl`**
- GET: `getGprsInfo/{param}`, `getRFMdlVer/{param}`, `getRS485/{param}`, `getServer/{param}`, `setRS485/{param}`, `setServer/{param}`
- POST: `seriDevDel`, `setRFmodule`, `setZone`, `syncDevice`

**`smartBoxExport`**
- POST: `exportStatusHis`

**`smartBoxTaskCtrl`**
- POST: `deleteTask`, `deleteTask_v2`, `queryLatLng`, `queryLatLngTask`, `queryTask`, `setLatLng`, `setLatLngTask`, `setLatLngTask_v2`, `setTask`

**`solarActor`**
- GET: `getComDeviceInfoOfSolar/{param}`, `getSolarAndRelatedById/{param}`, `queryLcConfig/{param}`, `queryParam/{param}`, `querySolarDeatilById/{param}`, `querySolarLightById/{param}`, `querySrLcConfig/{param}`, `querySrParam/{param}`, `statisticsOfSolarByProjectId/{param}`
- POST: `addLabel`, `delete`, `deleteLabel`, `getSuperDeviceInfo`, `queryComDeviceAssociatedWithSolar`, `querySolarNotAssociatedWithPole`, `save`, `saveBatchSolar`, `setHnCompareParam`, `setLcConfig`, `setParam`, `setSrCompareParam`, `update`

**`solarControl`**
- POST: `queryControllerParam`, `queryCtrlmodel`, `queryGroup`, `queryHisData`, `queryLcParam`, `queryTaskNum`, `queryVersion`, `queryWcuInfo`, `setControllerParam`, `setControllerParam_other`, `setCtrlmodel`, `setGroup`, `setLcParam`, `setSrLcParam`, `setSrParam`, `setTaskNum`

**`solarDeviceControl`**
- POST: `configLcu`, `deleteReportContent`, `queryControllerParam`, `queryEnergyHis`, `queryGroupNum`, `queryLcPara`, `queryNetParam`, `queryReportContent`, `queryReportMinute`, `querySolarLcuParam`, `restart`, `setControllerParam`, `setGroup`, `setLcParam`, `setNetParam`, `setReportContent`, `setReportMinute`, `setTransmissionPower`, `upgrade`

**`solarLamp`**
- GET: `querySolarLampAndRelatedById/{param}`
- POST: `initSolarLamp`
- PUT: `update`

**`solarLcuActor`**
- GET: `getSolarLcuAndRelatedById/{param}`, `queryControllerParam/{param}`, `queryLcConfig/{param}`, `queryNetParam/{param}`, `queryReportMinute/{param}`, `querySolarLcuDeatilById/{param}`, `statisticsOfSolarLcuByProjectId/{param}`
- POST: `delete`, `getSolarLcuRealtionSmartBox`, `mapPageList`, `querySolarLcuById`, `querySolarLcuNotAssociatedWithPole`, `save`, `setControllerParam`, `setLcConfig`, `setNetParam`, `update`, `updateConnectSmartBox`

**`solarLcuExport`**
- POST: `exportSolarLcuMap`

**`solarLcuLight`**
- POST: `querySolarLcuLightByLcuIdAndNum`, `updateLabel`

**`solarLcuTaskCtrl`**
- POST: `queryTask`, `setTask`, `setTask_v2`

**`solarTaskCtrl`**
- POST: `queryTask`, `setTask`, `setTask_v2`

**`sponRegisterCtrl`**
- POST: `sponDeviceRegister`, `sponDeviceUnRegister`

**`sunriseAndSunset`**
- GET: `querySunriseSunsetOffsetTime/{param}`
- POST: `page`, `queryPrimevalSunriseSunset`, `save`, `sunSourceHkDataSync`, `sunSourceRegeneration`, `updateSunriseSunsetOffsetTime`

**`sunriseAndSunsetExport`**
- POST: `primevalSunriseSunsetExport`

**`supplyElectricity`**
- POST: `queryDeviceTypeByParentDeviceType`

**`supplyElectricityDevice`**
- POST: `associateDeviceWithParentDevice`, `dissociateDeviceWithParentDevice`, `fastBindingOfSuppLyElectricity`, `getPbSuppleyElectricityChildDevices`, `getPbUnSuppleyElectricityChildDevices`, `kmRelatedMeterPhase`, `pageSuppleyElectricityChildDevices`, `pageSuppleyElecttricityParentDevices`, `pageUnSuppleyElectricityChildDevices`, `queryMeterPhase`, `queryPowerSupplyTopologyOfDevice`, `querySupplyElecOfDevice`, `relatedPbSuppLyElectricity`, `relatedPbSuppLyElectricityKm`, `relatedSuppLyElectricity`, `relatedSuppLyElectricityKm`, `removePbSuppLyElectricity`, `removeSuppLyElectricity`

**`sysFile`**
- GET: `queryFileByHandlerId/{param}`
- POST: `checkFile`, `checkMediaFileById`, `countMediaFile`, `createCertificateUrl`, `deleteImageById`, `deleteMediaFileById`, `deleteSubmitFile`, `exportCheckRecord`, `getCheckPage`, `getSubmitPage`, `queryAIBOXUpgradeFolder`, `queryFileBx`, `queryFileById`, `submitCheck`

**`syslog`**
- POST: `queryPage`
- DELETE: `deleteProjectLog`

**`sysLogExport`**
- POST: `exportSysLogPage`

**`sysLogo`**
- POST: `logoUpload/{param}`

**`systemInfo`**
- GET: `getSystemInfo`, `querySysInfo?type={param}`, `querySystemInfo`
- POST: `updateSysInfo`
- PUT: `updateSystemInfoToUser`

**`tangYuanChargingCtrl`**
- POST: `queryListVersion`, `reboot`, `remoteStartTransaction`, `remoteStopTransaction`, `upgrade`

**`task`**
- POST: `addTaskGroup`, `delete`, `deleteTaskGroup`, `editTaskGroup`, `getGroupTask`, `getLcuTaskByGroup`, `getTaskAndGroupNameByGroup`, `getTaskByDeviceId`, `getTaskByGroup`, `getTaskById`, `getTaskModeConfig`, `page`, `queryDeviceGroupByTaskGroupType`, `queryLcuTaskByDeviceId_v3`, `queryTaskByDeviceId`, `queryTaskByDeviceId_v2`, `queryTaskByTaskGroupId`, `queryTaskGroupByDeviceGroupType`, `queryTaskGroupList`, `queryTaskGroupSyncHisPage`, `save`, `screenTaskList`, `taskGroupSyncToDeviceGroup`, `taskModeSave`, `update`

**`taskCtrl`**
- POST: `deleteRtuTask`, `deleteTask`, `queryTask`, `submitTask`

**`taskGroupExport`**
- POST: `exportDeviceByGroup`, `exportTask`

**`taskHistory`**
- POST: `getTaskHisByDevice`, `getTaskHisByDevice_v2`

**`telecom`**
- POST: `register`, `unRegister`

**`thermometerActor`**
- GET: `queryDetailById/{param}`
- POST: `add`, `deleteDeviceBatch`, `hisTrend`, `historyTable`, `pageList`, `update`, `updateKmId`, `updateRtuId`

**`thermometerCtrl`**
- POST: `tempsenGet`, `tempsenRepSet`, `tempsenWarnGet`, `tempsenWarnSet`

**`thermometerExpor`**
- POST: `hisTrend/export`

**`tiltSensorActor`**
- GET: `queryDetailById/{param}`
- POST: `add`, `deleteDeviceBatch`, `getTiltSensorHisList`, `pageList`, `update`, `updateRtuId`

**`tiltSensorCtrl`**
- POST: `tiltGet`, `tiltRepSet`, `tiltWarnGet`, `tiltWarnSet`, `tiltZeroModelSet`

**`trafficLightActor`**
- GET: `getTrafficLightIdById/{param}`
- POST: `delete`, `save`, `update`

**`uidRecord`**
- POST: `queryUidReplacementRecord`

**`uidRecordExport`**
- POST: `exportUidReplacementRecord`

**`upgradePoolLcuExport`**
- POST: `exportLcuList`

**`user`**
- GET: `queryAllUsersOfAllAgenciesUnderAgency/{param}`, `queryAllUsersUnboundWristbandOfAllAgenciesUnderAgency/{param}`, `queryById/{param}`, `queryListByAgencyId/{param}`, `querySuperUserCount`, `queryUserGroup`, `resetPassword/{param}`
- POST: `bindRole`, `deleteBatch`, `getUserProfilePhotoById`, `profilePhotoUpload/{param}`, `queryPage`, `queryUserByProjectId`, `queryUserOfAgency`, `save`, `updateAdministratorUser`, `updateAgencyByUserId`, `updateRoleOfUser`
- PUT: `update`
- DELETE: `delete/{param}`

**`userProject`**
- GET: `queryByUserId/{param}`

**`vehicle`**
- GET: `queryAllVehiclesInUpAndDownAgencyOfUser`, `queryVehicleByVehicleId/{param}`
- POST: `delete`, `queryIdleVehicles`, `queryVehiclesPage`, `save`, `setMaximumSpeed`, `setVehicleStatus`, `update`

**`vehicleAnnualInspection`**
- POST: `queryVehicleAnnualInspectionsPage`, `save`

**`vehicleExport`**
- POST: `exportAllVehicleUse`, `exportOilCards`, `exportVehicleUse`

**`vehicleInsurance`**
- POST: `queryVehicleInsurancesPage`, `save`

**`vehicleLocatorController`**
- GET: `countVehiclesInUpAndDownAgencyOfUser`, `queryElectricFence/{param}`
- POST: `deleteDeviceBatch`, `queryDeviceAndRelated`, `queryVehicleLocatorAndVehicleOfAllProjectInAgency`, `queryVehicleLocatorOfAllProjectInAgency`, `save`, `update`

**`vehicleRepair`**
- POST: `queryVehicleRepairsPage`, `save`

**`vehicleUse`**
- GET: `queryApprovedVehicleUseOnThatDay/{param}`, `queryProcessOfVehicleUse/{param}`, `queryVehicleUseDetails/{param}`, `revokeVehicleUse/{param}`
- POST: `deleteVehicleUseBatch`, `queryAllVehicleUsePage`, `queryMaterialUsePage`, `queryVehiclesUseHistoryPage`, `resubmitVehicleUseMap`, `reviewVehicleUseMap`, `save`, `updateVehicleUseMap`

**`verifyRecord`**
- POST: `exportVerifyRecordPage`, `queryVerifyRecordPage`, `verify`

**`waterImmerDetectActor`**
- GET: `queryDetailById/{param}`
- POST: `add`, `deleteDeviceBatch`, `getWaterImmerDetectHisList`, `pageList`, `update`, `updateRtuId`

**`waterImmerDetectCtrl`**
- POST: `wleakRepSet`, `wleakSenGet`, `wleakSenSet`, `wleakStateGet`

**`wcuActor`**
- GET: `getBindDevice/{param}`, `getBindDeviceOfPort/{param}`, `getSlaveTypeOfWcu/{param}`, `getWcuById/{param}`, `queryControllerParam/{param}`, `queryReportMinute/{param}`, `querySerialPort/{param}`, `statisticsOfWcuByProjectId/{param}`
- POST: `bindDevice`, `delete`, `getBindDeviceInfo`, `save`, `setReportMinute`, `update`, `updateConnectSmartBox`

**`wcuControl`**
- POST: `deleteReportContent`, `queryReportContent`, `queryReportMinute`, `querySlaveType`, `queryVersion`, `queryWcuParam`, `queryZoneId`, `restart`, `setReportContent`, `setReportMinute`, `slaveTypeConfig`, `upgrade`

**`weeYuChargingCtrl`**
- POST: `remoteStartTransaction`, `remoteStopTransaction`

**`wellcoverActor`**
- GET: `getWellcoverDataOnMap/{param}`
- POST: `deleteDeviceBatch`, `getWellcoverParam`, `queryDeviceAndRelated`, `save`, `update`, `updateParam`

**`wellCoverCtrl`**
- GET: `getNSBand/{param}`
- POST: `calibrate`, `queryAngleParam`, `register`, `setHeartPeriodResp`, `submitParam`, `unRegister`

**`westLakeBuilding`**
- POST: `buildingAssociateCabinet`, `buildingAssociateCamera`, `buildingAssociateFireAlarmDevice`, `buildingAssociateRtu`, `queryAiDiPageInWestLake`, `queryBuildingListPage`, `queryMeterPageInWestLake`, `setBigScreenRemark`, `setBuildSummary`

**`wifiActor`**
- GET: `queryWifiById/{param}`
- POST: `deleteDeviceBatch`, `queryDeviceAndRelated`, `save`, `update`

**`work`**
- GET: `{param}`
- POST: `pathPlanDayList`, `pathPlanList`, `save`, `update`, `updateOrder`, `updatePractical`, `workList`
- DELETE: `deleteById`

**`workMatter`**
- GET: `queryWorkMatterDetails/{param}`
- POST: `deleteWorkMatterBatch`, `queryAllWorkMatterPage`, `queryWorkMatterPage`, `reviewWorkMatterMap`, `save`

**`workMatterType`**
- GET: `queryWorkMatterTypeList`
- POST: `deleteWorkMatterTypeBatch`, `queryWorkMatterTypePage`, `save`

**`workOrderStatistics`**
- POST: `getStatisticsMap`, `getTodayWorkOrderData`, `getWorkOrderSourceMap`, `getWorkOrderStateMap`, `getYesterdayMonthYearOrders`

**`wristbandController`**
- POST: `deleteDeviceBatch`, `queryDeviceAndRelated`, `queryWristbandHistory`, `queryWristbandOfAllProjectInAgency`, `save`, `update`, `wristbandBindUser`, `wristbandUnbindUser`

**`zhpvCtrl`**
- POST: `ctrlLoop`, `querCabinetData`, `querCabinetStatus`, `queryLoopStatus`, `queryLoopStatusAll`, `sendTask`, `timming`