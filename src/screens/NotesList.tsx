import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { Note } from '../utils/types';
import { getCurrentUser, getNotesForUser, deleteNoteForUser, setCurrentUser } from '../utils/storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Appnavigator';
import { NoteItem } from '../components/NoteItem';
import { SearchSortBar } from '../components/SearchSortBar';

type Props = NativeStackScreenProps<RootStackParamList, 'NotesList'>;

type SortOption = 'updatedDesc' | 'updatedAsc' | 'titleAsc' | 'titleDesc';

export default function NotesList({ navigation }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('updatedDesc');

  const load = useCallback(async () => {
    const user = await getCurrentUser();
    setUsername(user);
    if (!user) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      return;
    }
    const n = await getNotesForUser(user);
    setNotes(n);
  }, [navigation]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      load();
    });
    load();
    return unsub;
  }, [navigation, load]);

  const onDelete = (id: string) => {
    Alert.alert('Delete note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!username) return;
          await deleteNoteForUser(username, id);
          await load();
        },
      },
    ]);
  };

  const onLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await setCurrentUser(null);
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const filteredAndSorted = notes
    .filter(n => {
      const s = search.trim().toLowerCase();
      if (!s) return true;
      return n.title.toLowerCase().includes(s) || n.body.toLowerCase().includes(s);
    })
    .sort((a, b) => {
      switch (sort) {
        case 'updatedDesc':
          return b.updatedAt - a.updatedAt;
        case 'updatedAsc':
          return a.updatedAt - b.updatedAt;
        case 'titleAsc':
          return a.title.localeCompare(b.title);
        case 'titleDesc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>My Notes</Text>
            <Text style={styles.headerSubtitle}>
              {username ? `@${username}` : 'Loading...'}
            </Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SearchSortBar 
        search={search} 
        setSearch={setSearch} 
        sort={sort} 
        setSort={(s) => setSort(s)} 
      />

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'note' : 'notes'}
        </Text>
      </View>

      {filteredAndSorted.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>
            {search ? 'No notes found' : 'No notes yet'}
          </Text>
          <Text style={styles.emptyText}>
            {search 
              ? 'Try a different search term' 
              : 'Create your first note to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSorted}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteItem
              note={item}
              onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
              onDelete={() => onDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NoteEditor', { mode: 'create' })}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  header: {
    backgroundColor: '#1E293B',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },

  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },

  logoutText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },

  stats: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  statsText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  fabIcon: {
    fontSize: 32,
    color: '#0F172A',
    fontWeight: '300',
    marginTop: -2,
  },
});