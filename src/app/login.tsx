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

export default function LoginScreen() {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('maria.santos@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    setErrorMessage(null);
    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      router.replace('/');
    } else if (result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await login('maria.santos@gmail.com', 'google-auth');
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
        >
          <View style={styles.mainContainer}>
            {/* Editorial Title */}
            <View style={styles.titleSection}>
              <Text style={styles.headingSans}>
                Welcome <Text style={styles.headingSerif}>back</Text>
              </Text>
              <Text style={styles.subheadText}>
                Sign in to continue exploring the best tastes in Naga.
              </Text>
            </View>

            {/* Error Banner */}
            {errorMessage && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Email & Password Input Fields with Field Labels */}
            <View style={styles.inputStack}>
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
                    placeholderTextColor="#8E8E93"
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
                    placeholder="Enter your password"
                    placeholderTextColor="#8E8E93"
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
                      size={20}
                      color="#8E8E93"
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Forgot Password Link */}
            <View style={styles.forgotPasswordRow}>
              <Pressable
                onPress={() => router.push('/forgot-password')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </Pressable>
            </View>

            {/* Primary Sign In Button */}
            <Pressable
              onPress={handleSignIn}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.primaryButton,
                isLoading && styles.buttonDisabled,
                pressed && styles.primaryPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign In</Text>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In Button (Placed below email input in accessible thumb zone) */}
            <Pressable
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              style={({ pressed }) => [styles.googleButton, pressed && styles.googlePressed]}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
            >
              <Ionicons name="logo-google" size={18} color="#EA4335" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>

            {/* Bottom Switch to Sign Up */}
            <View style={styles.footerSection}>
              <Text style={styles.footerText}>Don{"'"}t have an account?</Text>
              <Pressable
                onPress={() => router.push('/signup')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Navigate to sign up screen"
              >
                <Text style={styles.footerLink}> Sign Up</Text>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 4,
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingBottom: 40,
    paddingTop: 10,
  },
  mainContainer: {
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },

  // Title
  titleSection: {
    marginBottom: 28,
  },
  headingSans: {
    fontFamily: sansFamily,
    fontSize: 38,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -1.2,
  },
  headingSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 40,
    fontWeight: '400',
    color: '#000000',
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 6,
    lineHeight: 20,
  },

  // Error Banner
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#FF3B30',
    flex: 1,
    fontWeight: '500',
  },

  // Input Fields
  inputStack: {
    gap: 16,
    marginBottom: 8,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '500',
    color: '#6E6E73',
    letterSpacing: -0.1,
  },
  inputWrapper: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textInput: {
    fontFamily: sansFamily,
    fontSize: 16,
    color: '#000000',
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  passwordInput: {
    paddingRight: 8,
  },
  eyeButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Forgot Password
  forgotPasswordRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Primary Button
  primaryButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontFamily: sansFamily,
    fontSize: 16,
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
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  dividerText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    marginHorizontal: 12,
  },

  // Google Button
  googleButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  googleIcon: {
    marginRight: 8,
  },
  googlePressed: {
    backgroundColor: '#F2F2F7',
  },

  // Footer
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
  },
  footerLink: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#000000',
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.5,
  },
});
