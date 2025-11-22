import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Image, Alert, ScrollView, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Appnavigator';
import { getCurrentUser, addNoteForUser, getNotesForUser, updateNoteForUser } from '../utils/storage';
import { Note } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';
import * as ImageHelpers from '../utils/imageHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteEditor'>;

export default function NoteEditor({ route, navigation }: Props) {
  const mode = route.params?.mode ?? 'create';
  const noteId = route.params?.noteId as string | undefined;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setUsername(user);
      if (mode === 'edit' && user && noteId) {
        const notes = await getNotesForUser(user);
        const n = notes.find(x => x.id === noteId);
        if (n) {
          setTitle(n.title);
          setBody(n.body);
          setImageUri(n.imageUri);
        }
      }
    })();
  }, [mode, noteId]);

  const pickFromGallery = async () => {
    try {
      const uri = await ImageHelpers.pickImageFromGallery();
      if (!uri) return;
      setLoading(true);
      const saved = await ImageHelpers.persistImage(uri);
      setImageUri(saved);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to pick image');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      const uri = await ImageHelpers.takePhotoWithCamera();
      if (!uri) return;
      setLoading(true);
      const saved = await ImageHelpers.persistImage(uri);
      setImageUri(saved);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to take photo');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    Alert.alert('Remove Image', 'Are you sure you want to remove this image?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setImageUri(undefined),
      },
    ]);
  };

  const onSave = async () => {
    if (!username) {
      Alert.alert('Error', 'No user logged in');
      return;
    }
    if (!title.trim() && !body.trim()) {
      Alert.alert('Error', 'Please write a title or body');
      return;
    }
    const now = Date.now();

    if (mode === 'create') {
      const newNote: Note = {
        id: uuidv4(),
        title: title.trim() || 'Untitled',
        body: body.trim(),
        imageUri,
        createdAt: now,
        updatedAt: now,
      };
      await addNoteForUser(username, newNote);
      navigation.goBack();
    } else {
      const notes = await getNotesForUser(username);
      const old = notes.find(n => n.id === noteId);
      if (!old) {
        Alert.alert('Error', 'Note not found');
        return;
      }
      const updated: Note = {
        ...old,
        title: title.trim() || 'Untitled',
        body: body.trim(),
        imageUri,
        updatedAt: now,
      };
      await updateNoteForUser(username, updated);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'create' ? 'New Note' : 'Edit Note'}
        </Text>
        <TouchableOpacity 
          onPress={onSave} 
          style={styles.saveButton}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputSection}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter note title..."
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.bodyInput}
            value={body}
            onChangeText={setBody}
            placeholder="Start writing your note..."
            placeholderTextColor="#64748B"
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Image</Text>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image 
                source={{ uri: imageUri }} 
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageIcon}>🖼️</Text>
              <Text style={styles.noImageText}>No image attached</Text>
            </View>
          )}
          <View style={styles.imageButtonsRow}>
            <TouchableOpacity 
              style={styles.imageButton}
              onPress={pickFromGallery}
              disabled={loading}
            >
              <Text style={styles.imageButtonIcon}>📁</Text>
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.imageButton}
              onPress={takePhoto}
              disabled={loading}
            >
              <Text style={styles.imageButtonIcon}>📷</Text>
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },

  backButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  saveButton: {
    paddingVertical: 8,
    paddingLeft: 12,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
  },

  inputSection: {
    marginBottom: 28,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  titleInput: {
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  bodyInput: {
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#E2E8F0',
    minHeight: 200,
    lineHeight: 24,
  },

  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },

  imagePreview: {
    width: '100%',
    height: 240,
  },

  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeImageText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },

  noImageContainer: {
    height: 160,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },

  noImageIcon: {
    fontSize: 48,
    marginBottom: 8,
    opacity: 0.5,
  },

  noImageText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },

  imageButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },

  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    paddingVertical: 14,
    borderRadius: 12,
  },

  imageButtonIcon: {
    fontSize: 20,
  },

  imageButtonText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
  },
});