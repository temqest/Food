import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SocialPost } from '@/data/socialFeedData';
import { useSocialFeed } from '@/context/SocialFeedContext';
import { IOSTokens } from '@/constants/theme';
import { UserAvatar } from '@/components/common/UserAvatar';

interface CommentsBottomSheetProps {
  post: SocialPost | null;
  visible: boolean;
  onClose: () => void;
}

export const CommentsBottomSheet: React.FC<CommentsBottomSheetProps> = ({
  post,
  visible,
  onClose,
}) => {
  const { addComment } = useSocialFeed();
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const handleSend = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Grab Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Comments</Text>
              <Text style={styles.headerSubtitle}>
                Discussion on {post.author.name}’s {post.foodName || 'post'}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close comments"
            >
              <Ionicons name="close" size={20} color="#8E8E93" />
            </Pressable>
          </View>

          {/* Comments List */}
          <ScrollView
            style={styles.commentsList}
            contentContainerStyle={styles.commentsContent}
            showsVerticalScrollIndicator={false}
          >
            {post.comments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={36} color="#C7C7CC" />
                <Text style={styles.emptyTitle}>No comments yet</Text>
                <Text style={styles.emptySubtitle}>Be the first foodie to share your thoughts!</Text>
              </View>
            ) : (
              post.comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <UserAvatar uri={comment.authorAvatar} style={styles.commentAvatar} />
                  <View style={styles.commentBody}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                      {comment.isVerified && (
                        <Ionicons name="checkmark-circle" size={13} color="#34C759" />
                      )}
                      <Text style={styles.commentTime}>{comment.timestamp}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Bottom Comment Input */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Add a comment or question..."
              placeholderTextColor="#8E8E93"
              value={commentText}
              onChangeText={setCommentText}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [
                styles.sendBtn,
                !commentText.trim() && styles.sendBtnDisabled,
                pressed && styles.pressed,
              ]}
              disabled={!commentText.trim()}
              accessibilityRole="button"
              accessibilityLabel="Send comment"
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={commentText.trim() ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)'}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    minHeight: '45%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(60, 60, 67, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsList: {
    flex: 1,
  },
  commentsContent: {
    padding: 16,
    gap: 16,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  commentAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  commentBody: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  commentTime: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 'auto',
  },
  commentText: {
    fontSize: 13,
    color: '#3A3A3C',
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(60, 60, 67, 0.15)',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1C1E',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: IOSTokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#C7C7CC',
  },
  pressed: {
    opacity: 0.8,
  },
});
