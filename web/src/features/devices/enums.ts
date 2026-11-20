/** Các trường deviceConfig là enum → key dictionary (docs/15 §4; lampTypes/powerTypes đã đối chiếu với dữ liệu thật: 4=Led Lamp, 3=Constant Current Drive Power). */
export const ENUM_KEYS_STATIC: Record<string, number> = { lampTypes: 3, powerTypes: 17, meterType: 21, rtuType: 99, gatewayTypes: 119, poleArmType: 55 };
