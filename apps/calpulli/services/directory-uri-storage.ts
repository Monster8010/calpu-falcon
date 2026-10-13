import AsyncStorage from "@react-native-async-storage/async-storage";

const DIRECTORY_URI_KEY = "@calpulli/calpulli/shared-directory-uri";

export async function loadDirectoryUri(): Promise<string | null> {
  const storedUri = await AsyncStorage.getItem(DIRECTORY_URI_KEY);
  const normalizedUri = storedUri?.trim();
  return normalizedUri ? normalizedUri : null;
}

export function saveDirectoryUri(directoryUri: string): Promise<void> {
  return AsyncStorage.setItem(DIRECTORY_URI_KEY, directoryUri);
}

export function removeDirectoryUri(): Promise<void> {
  return AsyncStorage.removeItem(DIRECTORY_URI_KEY);
}
