import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Note } from '../utils/types';

type Props = {
  note: Note;
  onPress: () => void;
  onDelete?: () => void;
};

export const NoteItem: React.FC<Props> = ({ note, onPress, onDelete }) => {
  const preview = note.body?.slice(0, 80) + (note.body.length > 80 ? '...' : '');
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {note.imageUri ? (
        <Image source={{ uri: note.imageUri }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholder]}>
          <Text style={{ fontSize: 10 }}>No Image</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.preview}>{preview}</Text>
        <Text style={styles.date}>{new Date(note.updatedAt).toLocaleString()}</Text>
      </View>
      {onDelete ? (
        <TouchableOpacity onPress={onDelete} style={styles.delBtn}>
          <Text style={{ color: 'red' }}>Delete</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 10, alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  thumbnail: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#ddd' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, marginLeft: 10 },
  title: { fontWeight: '700', fontSize: 16 },
  preview: { color: '#555', marginTop: 4 },
  date: { color: '#999', marginTop: 6, fontSize: 12 },
  delBtn: { paddingHorizontal: 8, paddingVertical: 4 },
});
