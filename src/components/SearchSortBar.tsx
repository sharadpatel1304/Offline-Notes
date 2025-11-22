import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

type SortOption = 'updatedDesc' | 'updatedAsc' | 'titleAsc' | 'titleDesc';

type Props = {
  search: string;
  setSearch: (s: string) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
};

export const SearchSortBar: React.FC<Props> = ({ search, setSearch, sort, setSort }) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search title or body..."
        style={styles.input}
      />
      <View style={styles.row}>
        <Text style={{ marginRight: 8 }}>Sort:</Text>
        <TouchableOpacity onPress={() => setSort('updatedDesc')} style={styles.option}>
          <Text style={sort === 'updatedDesc' ? styles.selected : undefined}>Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSort('updatedAsc')} style={styles.option}>
          <Text style={sort === 'updatedAsc' ? styles.selected : undefined}>Oldest</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSort('titleAsc')} style={styles.option}>
          <Text style={sort === 'titleAsc' ? styles.selected : undefined}>A→Z</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSort('titleDesc')} style={styles.option}>
          <Text style={sort === 'titleDesc' ? styles.selected : undefined}>Z→A</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#fafafa', borderBottomWidth: 1, borderColor: '#eee' },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', alignItems: 'center' },
  option: { marginRight: 10, padding: 6 },
  selected: { fontWeight: '700' },
});
