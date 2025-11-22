import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getUsers, setCurrentUser } from '../utils/storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Appnavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function AuthLogin({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!username || !pin) {
      Alert.alert('Error', 'Please enter username and PIN/password');
      return;
    }

    setLoading(true);

    const users = await getUsers();
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user || user.pin !== pin) {
      setLoading(false);
      Alert.alert('Error', 'Invalid username or PIN');
      return;
    }

    await setCurrentUser(user.username);

    navigation.reset({ index: 0, routes: [{ name: 'NotesList' }] });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📝</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to your notes</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PIN / Password</Text>
            <TextInput
              placeholder="Enter your PIN or password"
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#6B7280"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={onLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={styles.secondaryButton}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },

  icon: {
    fontSize: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#1E293B',
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#334155',
    padding: 16,
    fontSize: 16,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
  },

  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },

  dividerText: {
    color: '#64748B',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#334155',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#E2E8F0',
    fontWeight: '600',
    fontSize: 16,
  },
});