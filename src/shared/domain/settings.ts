/** Key-value settings. Values are typed per key. */
export type SettingsValues = {
  mainProgramId: string;
  lastExportAt: string;
};

export type SettingKey = keyof SettingsValues;

export type SettingRecord<K extends SettingKey = SettingKey> = {
  key: K;
  value: SettingsValues[K];
};
