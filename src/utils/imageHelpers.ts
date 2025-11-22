import * as ImagePicker from 'expo-image-picker';
import { requestCameraPermissionsAsync } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


export async function pickImageFromGallery() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error('Gallery permission denied');

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}


export async function takePhotoWithCamera() {
  const permission = await requestCameraPermissionsAsync();
  if (!permission.granted) throw new Error('Camera permission denied');

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}


export async function persistImage(uri: string) {
  const extMatch = /\.(\w+)$/.exec(uri);
  const ext = extMatch ? extMatch[1] : 'jpg';

  const filename = `${Date.now()}.${ext}`;

  const documentDir = (FileSystem as any).documentDirectory as string;

  const dest = `${documentDir}${filename}`;

  try {
    await FileSystem.copyAsync({
      from: uri,
      to: dest,
    });

    return dest;
  } catch (error) {
    console.warn('Image copy failed, returning original URI:', error);
    return uri;
  }
}
