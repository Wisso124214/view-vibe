import { Device } from '@capacitor/device';

export async function getIdDevice() {
  const id = await Device.getId();
  return id;
}