import DeviceTab from './Devices';

// Mỗi tab con của nhóm Thiết bị = một loại thiết bị (giống tab LCU).
export const Rtu = () => <DeviceTab cat="rtu" />;
export const Gateway = () => <DeviceTab cat="gateway" />;
export const SmartBox = () => <DeviceTab cat="smartbox" />;
export const Sensor = () => <DeviceTab cat="sensor" />;
export const Meter = () => <DeviceTab cat="meter" />;
export const Camera = () => <DeviceTab cat="camera" />;
export const Other = () => <DeviceTab cat="other" />;
