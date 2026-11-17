# SLCP — API Methods (đầy đủ)

Toàn bộ 2.320 method theo controller. Mô tả & lớp R/W/C ở `04-api-catalog.md`.


**``**
- POST: `phaseAuto/createSupplyElectricity`

**`abnormalRecord`**
- POST: `abnormalRecordHistoryPage`, `clearAbnormalRecord`, `deleteAbnormalRecordHistory`, `queryAbnormalRecordPage`

**`abnormalRecordExport`**
- POST: `exportAbnormalRecordPage`

**`abnormalToAlarmPloy`**
- GET: `queryAbnormalToAlarmPloyById/{param}`, `queryAbnormalToAlarmPloyOfDevice/{param}`
- POST: `deleteBatch`, `ploySelectionAllDevice`, `ploySelectionDevice`, `queryAbnormalToAlarmPloyList`, `queryDeviceOfPloy`, `queryDeviceUnassociatedPloy`, `removeDeviceOfPloy`, `save`, `update`

**`abnormalWorkOrder`**
- GET: `queryById/{param}`, `queryOrderHandleInfo/{param}`, `queryProcess/{param}`
- POST: `add`, `alarmWorkOrderList`, `delete`, `excelSpainAllPage`, `excelSpainPage`, `exportAbnormalWorkOrderPage`, `getOrderCount`, `handle`, `queryAllPage`, `queryListByLiable`, `queryPage`, `queryPlanPathPage`, `querySpainAllPage`, `querySpainPage`, `reSubmit`, `review`, `saveHandle`, `setSort`, `transferOrder`, `update`, `updateAutomaticEnd`

**`abnormalWorkOrderOverview`**
- POST: `circulation`, `circulationDetails`, `grandUndoneDetails`, `tmCompleteDetails`, `tmOverview`

**`actilityCtrl`**
- POST: `addGatewayToActility`, `addMulticastGroupToActility`, `deleteActilityGateway`, `getGateWayModels`, `getGateway`, `getGatewayRFRegions`, `getLoraWanDeviceModels`, `getPlatformConnects`, `getPlatformDomains`, `getTagDownlink`, `setGatewayLatLng`, `setGatewayRfRegion`, `setGatewayTag`, `updateGatewayPublicKey`, `updateGatewayToActility`, `updateMulticastGroupToActility`

**`actilityGroupControl`**
- POST: `lcuGroupBatchOperationLatLng`, `lcuGroupBatchOperationQuick`

**`actilityProjectActor`**
- POST: `celarDomain`, `getActilityProject`, `getGatewayList`, `saveOrUpdateActilityProject`, `setDomain`

**`agency`**
- GET: `getMessageConfigurationOfAgency/{param}`, `queryAllAgencyOfThirdAccountList`, `queryById/{param}`, `queryByParentId/{param}`, `queryList`, `queryTree`, `queryTreeOfSecondLevelAccounts`
- POST: `configureMassageOfAgency`, `deleteBatch`, `queryPage`, `save`
- PUT: `update`
- DELETE: `delete/{param}`

**`aibox`**
- POST: `delete`, `getAIboxById`, `getAIboxEventList`, `getAIboxList`, `save`, `update`

**`aiboxControl`**
- POST: `getPresets`, `gotoPresets`, `ptzControl`, `queryIpAndPortToUpgradeConfig`, `querySoftVersion`, `setPresets`, `setStreamPush`, `updateIpAndPortToUpgradeConfig`

**`aiboxEvent`**
- POST: `clearAreaTotal`, `clearAreaTotalDataArchived`, `clearBehavioralEvent`, `clearBehavioralEventDataArchived`, `clearFaceEvent`, `clearFaceEventDataArchived`, `clearTrafficFlow`, `clearTrafficFlowDataArchived`, `clearVehicleType`, `clearVehicleTypeDataArchived`, `countFaceEventData`, `getEventDataArchivedList`, `getEventList`, `getEventStatistics`, `getFaceEventDataArchivedList`, `getFaceEventList`, `getPassengerFlowDataArchivedList`, `getPassengerFlowStatisticsList`, `getPassengerFlowlList`, `getTrafficFlow`, `getTrafficFlowCount`, `getTrafficFlowDataArchived`, `getTrafficFlowStatistics`, `getVehicleCaptureEvent`, `getVehicleCaptureEventDataArchived`, `getVehicleTypeCount`, `getVehicleTypeStatistics`, `passengerFlowStatistics`

**`aiboxLinkageStrategyActor`**
- POST: `delete`, `getAIboxLinkageHisGroupPage`, `getAiboxLinkageStrategyById`, `queryAIboxLinkageHisPage`, `queryAIboxLinkageStrategyList`, `save`, `update`

**`aidi`**
- POST: `getUnRelatedDIByRtuId`, `queryAIOrDIByProject`, `queryAIOrDIByRtus`, `queryAiDi`, `relatedDI`
- PUT: `update`

**`alarmStatistics`**
- POST: `alarmStatistics`, `alarmTypeStatistics`

**`alarmType`**
- POST: `initAlarmTypesCache`, `initAlarmTypesOfProject`, `queryAlarmTypesOfDevice`, `queryAlarmTypesOfDeviceByProjectId`, `queryAlarmTypesOfLinkageStrategy`, `queryAlarmTypesOfRtuStrategy`, `queryAlarmTypesOfStrategy`, `queryMultilingualAlarmTypesOfProject`, `queryMultilingualSolutionOfProject`, `setAlarmStatus`, `updateAlarmTypesOfProject`, `updateSolutionOfProject`

**`antiActor`**
- POST: `addAnti`, `addAntiIpAndProd`, `deleteDeviceBatch`, `getAntiIdListByRtuId`, `getAntiListByRtuId`, `pageList`, `queryAisleList`, `queryAntiById`, `queryAntiNotRtuList`, `queryDeviceAndRelated`, `queryRtuAndAntiList`, `update`, `updateAntiaisle`, `updateRtuId`

**`antiControl`**
- POST: `configAntiIpAndPort`, `getAntiData`, `getImpedance`, `rebootAnti`, `setParam`

**`antiExtensionModule`**
- POST: `addAntiExtensionModule`, `deleteDeviceBatch`, `queryDeviceAndRelated`, `update`

**`appealActor`**
- GET: `queryStatus/{param}`
- POST: `add`, `deleteDeviceBatch`, `pageList`, `queryDeviceAndRelated`, `update`, `updateGatewayUid`, `updateTarget`

**`area`**
- GET: `queryAreaAndRelatedById/{param}`, `queryAreaByCityId/{param}`, `queryAreaByProjectId/{param}`, `queryProjectByProjectId/{param}`
- POST: `copySysArea`, `deleteSystemAreaIds`, `queryAreaPage`, `saveOrUpdateSystemAreaMap`

**`areaRoad`**
- GET: `getAreaRoadById/{param}`, `getAreaRoadsByProjectId/{param}`, `queryByAreaId/{param}`, `queryCityByAreaId/{param}`, `queryRoadByAreaId/{param}`
- POST: `copyRoad`, `exportAreaRoadPage`, `queryAreaPage`, `queryRoadOfArea`, `saveRoad`, `updateRoad`
- DELETE: `deleteRoad`

**`artificialAbnormal`**
- GET: `queryArtificialAbnormalById/{param}`, `queryArtificialAbnormalInOrderId/{param}`, `queryDevicesByCode`
- POST: `deleteArtificialAbnormalBatch`, `exportArtificialAbnormalPage`, `queryArtificialAbnormalPage`, `save`, `update`

**`assessRecord`**
- GET: `getAssessRecordById/{param}`
- POST: `delete`, `exportAssessRecordPage`, `exportAssessRecordStatistics`, `page`, `pageAssessRecordStatistics`, `save`, `update`

**`assetExport`**
- POST: `exportLedgerDevicePage`

**`assetLedger`**
- POST: `queryDALIInfo`, `queryLedgerDeviceDetails`, `queryLedgerDevicePage`, `querySubordinateDeviceDetailsInLedgerManagement`, `querySubordinateDeviceList`, `querySuperiorDeviceDetailsInLedgerManagement`, `supplyInformationForLedgerDevice`, `updateDALIInfo`

**`audioTaskCtrl`**
- POST: `clearAudioTask`, `clearAudioTask_v2`, `clearTask`, `submitAudioTask`, `submitAudioTask_v2`, `submitTask`

**`autoDispatchConfig`**
- GET: `queryAutoDispatchConfigById/{param}`
- POST: `save`, `update`

**`autoPollingGroup`**
- GET: `getAutoPollingGroupAndRelatedById/{param}`, `queryAutoPollingGroupsOfProject/{param}`
- POST: `autoPollingGroupAssociationDevice`, `delete`, `manuallyDrop`, `queryDeviceOfAutoPollingGroup`, `queryUnassociatedDeviceOfAutoPollingGroup`, `removeDeviceAssociatedWithAutoPollingGroup`, `save`, `update`

**`baseStationActor`**
- POST: `deleteDeviceBatch`, `queryDeviceAndRelated`, `save`, `update`

**`basicEnergyConsumption`**
- GET: `getBasicEnergy/{param}`
- POST: `save`

**`bigScreenUser`**
- GET: `goBigScreen`

**`boxSelExport`**
- POST: `exportBoxSelectionLcu`, `exportBoxSelectionRtu`

**`broadcastBoxActor`**
- POST: `deleteDeviceBatch`, `queryDeviceAndRelated`, `queryRelation`, `save`, `saveRelation`, `update`

**`broadcastBoxControl`**
- POST: `ctrlBroadcast`, `setBroadcastConfig`

**`busController`**
- GET: `getBusControllerById/{param}`, `getBusControllerPanelDataById/{param}`, `getBusLampPanelDataById/{param}`
- POST: `delete`, `save`, `update`, `updateConnectSmartBox`

**`bxlsCtrl`**
- POST: `getMediaList`, `palyTask`, `pauseTask`, `queryTask`, `queryTaskStatus`, `runTask`, `stopTask`, `syncTask`

**`cabinet`**
- GET: `getCabinetById/{param}`
- POST: `delete`, `getCabinetPlatformPage`, `svaePlatformToCabinet`, `syncPlatformCabinet`

**`cabinetTask`**
- GET: `cabinetListByTaskId/{param}`, `getCabinetTaskById/{param}`
- POST: `add`, `delete`, `getCabinetList`, `getCabinetTaskList`, `page`, `update`

**`cableInspectionActor`**
- GET: `getCableInspectionById/{param}`, `getCableInspectionByRtuId/{param}`, `getCableInspectionInfoById/{param}`
- POST: `delete`, `getCableInspectionLoop`, `getNumByProjectId`, `getRtuAlarmOfCableInspectionLoopPage`, `mapPageList`, `pageList`, `save`, `saveConfigParamsDevices`, `setLdNUm`, `update`, `updateRtuId`

**`cableInspectionControl`**
- POST: `cleanAlarm`, `cleanRtuStrategyParam`, `queryCableInspectionData`, `queryCableInspectionKsParam`, `queryCableInspectionLdParam`, `queryCableInspectionWgParam`, `queryCableInspectionWyParam`, `queryRtuStrategyParam`, `setCableInspectionDeploy`, `setRtuStrategyParam`

**`cableInspectionDataHisActor`**
- POST: `exportAll`, `exportCableInspections`, `exportOne`, `getRtuLatLng`, `getTrend`, `page`, `pageCableInspection`

**`cableInspectionExpor`**
- POST: `exportCableInspectionMap`

**`cameraActor`**
- GET: `queryCameraIndexCode/{param}`, `statisticsOfCameraByProjectId/{param}`
- POST: `deleteDeviceBatch`, `pageList`, `queryCameraOfProject`, `queryDeviceAndRelated`, `queryRelatedCameraOfDirectory`, `queryRelatedCameraPage`, `queryRelationCamera`, `queryUnrelatedCameraPage`, `queryUnusedHikvisionCameraList`, `save`, `saveHikvision`, `update`, `updateGatewayUid`

**`cameraControl`**
- GET: `ptzsKeep/{param}`, `syncCamera`
- POST: `getCrowdData`, `playbackURLs`, `previewURL`, `ptzsControl`, `pushStream`, `queryDataOfPassengerFlowGroup`, `trafficJunction`, `trafficOverSpeed`, `trafficParking`, `trafficRetrograde`, `updatePassengerFlowGroup`

**`cameraEventMonitoringActor`**
- GET: `getConfigEventType/{param}`, `queryPeopleNum/{param}`
- POST: `getTrafficEvent`

**`cameraPreset`**
- POST: `addPresets`, `queryCameraByPoleId`, `queryPresetListByCameraIdAndDeviceId`, `setPresetAbility`, `updatePresetName`
- DELETE: `delete/{param}`

**`carbon`**
- GET: `getTransRate/{param}`
- POST: `getCarbonReduction`, `getKmOfPowerBoxData`, `getLcuData`, `getMeterData`, `getOverview`, `getPowerBoxData`, `setTransRate`

**`carbonExport`**
- POST: `getCarbonReduction`, `getKmOfPowerBoxData`, `getLcuData`, `getMeterData`, `getOverview`, `getPowerBoxData`

**`chargingActor`**
- GET: `queryChargingGunByChargingId/{param}`
- POST: `deleteDeviceBatch`, `queryDeviceAndRelated`, `save`, `update`

**`chargingControl`**
- GET: `queryData/{param}`, `queryStatus/{param}`

**`chargingPackage`**
- POST: `getChargingPackage`, `saveChargingPackage`

**`chargingPayRecord`**
- POST: `exportChargingPayRecordsPage`, `queryChargingPayRecordsPage`

**`city`**
- GET: `queryAllCity`, `queryByCountryId/{param}`, `queryById/{param}`, `queryByProvinceId/{param}`
- POST: `queryCityByPage`, `save`, `update`
- DELETE: `delete/{param}`

**`communicationTopology`**
- POST: `queryCommunicationTopologyOfDevice`

**`config`**
- GET: `getLcuAccidentLightConfig/{param}`, `getNodeLostConfig/{param}`
- POST: `alarmCount`, `alarmHandle`, `alarmdeviceId`, `clearAlarm`, `clearAlarmHis`, `countAlarmByLevel`, `countAlarmHis`, `deleteConfigParams`, `getAgaConfig`, `getAlarmEquipmentPage`, `getAlarmFollowUpLogHisPage`, `getAlarmFollowUpLogPage`, `getAlarmHisByDeviceId`, `getAlarmHisPage`, `getAlarmPage`, `getCableInspectionLoopInfoByDeviceId`, `getDeviceAlarmHisById`, `getDeviceAlarmPage`, `getDeviceType`, `getLcuBachOfflineConfig`, `getLcuByBatchOffLineDecisionType`, `getLcuConfig`, `getLcuNodeLostConfig`, `getLcuTaskStatusConfig`, `getLoudspeakerAlarmPage`, `getMeterOrDiaiInfoByDeviceId`, `getOfflineAlarmConfig`, `getProjectIdAndDeviceId`, `getRtuProjectConfigList`, `getShieldConfig`, `queryAIDIState`, `queryParameter`, `saveAgaConfig`, `saveConfig`, `saveConfigCable`, `saveConfigParamsDevices`, `saveConfigParamsMeterDevices`, `saveConfigParamsMeterNoPhaseDevices`, `saveConfigPower`, `saveLcuAccidentLightConfig`, `saveLcuBachOfflineConfig`, `saveLcuConfig`, `saveLcuNodeLostConfig`, `saveLcuTaskStatusConfig`, `saveManualAlarm`, `saveNewConfigParams`, `saveNewRtuConfig`, `saveNodeLostConfig`, `saveOfflineAlarmConfig`, `setAlarmRtu190Params`, `setNewAlarmRtuParams`, `setRtuDevices`, `setalarmCableInspectionParams`, `setalarmLcuParams`, `setalarmPowerParams`, `setalarmRtuParams`, `updateAlarmFollowUpStatus`, `updateShield`, `updateShieldConfig`
- DELETE: `deleteAlarmLog`

**`configExport`**
- POST: `exportAlarm`, `exportAlarmHis`

**`country`**
- GET: `deleteById/{param}`, `queryById/{param}`, `queryCountry`
- POST: `queryByName/{param}`, `save`, `update`

**`curyCompany`**
- GET: `getCuryCompanyById/{param}`, `queryCuryCompanyList`, `queryCuryCompanyListByGovernment`
- POST: `queryCuryCompanyPage`, `saveCuryCompany`, `updateCuryCompany`
- DELETE: `deleteCuryCompany`

**`curyGroup`**
- GET: `getCuryGroupById/{param}`, `queryCuryGroupList`, `queryCuryGroupOfCuryCompany/{param}`
- POST: `queryCuryGroupByCuryCompany`, `queryCuryGroupPage`, `queryUserByCuryGroupId`, `saveCuryGroup`, `updateCuryGroup`, `updateUserInCuryGroup`
- DELETE: `deleteCuryGroup`

**`custodyRecord`**
- GET: `getCustodyRecordById/{param}`
- POST: `delete`, `exportCustodyRecordStatistics`, `exportCustodyRecords`, `page`, `pageCustodyRecordStatistics`, `save`, `update`

**`dayun`**
- POST: `queryPage`, `queryTaskInfo`

**`delayOrder`**
- GET: `cancel/{param}`, `queryById/{param}`, `queryProcess/{param}`
- POST: `add`, `delete`, `excelAllPage`, `queryAllPage`, `queryPage`, `review`

**`device`**
- GET: `countDeviceNumByPid/{param}`, `countDeviceNumsOfProject/{param}`, `countTheDeviceNumberOfStates/{param}`, `getAntiDeviceDetailsInfo/{param}`, `getAppealCountByStatus/{param}`, `getCalculationConfig/{param}`, `getChargingByPid/{param}`, `getDevicesByPid/{param}`, `getLcuDeviceDetailsInfo/{param}`, `getShowingMastersDeviceDetailsInfo/{param}`
- POST: `boxSelectDeviceList`, `checkDeviceRelated`, `checkDeviceRelatedNew`, `connectAncillaryDevice`, `countDeviceNum`, `countDevicePage`, `countDeviceTotal`, `countTheDeviceNumberOfStatesHistory`, `countTheDeviceNumberOfStatesHistoryPage`, `deleteAlarmInformationOfPositioningDevice`, `deleteDeviceBatch`, `deleteDeviceStatesHistory`, `deviceStatesHistoryPage`, `disconnectAncillaryDevice`, `exportDeviceOverview`, `getBatchOpeFailedDevice`, `getDeviceByLatLng`, `getDeviceByLatLngAndModeId`, `getDeviceByLatLng_v1`, `getDeviceInfo`, `getDeviceLog`, `getLampModelByLatLng_v1`, `getLatlngByEquipment`, `lampNameOptimize`, `modifyCalculationConfig`, `placeDevice`, `queryAlarmInformationOfPositioningDevice`, `queryAncillaryDevice`, `queryAuthorizationCodeOfPositioningDevice`, `queryDeviceAndRelated`, `queryDeviceByProjectAndDeviceTypePage`, `queryDeviceInCuringArea`, `queryDeviceListInAlarmPage`, `queryDeviceModelAndDeviceCountByDeviceTypeAndPid`, `queryDeviceNamesOfTypeInProject`, `queryDeviceOverviewPage`, `queryDevicePage`, `queryInformationOfPositioningDevice`, `queryLuxDeviceList`, `queryNetworkStatusData`, `queryPoleByAncillaryDeviceMap`, `querySingleDeviceOverview`, `queryUnrelatedAncillaryDevice`, `queryplacedDeviceByName`, `searchDeviceOnMap`, `searchPositioningDeviceOnMapInVehicleMonitoring`, `setDeviceAreaAndRoad`, `setDeviceStatusOfUse`, `setElectricFence`, `setGisDisplay`, `setStatusOfElectricFence`, `updateDevice`, `updateDeviceLatLng`

**`device485Control`**
- POST: `deploy`, `deployDelete`, `deployQuery`

**`deviceActLog`**
- POST: `queryDeviceActLog`

**`deviceCameraPreset`**
- POST: `addRelationPresets`, `quertByCamera`, `queryByDeviceId`

**`deviceControl`**
- GET: `checkUpgradePoolOfProject/{param}`, `queryUpgradeProgress/{param}`
- POST: `addDeviceToUpgradePool`, `batchDeviceIdsUpgrade`, `configReset`, `deviceDebug`, `deviceDeployment`, `deviceGroupAlarmParamQuick`, `deviceGroupBatchOperationQuick`, `deviceGroupSystemParamQuick`, `deviceLogQuery`, `deviceProjectBatchOperationQuick`, `downloadCertificate`, `importCertificate`, `ipCheck`, `manualControl`, `oneClickRemovalOfLcuToBeUpgraded`, `opeSelectionInStepOne`, `queryCertificate`, `queryFrequency`, `queryLatlng`, `queryLightConParam`, `queryLightValue`, `queryManualControl`, `queryParam`, `queryQuickLight`, `queryRfVersion`, `queryTaskModeConfigParam`, `queryTime`, `queryUpgrade`, `queryUpgradePoolLcus`, `queryVersion`, `queryZoneId`, `removeDeviceOfUpgradePool`, `reset`, `restart`, `saveUpgradePoolSettings`, `seriDevStatQuery`, `setCommunicationParam`, `setLcuTaskModeConfigParamByGroup`, `setLightConParam`, `setLoraWanAlarmParam`, `setLoraWanDimMode`, `setLoraWanEnable`, `setMonitorDefaultParams`, `setParam`, `setTaskModeConfigParam`, `setTime`, `setZoneId`, `stop/upgrade`, `submitQuickLight`, `upgrade`, `upgrade/progress`, `upgradeAgain`, `upgradeFailList`, `upgrade_v2`

**`deviceExpor`**
- POST: `queryCustodyExporTypePage`, `queryCustodyGroupingExporTypePage`, `queryDeviceExporTypePage`, `queryFacilityExporTypePage`, `queryLightExporTypePage`

**`deviceGroup`**
- GET: `getSwitchTime/{param}`
- POST: `crossGroupSearch`, `deleteGroupDevice`, `deleteGroupIds`, `deleteGroupTask`, `deleteLcuGroupTask`, `deviceGroupPage`, `getGnumAndGroupId`, `getGroupById`, `queryDeviceGroupList`, `queryDeviceTaskPage`, `queryRadarGroupPage`, `queryStationLamp`, `save`, `saveGroupDevice`, `saveGroupTask`, `setSwitchTime`, `taskPublish`, `update`
- DELETE: `delete/{param}`

**`deviceImportOrExport`**
- GET: `downloadImportTemplate/{param}`, `downloadImportTemplateOfNonIotDevice/{param}`, `getImportStatus`
- POST: `exportDevice`, `exportDeviceCount`, `exportDeviceListInDeviceManagement`, `exportHistoricalTrendDataOfSensor`

**`deviceModel`**
- GET: `getDeviceModelByDeviceType/{param}`, `getModelByPid/{param}`, `queryAllDeviceModelByProjectId/{param}`, `queryDeviceModelAndTypeAndSystemAndFactoryById/{param}`, `queryDeviceModelByDeviceModelId/{param}`, `queryDeviceModelByDeviceTypeOfAllProjectInSecondAccount/{param}`, `queryDeviceModelsOfIndependentByPid/{param}`
- POST: `copyDeviceModel`, `delete`, `getDeviceModelByDeviceTypeId`, `getDeviceModelByPbSuppleyElectricity`, `getDeviceModelOfDtu`, `getDeviceModelPage`, `getNotInDeviceModelPage`, `initBuiltInDeviceModelsOfProject`, `queryDeviceModelByDeviceTypeAndProject`, `queryDeviceModelByDeviceTypeAndSystemConfig`, `queryDeviceModelsPage`, `save`, `saveNew`, `update`, `updateNew`, `useOrNo`

**`deviceOnline`**
- POST: `statisticsDeviceOnline`, `statisticsDeviceOnlinePage`

**`deviceOnlineRateExpor`**
- POST: `deviceOnlineRateExport`, `export`

**`deviceOverview`**
- POST: `getLcuLampOverviewExport`, `getLcuOverviewExport`, `getRtuOverviewDetails`, `getRtuOverviewExport`, `getSmartBoxOverviewDetails`, `smartBoxOverviewExport`

**`deviceSystemController`**
- GET: `queryDeviceSystemById/{param}`, `queryDeviceSystemList`
- POST: `delete`, `queryDeviceSystemPage`, `save`
- PUT: `update`

**`deviceTypeController`**
- GET: `queryAllDeviceTypeByProjectId/{param}`, `queryDeviceTypeById/{param}`, `queryDeviceTypeByProjectId/{param}`, `queryDeviceTypeList`, `queryDeviceTypeOfCarrierEquipment`, `queryDeviceTypeOfIndependentByProjectId/{param}`, `queryDeviceTypeOnMap`, `queryDeviceTypeOnMapOfProject/{param}`, `queryDeviceTypesWithUidOfProject/{param}`
- POST: `addRelated`, `delete`, `deletePictureById`, `deleteRelated`, `getOverViewDeviceTypes`, `queryAllDeviceType`, `queryDeviceTreeData`, `queryDeviceTypePage`, `queryDeviceTypesByProjectId`, `queryLinkageStrategyAlarmDeviceType`, `queryLinkageStrategySuperDeviceType`, `queryProtocolByDeviceId`, `querySupplyElecttricityDeviceType`, `save`, `update`

**`devOps`**
- POST: `deleteByIdList`, `getDevOpsById`, `getDevOpsList`, `saveDevOps`, `updateDevOps`

**`devOpsBasicData`**
- POST: `deleteByIdList`, `getDevOpsBasicDataList`, `getDevOpsBasicDataMap`, `saveDevOpsBasicData`

**`dictionary`**
- GET: `deleteById/{param}`, `queryDictionaryByKey/13`, `queryDictionaryByKey/15`, `queryDictionaryByKey/17`, `queryDictionaryByKey/18`, `queryDictionaryByKey/19`, `queryDictionaryByKey/20`, `queryDictionaryByKey/21`, `queryDictionaryByKey/25`, `queryDictionaryByKey/26`, `queryDictionaryByKey/27`, `queryDictionaryByKey/3`, `queryDictionaryByKey/33`, `queryDictionaryByKey/35`, `queryDictionaryByKey/48`, `queryDictionaryByKey/52`, `queryDictionaryByKey/sensitivity`, `queryDictionaryByKey/{param}`, `queryDictionaryByName/{param}`, `queryWorkFlowState/{param}`
- POST: `queryDictionaryPage`, `save`, `update`

**`dtuActor`**
- GET: `getBindDevice/{param}`, `getBindDeviceInfo/{param}`, `getBindDeviceOfPort/{param}`, `queryAllDtuByProjectId/{param}`, `querySerialPort/{param}`, `queryServerConfig/{param}`, `statisticsOfDtuByProjectId/{param}`
- POST: `bindDevice`, `delete`, `generateUserMeter`, `getAutoSendContent`, `getBindDeviceByDeviceType`, `getBindElectronicLockDeviceInfo`, `getBindMeterDeviceInfo`, `getBindSolarDeviceInfo`, `getBindSubDeviceInfo`, `getDtuAndMeterInfoList`, `queryConfig`, `queryDeviceAndRelated`, `queryPage`, `save`, `setAutoSendContent`, `setConfig`, `setSerialPort`, `setServerConfig`, `update`

**`dtuControl`**
- GET: `getRS485/{param}`, `getServer/{param}`, `getWanParam/{param}`, `setRS485/{param}`, `setServer/{param}`, `setWanParam/{param}`
- POST: `cleanContent`, `getDeploy`, `getHeartbeatDelay`, `queryContent`, `queryDeviceGps`, `queryUserMeterAdder`, `setDeploy`, `setHeartbeatDelay`, `syncContent`

**`dustbinActor`**
- GET: `getDustbinDataOnMap/{param}`
- POST: `deleteDeviceBatch`, `queryDeviceAndRelated`, `save`, `update`

**`dustbinCtrl`**
- POST: `register`, `submitParam`, `unRegister`

**`electricityBill`**
- POST: `getLcuBillData`, `getLcuBillDataDetails`, `getMeterBillData`, `getMeterBillDataDetails`, `getOverview`, `getTrend`

**`electronicLockActor`**
- GET: `queryDetailById/{param}`
- POST: `add`, `deleteDeviceBatch`, `getElectronicLockHisList`, `pageList`, `update`, `updateRtuId`

**`electronicLockCtrl`**
- POST: `lockCardDelete`, `lockCardQuery`, `lockCardSwipeQuery`, `lockCardWrite`, `lockCtrl`, `lockRepSet`, `lockStateGet`

**`energy`**
- POST: `getEnergySaveRate`, `getGatewayData`, `getKmOfPowerBoxData`, `getKmOfPowerBoxDataDetails`, `getKmOfPowerBoxDataTrend`, `getLcuData`, `getLcuDataArchived`, `getLcuDataDetails`, `getLcuDataTrend`, `getLcuEnergyNum`, `getLcuPeDataTrend`, `getMeterData`, `getMeterDataArchived`, `getMeterDataDetails`, `getMeterPeTrend`, `getMeterTrend`, `getOverview`, `getPowerBoxData`, `getSolarData`, `getSolarDataDetails`, `getSolarDataTrend`, `getSolarEnergyHisDetails`, `getSolarLcuData`, `getSolarLcuDataDetails`, `getSolarLcuDataTrend`, `getSolarLcuEnergyHisDetails`, `getTrend`, `initEmissionOfProject`, `statisticalRepairOfProject`
- DELETE: `deleteLcuConsumption`, `deleteMeterConsumption`

**`energyExport`**
- POST: `exportElectricityDetails`, `exportElectricityStatistics`, `exportEnergyDetails`, `exportEnergyStatistics`, `exportInnerMeterEnergyDetails`, `exportKmOfPowerBoxData`, `exportKmOfPowerBoxDataDetails`, `exportKmOfPowerBoxDataTrend`, `exportLcuEnergyDetails`, `exportLcuEnergyStatistics`, `exportMeterRecord`, `exportPowerBoxData`, `exportReports`, `exportSolarEnergyDetails`, `exportSolarEnergyHisDetails`, `exportSolarEnergyStatistics`, `exportSolarLcuEnergyDetails`, `exportSolarLcuEnergyHisDetails`, `exportSolarLcuEnergyStatistics`, `exportSolarLcuTrend`, `exportSolarTrend`, `getElectricityBillTrend`, `getEnergySaveRate`, `getOverview`, `getTrend`

**`equipment`**
- GET: `getEquipmentById/{param}`
- POST: `queryEquipment`, `queryEquipmentPage`, `queryEquipmentPoint`, `saveEquipment`, `saveEquipmentPoint`, `updateEquipment`
- DELETE: `deleteBatchEquipmentPointDevice`, `deleteEquipment`

**`equipmentAbnormal`**
- GET: `queryEquipmentAbnormalByOrderId/{param}`, `queryequipmentAbnormalById/{param}`
- POST: `deleteOperationAbnormalBatch`, `exportEquipmentAbnormalPage`, `ignoreOperationAbnormalBatch`, `queryEquipmentAbnormalPage`, `save`, `selectEquipmentAbnormal`, `update`

**`factoryController`**
- GET: `queryFactoryById/{param}`, `queryFactoryList`
- POST: `delete`, `queryAllFactoriesPage`, `save`
- PUT: `update`

**`fems`**
- POST: `rpc/turnOff`, `rpc/turnOn`

**`fireAlarmActor`**
- POST: `queryFireAlarm`, `queryFireAlarmHis`, `releaseAlarm`

**`fogPile`**
- GET: `getDataOnMapPanel/{param}`
- POST: `deleteDeviceBatch`, `queryDeviceAndRelated`, `save`, `saveOrUpdateFogPileInfo`, `update`

**`gatewayActor`**
- GET: `getBindDevice/{param}`, `getBindDeviceInfo/{param}`, `querySerialPort/{param}`, `queryServerConfig/{param}`
- POST: `bindDevice`, `deleteDeviceBatch`, `gatewaySyncPage`, `pageList`, `queryConfig`, `queryDeviceAndRelated`, `queryGatewayOfProject`, `queryPage`, `queryRelatedGatewayOfDirectory`, `queryRelatedGatewayPage`, `queryUnrelatedGatewayPage`, `save`, `setConfig`, `setSerialPort`, `setServerConfig`, `update`

**`gatewayControl`**
- GET: `getDHCPParam/{param}`, `getLanDHCPDev/{param}`, `getLanParam/{param}`, `getRS485/{param}`, `getServer/{param}`, `getWanParam/{param}`, `setCallInfo//{param}`, `setCallStream/{param}`, `setDHCPParam/{param}`, `setDeviceRS485/{param}`, `setEnvSensorInfo/{param}`, `setIPCInfo/{param}`, `setLanParam/{param}`, `setRS485/{param}`, `setServer/{param}`, `setWanParam/{param}`
- POST: `ctrlBroadcast`, `ctrlCallStream`, `ctrlFogPile`, `getTermInfo`, `setBroadcastConfig`, `setDeviceRS485`, `setTimeCtrlParam`, `setWebPwd`, `syncDevice`

**`groupCtrl`**
- POST: `deleteGroupInfo`, `deleteRtuGroupInfo`, `queryGroupInfo`, `setRtuConfig`, `setRtuGroupInfo`, `submitGroupInfo`

**`groupLcuImport`**
- POST: `uploadImportTemplate`

**`historyQuery`**
- POST: `clearHistoryQuery`

**`illegalDeviceLoginRecord`**
- POST: `deleteRecord`, `getRecordPage`

**`illegalDeviceLoginRecordExport`**
- POST: `exportRecordPage`

**`informatrion`**
- POST: `checkInformationMap`, `deleteInformationMap`, `queryInformationMap`, `save`, `update`

**`inspectionOrder`**
- GET: `queryById/{param}`, `queryOrderHandleInfo/{param}`, `queryProcess/{param}`
- POST: `completeOrderRoad`, `delete`, `exportAllPage`, `exportPage`, `queryAllPage`, `queryPage`, `review`, `transferOrder`, `updateState`

**`inspectionPlan`**
- GET: `queryById/{param}`, `queryProcess/{param}`
- POST: `add`, `delete`, `exportAllPage`, `exportPage`, `queryAllPage`, `queryPage`, `reSubmit`, `review`, `update`, `updateState`

**`kmActor`**
- POST: `getGroupKmByRtuId`, `getKmsOfRtuPage`, `powerSupplyDisplaySettings`, `queryKmByRtuId`, `queryKmHisByRtu`, `queryKmsByRtuId`, `queryProjectKm`, `queryProjectKmByColumn`, `queryUnRelatedKmOfRtu`

**`kmControl`**
- POST: `kmBatchOperation`, `kmGroupBatchOperation`, `kmProjectBatchOperation`, `queryStatus`, `queryStatusByGroup`, `queryStatusByProject`, `turnOff`, `turnOffByGroup`, `turnOffByProject`, `turnOn`, `turnOnByGroup`, `turnOnByProject`

**`kmDetectActor`**
- GET: `getKmDetectById/{param}`
- POST: `associatedPowerBox`, `delete`, `pageList`, `save`, `update`, `updateRtuId`

**`lampControl`**
- POST: `broadcast/project/dimming`, `broadcast/project/queryData`, `broadcast/project/queryStatus`, `broadcast/project/turnOff`, `broadcast/project/turnOn`, `broadcast/rtu/dimming`, `broadcast/rtu/queryData`, `broadcast/rtu/queryStatus`, `broadcast/rtu/turnOff`, `broadcast/rtu/turnOn`, `group/project/dimming`, `group/project/queryData`, `group/project/queryStatus`, `group/project/turnOff`, `group/project/turnOn`, `group/rtu/dimming`, `group/rtu/queryData`, `group/rtu/queryStatus`, `group/rtu/turnOff`, `group/rtu/turnOn`, `lcuBatchOperation`, `lcuGroupBatchOperation`, `lcuGroupBatchOperationQuick`, `lcuProjectBatchOperation`, `lcuProjectBatchOperationQuick`, `queryDALI`, `rtuBroadcastBatchOperation`, `rtuGroupBatchOperation`, `solarGroupBatchOperation`, `solarLcuGroupBatchOperationQuick`, `unicast/dimming`, `unicast/queryData`, `unicast/queryStatus`, `unicast/turnOff`, `unicast/turnOn`

**`lampOnOffConfigActor`**
- POST: `add`, `delete`, `getList`

**`langActor`**
- GET: `queryLangListByAgencyId/{param}`, `queryList`
- POST: `bindLanguage`, `save`
- DELETE: `delete/{param}`

**`lcuActor`**
- GET: `queryAllLcuByProjectId/{param}`, `queryDisplaceById/{param}`, `queryLcuAndRelatedByLcuId/{param}`, `queryLcuAndRelatedByUid/{param}`, `queryLcuDeatilById/{param}`, `queryLcuListByGatewayId/{param}`, `queryLcuListByParenDeviceId/{param}`, `statisticsOfLcuByProjectId/{param}`, `statisticsOfLcuIntervalTimeByProjectId/{param}`, `statisticsOfNonDirectLcuByProjectId/{param}`
- POST: `addLcuToWhiteSpace`, `bindPole`, `configLcu`, `delete`, `deleteLcuLog`, `getConfigLcuList`, `getLcuByStatus`, `getLcuListByProjectId`, `getLcuLogPage`, `getLcuRealtionSmartBoxOrRtu`, `getLcuSunCheckResults`, `getLcuSunRiseAndSetPage`, `getPolesByLcuLatLng`, `llLcuAllPage`, `mapLcuPageList`, `page`, `queryLampNumberOfLcu`, `queryLcuDataHisPage`, `queryLcuDataRecords`, `queryLcuInWhiteSpace`, `queryLcuLightingHis`, `queryLcuNotAssociatedWithPole`, `queryLcuOfGatewayPage`, `queryLcuOfRtuPage`, `queryLcuOutsideWhiteSpace`, `queryNormalLcu`, `queryNormalLcuByRtusPage`, `queryParamById`, `queryRelatedLcuOfDirectory`, `queryRelatedLcuPage`, `queryUnrelatedLcuPage`, `removeLcuFromWhiteSpace`, `save`, `update`, `updateConnectSmartBox`, `updateParamById`, `updateRtuId`
- PUT: `associateLcuWithRtu`, `dissociateLcuFromRtu`

**`lcuAttributionActor`**
- POST: `queryLcuGroup`, `queryLcuGroupHis`

**`lcuDataRecordsExport`**
- POST: `exportLcuDataRecordsPage`

**`lcuExpor`**
- POST: `newExportLcuMap`

**`lcuGpsQueryConfig`**
- POST: `queryLcuGpsQueryConfig`, `setLcuGpsQueryConfig`

**`lcuLight`**
- POST: `queryLcuDataReportRateDetails`, `queryLcuDataReportRateDetailsPage`, `queryLcuLightByLcuIdAndNum`, `queryLcuLightDataReportRate`, `updateLabel`

**`lcuRoute`**
- POST: `exportRouteConfig`, `queryByParam`, `queryLcuByRtuId`, `queryRouteTopologyOfDevice`, `saveLcuRoute`
- DELETE: `deleteLcuRoute`

**`lcuRouteControl`**
- GET: `delLcuRoute/{param}`, `queryLcuRoute/{param}`

**`lcuTaskCtrl`**
- POST: `cleanGroup`, `deleteTask`, `deleteTask_v2`, `groupBatchOperationLatlng`, `groupBatchOperationTask`, `lieraGroupBatchOperationTask`, `lieraGroupBatchOperationTaskEnable`, `lieraProjectBatchOperationSummerOffset`, `projectBatchOperationLatlng`, `projectBatchOperationSummerOffset`, `queryGroup`, `queryLatLngTask`, `querySummerOffset`, `queryTask`, `queryTaskEnable`, `queryTimeTask`, `setLatLngDatas`, `setSummerOffset`, `setTask`, `setTaskEnable`, `setTask_v2`, `submitGroup`

**`lcuTaskExport`**
- POST: `exportLcuTask`

**`lcuTaskImport`**
- GET: `getImportStatus`

**`lierdaCtrl`**
- GET: `getLierdaGatewayInfo/{param}`
- POST: `addGroupToProject`, `addNSGateway`, `addNSHttpEndpoints`, `addNSProject`, `addNodeToGroup`, `deleteNSGateway`, `deleteNSProject`, `getGateway`, `getNSBand`, `queryFreq`, `queryNSProjectData`, `updateLierdaGateway`

**`lierdaGroupControl`**
- POST: `lcuGroupBatchOperationLatLng`, `lcuGroupBatchOperationQuick`

**`lierdaProjectActor`**
- POST: `getBandNameList`, `getGatewayInfo`, `getLcuOfNSProjectPage`, `getNsGatewayList`, `getNsProjectList`

**`LightningProtectionActor`**
- GET: `queryDetailById/{param}`
- POST: `add`, `deleteDeviceBatch`, `pageList`, `update`, `updateRtuId`

**`lightningProtectionCtrl`**
- POST: `lightningGet`

**`linkageStrategyActor`**
- POST: `addOfRtu`, `delete`, `deleteOfRtu`, `getCableInspectionLoopOfRtu`, `getKmsOfRtuId`, `getLinkageStrategyById`, `getLinkageStrategyOfRtuById`, `getStrategyLoopOfRtu`, `queryLinkageHisOfAlarm`, `queryLinkageHisPage`, `queryLinkageStrategyList`, `queryStrategyCameraList`, `queryStrategyCameraPresetList`, `queryStrategyKmList`, `querySuperDevicePage`, `save`, `update`, `updateOfRtu`

**`loudspeakerActor`**
- POST: `deleteDeviceBatch`, `editLoudspeakerActStatus`, `editLoudspeakerVolume`, `getBxLoudspeakerPage`, `pageList`, `queryDeviceAndRelated`, `queryLoudspeakerBx`, `queryLoudspeakerList`, `save`, `svaeBxLoudspeaker`, `syncBxLoudspeaker`, `update`, `updateGatewayUid`

**`loudspeakerbxTask`**
- GET: `getTaskById/{param}`
- POST: `add`, `delete`, `page`, `update`

**`luxActor`**
- GET: `getLuxById/{param}`, `statisticsOfLuxByProjectId/{param}`
- POST: `deleteNew`, `getByProjectId`, `getLuxHisList`, `pageList`, `queryLightControl`, `queryMaxLight`, `queryRelatedLuxOfDirectory`, `queryRelatedLuxPage`, `queryRtuByluxId`, `queryUnrelatedLuxPage`, `saveNew`, `saveOrUpdateLuxAutoQuery`, `saveRtuLuxRelation`, `updateNew`, `updateRtuId`, `updateTaskModeConfig`

**`luxCtrl`**
- POST: `compareLatLng`, `lcuSubmitLatLng`, `queryLatLng`, `queryLatLngEnable`, `queryLcuLatLng`, `queryLux`, `setLatLngEnable`, `submitLatLng`, `submitLux`

**`luxGroupActor`**
- POST: `deleteLuxGroupDevice`, `deleteNew`, `getRtusList`, `page`, `queryAllLuxPage`, `queryLuxGroupLuxsById`, `queryLuxGroupRtusById`, `save`, `saveLuxGroupDevice`, `updateNew`


> Tiếp phần controller **m–z** ở `04c-api-methods-2.md`.
