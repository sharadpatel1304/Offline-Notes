import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Appnavigator';
import { getCurrentUser, getNotesForUser } from '../utils/storage';
import { Note } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteDetail'>;

export default function NoteDetail({ route, navigation }: Props) {
  const noteId = route.params.noteId;
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) return;
      const notes = await getNotesForUser(user);
      const n = notes.find(x => x.id === noteId);
      setNote(n ?? null);
    })();
  }, [noteId]);

  if (!note) {
    return (
      <View style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundIcon}>🔍</Text>
          <Text style={styles.notFoundText}>Note not found</Text>
        </View>
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{note.title}</Text>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Last updated</Text>
              <Text style={styles.metaValue}>{formatDate(note.updatedAt)}</Text>
            </View>
            {note.createdAt !== note.updatedAt && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Created</Text>
                <Text style={styles.metaValue}>{formatDate(note.createdAt)}</Text>
              </View>
            )}
          </View>
        </View>

        {note.imageUri && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: note.imageUri }} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {note.body ? (
          <View style={styles.bodyContainer}>
            <Text style={styles.body}>{note.body}</Text>
          </View>
        ) : (
          <View style={styles.emptyBody}>
            <Text style={styles.emptyBodyText}>No content</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('NoteEditor', { mode: 'edit', noteId: note.id })}
          activeOpacity={0.8}
        >
          <Text style={styles.editButtonIcon}>✏️</Text>
          <Text style={styles.editButtonText}>Edit Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  header: {
    padding: 24,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: 16,
    letterSpacing: -0.5,
  },

  meta: {
    flexDirection: 'row',
    gap: 20,
  },

  metaItem: {
    flex: 1,
  },

  metaLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  metaValue: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },

  imageContainer: {
    marginTop: 20,
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },

  image: {
    width: '100%',
    height: 280,
  },

  bodyContainer: {
    padding: 24,
  },

  body: {
    fontSize: 16,
    lineHeight: 26,
    color: '#CBD5E1',
    letterSpacing: 0.2,
  },

  emptyBody: {
    padding: 24,
    alignItems: 'center',
  },

  emptyBodyText: {
    fontSize: 15,
    color: '#64748B',
    fontStyle: 'italic',
  },

  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notFoundIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },

  notFoundText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '600',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    padding: 20,
  },

  editButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },

  editButtonIcon: {
    fontSize: 18,
  },

  editButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});