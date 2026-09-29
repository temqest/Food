import React, { useState, useRef, useEffect } from 'react';
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
import { Header } from '@/components/common/Header';
import { useAuth } from '@/context/AuthContext';

type ResetStep = 'request' | 'verify' | 'reset' | 'success';

export default function ForgotPasswordScreen() {
  const { requestPasswordReset, verifyResetCode, resetPassword, isLoading } = useAuth();

  const [step, setStep] = useState<ResetStep>('request');
  const [identifier, setIdentifier] = useState('maria.santos@gmail.com');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(45);
  const [generatedDemoCode, setGeneratedDemoCode] = useState<string | null>(null);

  const digitRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendCode = async () => {
    setErrorMessage(null);
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }

    const result = await requestPasswordReset(identifier);
    if (result.success) {
      if (result.code) {
        setGeneratedDemoCode(result.code);
        const chars = result.code.split('');
        setCodeDigits(chars);
      }
      setResendTimer(45);
      setStep('verify');
    } else if (result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleDigitChange = (value: string, index: number) => {
    const updated = [...codeDigits];
    updated[index] = value;
    setCodeDigits(updated);
    if (errorMessage) setErrorMessage(null);

    if (value && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !codeDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = () => {
    setErrorMessage(null);
    const fullCode = codeDigits.join('');
    if (fullCode.length < 6) {
      setErrorMessage('Please enter the complete 6-digit code.');
      return;
    }

    const isValid = verifyResetCode(fullCode);
    if (isValid) {
      setStep('reset');
    } else {
      setErrorMessage('Invalid verification code. Please try 724189.');
    }
  };

  const handleResetPassword = async () => {
    setErrorMessage(null);
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const result = await resetPassword(newPassword);
    if (result.success) {
      setStep('success');
    } else if (result.error) {
      setErrorMessage(result.error);
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
            {/* STEP 1: Request Code */}
            {step === 'request' && (
              <>
                <View style={styles.titleSection}>
                  <Text style={styles.headingSans}>
                    Reset your <Text style={styles.headingSerif}>password</Text>
                  </Text>
                  <Text style={styles.subheadText}>
                    Enter your email address to receive a 6-digit recovery code.
                  </Text>
                </View>

                {errorMessage && (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}

                <View style={styles.inputStack}>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        value={identifier}
                        onChangeText={(text) => {
                          setIdentifier(text);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="Enter your email"
                        placeholderTextColor="#8E8E93"
                        style={styles.textInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                      />
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={handleSendCode}
                  disabled={isLoading}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    isLoading && styles.buttonDisabled,
                    pressed && styles.primaryPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Send recovery code"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Send Recovery Code</Text>
                  )}
                </Pressable>
              </>
            )}

            {/* STEP 2: Verify Code */}
            {step === 'verify' && (
              <>
                <View style={styles.titleSection}>
                  <Text style={styles.headingSans}>
                    Enter <Text style={styles.headingSerif}>code</Text>
                  </Text>
                  <Text style={styles.subheadText}>
                    We sent a 6-digit verification code to <Text style={{ fontWeight: '600', color: '#000000' }}>{identifier}</Text>.
                  </Text>
                </View>

                {generatedDemoCode && (
                  <View style={styles.demoCodeBox}>
                    <Ionicons name="key-outline" size={16} color="#000000" />
                    <Text style={styles.demoCodeText}>
                      Demo Code: <Text style={{ fontWeight: '700' }}>{generatedDemoCode}</Text>
                    </Text>
                  </View>
                )}

                {errorMessage && (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}

                {/* 6 Digit Input Boxes */}
                <View style={styles.otpContainer}>
                  {codeDigits.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={(ref) => {
                        digitRefs.current[idx] = ref;
                      }}
                      value={digit}
                      onChangeText={(val) => handleDigitChange(val.slice(-1), idx)}
                      onKeyPress={(e) => handleDigitKeyPress(e, idx)}
                      style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                <Pressable
                  onPress={handleVerifyCode}
                  disabled={isLoading}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.primaryPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Verify recovery code"
                >
                  <Text style={styles.primaryButtonText}>Verify Code</Text>
                </Pressable>

                <View style={styles.resendContainer}>
                  {resendTimer > 0 ? (
                    <Text style={styles.resendTimerText}>
                      Resend code in {resendTimer}s
                    </Text>
                  ) : (
                    <Pressable onPress={handleSendCode} hitSlop={8}>
                      <Text style={styles.resendActionText}>Resend Code</Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}

            {/* STEP 3: Reset Password */}
            {step === 'reset' && (
              <>
                <View style={styles.titleSection}>
                  <Text style={styles.headingSans}>
                    New <Text style={styles.headingSerif}>password</Text>
                  </Text>
                  <Text style={styles.subheadText}>
                    Please choose a strong password with at least 6 characters.
                  </Text>
                </View>

                {errorMessage && (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}

                <View style={styles.inputStack}>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>New Password</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        value={newPassword}
                        onChangeText={(text) => {
                          setNewPassword(text);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="Min 6 characters"
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
                      >
                        <Ionicons
                          name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color="#8E8E93"
                        />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Confirm Password</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="Re-enter your password"
                        placeholderTextColor="#8E8E93"
                        style={[styles.textInput, styles.passwordInput]}
                        secureTextEntry={!isPasswordVisible}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    isLoading && styles.buttonDisabled,
                    pressed && styles.primaryPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Update Password"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Update Password</Text>
                  )}
                </Pressable>
              </>
            )}

            {/* STEP 4: Success */}
            {step === 'success' && (
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-sharp" size={32} color="#000000" />
                </View>

                <Text style={styles.headingSans}>
                  Password <Text style={styles.headingSerif}>updated</Text>
                </Text>
                <Text style={styles.successSubtitle}>
                  Your password has been successfully reset. You can now sign in with your new credentials.
                </Text>

                <Pressable
                  onPress={() => router.replace('/login')}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    { width: '100%', marginTop: 24 },
                    pressed && styles.primaryPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Go to sign in"
                >
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                </Pressable>
              </View>
            )}
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
    marginBottom: 24,
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
    marginTop: 8,
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

  // Demo Code Box
  demoCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 18,
    gap: 8,
  },
  demoCodeText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#000000',
  },

  // Input Fields
  inputStack: {
    gap: 16,
    marginBottom: 20,
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

  // OTP Container
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpBox: {
    width: 48,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  otpBoxFilled: {
    backgroundColor: '#E5E5EA',
  },

  // Resend
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendTimerText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
  },
  resendActionText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#000000',
    fontWeight: '600',
  },

  // Primary Button
  primaryButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
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

  // Success
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successSubtitle: {
    fontFamily: sansFamily,
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.5,
  },
});
