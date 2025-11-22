import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, User } from './types';

const USERS_KEY = 'USERS';
const CURRENT_USER_KEY = 'CURRENT_USER';
const NOTES_KEY_PREFIX = 'NOTES_';

export async function getUsers(): Promise<User[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function addUser(user: User) {
  const users = await getUsers();
  users.push(user);
  await saveUsers(users);
}

export async function setCurrentUser(username: string | null) {
  if (username) {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ username }));
  } else {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }
}

export async function getCurrentUser() : Promise<string | null> {
  const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    return obj.username ?? null;
  } catch {
    return null;
  }
}

export async function getNotesForUser(username: string): Promise<Note[]> {
  const raw = await AsyncStorage.getItem(NOTES_KEY_PREFIX + username);
  return raw ? JSON.parse(raw) : [];
}

export async function saveNotesForUser(username: string, notes: Note[]) {
  await AsyncStorage.setItem(NOTES_KEY_PREFIX + username, JSON.stringify(notes));
}

export async function addNoteForUser(username: string, note: Note) {
  const notes = await getNotesForUser(username);
  notes.unshift(note); 
  await saveNotesForUser(username, notes);
}

export async function updateNoteForUser(username: string, note: Note) {
  const notes = await getNotesForUser(username);
  const idx = notes.findIndex(n => n.id === note.id);
  if (idx >= 0) {
    notes[idx] = note;
    await saveNotesForUser(username, notes);
  }
}

export async function deleteNoteForUser(username: string, noteId: string) {
  const notes = await getNotesForUser(username);
  const filtered = notes.filter(n => n.id !== noteId);
  await saveNotesForUser(username, filtered);
}
