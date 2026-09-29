import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function SignUpScreen() {
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUp = async () => {
    setErrorMessage(null);
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const result = await signup({
      name,
      email,
      phone: '+63 917 555 1928',
      password,
      spicePreference: 'fiery',
      favoriteDistrict: 'Centro',
    });

    if (result.success) {
      router.replace('/');
    } else if (result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleGoogleSignUp = async () => {
    const result = await signup({
      name: 'Maria Santos',
      email: 'maria.santos@gmail.com',
      phone: '+63 917 555 1928',
      spicePreference: 'fiery',
      favoriteDistrict: 'Centro',
    });

    if (result.success) {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Minimal Icon-Only Back Button */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backIconButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          bounces={false}
        >
          <View style={styles.mainContainer}>
            {/* Editorial Title */}
            <View style={styles.titleSection}>
              <Text style={styles.headingSans}>
                Create your <Text style={styles.headingSerif}>account</Text>
              </Text>
              <Text style={styles.subheadText}>
                Sign up to discover authentic local eats and curated spots.
              </Text>
            </View>

            {/* Error Banner */}
            {errorMessage && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Input Stack with Subtle Grey Labels */}
            <View style={styles.inputStack}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter your full name"
                    placeholderTextColor="#AEAEB2"
                    style={styles.textInput}
                    autoCapitalize="words"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor="#AEAEB2"
                    style={styles.textInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    clearButtonMode="while-editing"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Create a password (6+ characters)"
                    placeholderTextColor="#AEAEB2"
                    style={[styles.textInput, styles.passwordInput]}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.eyeButton}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
                  >
                    <Ionicons
                      name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#8E8E93"
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Primary Action Button */}
            <Pressable
              onPress={handleSignUp}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.primaryButton,
                isLoading && styles.buttonDisabled,
                pressed && styles.primaryPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Create Account"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google 1-Tap Sign Up */}
            <Pressable
              onPress={handleGoogleSignUp}
              disabled={isLoading}
              style={({ pressed }) => [styles.googleButton, pressed && styles.googlePressed]}
              accessibilityRole="button"
              accessibilityLabel="Sign up with Google"
            >
              <Ionicons name="logo-google" size={17} color="#EA4335" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>

            {/* Legal Notice */}
            <Text style={styles.legalNotice}>
              By joining, you agree to our Terms & Privacy Policy.
            </Text>

            {/* Switch to Sign In */}
            <View style={styles.footerSection}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable
                onPress={() => router.push('/login')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Navigate to sign in screen"
              >
                <Text style={styles.footerLink}> Log In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const serifFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, "Times New Roman", serif',
  default: 'Georgia',
});

const sansFamily = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  default: 'system-ui',
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 2 : 6,
    paddingBottom: 0,
  },
  backIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 0,
  },
  mainContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 22,
  },

  // Title
  titleSection: {
    marginBottom: 14,
  },
  headingSans: {
    fontFamily: sansFamily,
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.8,
  },
  headingSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 30,
    fontWeight: '400',
    color: '#000000',
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
    lineHeight: 18,
  },

  // Error Banner
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    gap: 6,
  },
  errorText: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#FF3B30',
    flex: 1,
    fontWeight: '500',
  },

  // Input Fields
  inputStack: {
    gap: 10,
    marginBottom: 14,
  },
  fieldGroup: {
    gap: 3,
  },
  fieldLabel: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '500',
    color: '#6E6E73', // Subtle medium gray
    letterSpacing: -0.1,
  },
  inputWrapper: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textInput: {
    fontFamily: sansFamily,
    fontSize: 15,
    color: '#000000',
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  passwordInput: {
    paddingRight: 6,
  },
  eyeButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Primary Button
  primaryButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  primaryButtonText: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  dividerText: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginHorizontal: 8,
  },

  // Google Button
  googleButton: {
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  googleButtonText: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  googleIcon: {
    marginRight: 8,
  },
  googlePressed: {
    backgroundColor: '#F2F2F7',
  },

  // Legal Notice
  legalNotice: {
    fontFamily: sansFamily,
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 8,
  },

  // Footer
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  footerText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
  },
  footerLink: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#000000',
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.5,
  },
});
