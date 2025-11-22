import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthLogin from './screens/AuthLogin';
import AuthSignUp from './screens/AuthSignUp';
import NotesList from './screens/NotesList';
import NoteEditor from './screens/NoteEditor';
import NoteDetail from './screens/NoteDetail';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  NotesList: undefined;
  NoteEditor: { mode: 'create' | 'edit'; noteId?: string } | undefined;
  NoteDetail: { noteId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={AuthLogin} options={{ title: 'Login' }} />
      <Stack.Screen name="SignUp" component={AuthSignUp} options={{ title: 'Sign Up' }} />
      <Stack.Screen name="NotesList" component={NotesList} options={{ title: 'Your Notes' }} />
      <Stack.Screen name="NoteEditor" component={NoteEditor} options={{ title: 'Create / Edit Note' }} />
      <Stack.Screen name="NoteDetail" component={NoteDetail} options={{ title: 'Note' }} />
    </Stack.Navigator>
  );
}
