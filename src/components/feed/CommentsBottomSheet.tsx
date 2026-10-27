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
  const { addComment, voteOnPoll, claimVoucher } = useSocialFeed();
  const [commentText, setCommentText] = useState('');
  const [showVoucherToast, setShowVoucherToast] = useState(false);

  if (!post) return null;

  const handleSend = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const handleClaimVoucher = () => {
    claimVoucher(post.id);
    setShowVoucherToast(true);
    setTimeout(() => {
      setShowVoucherToast(false);
    }, 2500);
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
            {/* Pinned Business Craving Poll Widget */}
            {post.advertisement?.poll && (
              <View style={styles.pollPinnedContainer}>
                <View style={styles.pollHeaderRow}>
                  <View style={styles.pollBadge}>
                    <Ionicons name="pin" size={11} color="#D42F13" />
                    <Text style={styles.pollBadgeText}>PINNED STORE POLL</Text>
                  </View>
                  <View style={styles.pollLiveBadge}>
                    <View style={styles.pollLiveDot} />
                    <Text style={styles.pollLiveText}>Active</Text>
                  </View>
                </View>

                <Text style={styles.pollQuestion}>{post.advertisement.poll.question}</Text>

                <View style={styles.pollOptionsList}>
                  {post.advertisement.poll.options.map((option) => {
                    const hasVoted = !!post.advertisement?.poll?.userVotedOptionId;
                    const isUserPick = post.advertisement?.poll?.userVotedOptionId === option.id;
                    const total = Math.max(1, post.advertisement?.poll?.totalVotes || 1);
                    const percent = Math.round((option.votes / total) * 100);

                    return (
                      <Pressable
                        key={option.id}
                        onPress={() => voteOnPoll(post.id, option.id)}
                        style={({ pressed }) => [
                          styles.pollOptionBtn,
                          isUserPick && styles.pollOptionBtnPicked,
                          pressed && styles.pressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`${option.text}, ${percent}% of votes`}
                      >
                        {/* Progress Fill Bar */}
                        {hasVoted && (
                          <View
                            style={[
                              styles.pollProgressBar,
                              { width: `${percent}%` },
                              isUserPick && styles.pollProgressBarPicked,
                            ]}
                          />
                        )}

                        <View style={styles.pollOptionContentRow}>
                          <View style={styles.pollOptionLeft}>
                            <Ionicons
                              name={
                                isUserPick
                                  ? 'checkmark-circle'
                                  : hasVoted
                                  ? 'ellipse-outline'
                                  : 'radio-button-off'
                              }
                              size={16}
                              color={isUserPick ? '#D42F13' : '#8E8E93'}
                            />
                            <Text
                              style={[
                                styles.pollOptionText,
                                isUserPick && styles.pollOptionTextPicked,
                              ]}
                              numberOfLines={2}
                            >
                              {option.text}
                            </Text>
                          </View>

                          {hasVoted && (
                            <Text
                              style={[
                                styles.pollOptionPercent,
                                isUserPick && styles.pollOptionPercentPicked,
                              ]}
                            >
                              {percent}%
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Poll Footer & Reward Callout */}
                <View style={styles.pollFooterRow}>
                  <Text style={styles.pollVoteCount}>
                    {post.advertisement.poll.totalVotes} foodies voted
                  </Text>

                  {post.advertisement.poll.userVotedOptionId ? (
                    <Pressable
                      onPress={handleClaimVoucher}
                      style={styles.pollRewardBanner}
                    >
                      <Ionicons name="gift" size={12} color="#D42F13" />
                      <Text style={styles.pollRewardText}>
                        {post.advertisement.callToAction.isClaimed
                          ? `Code: ${post.advertisement.callToAction.voucherCode || 'CLAIMED'}`
                          : post.advertisement.poll.rewardDescription || 'Claim 20% Voucher'}
                      </Text>
                    </Pressable>
                  ) : (
                    <Text style={styles.pollHintText}>Vote to unlock 20% voucher</Text>
                  )}
                </View>
              </View>
            )}

            {/* Toast when voucher is claimed inside comments */}
            {showVoucherToast && (
              <View style={styles.voucherToast}>
                <Ionicons name="checkmark-circle" size={14} color="#D42F13" />
                <Text style={styles.voucherToastText}>
                  Voucher {post.advertisement?.callToAction.voucherCode || 'DEAL'} unlocked & copied!
                </Text>
              </View>
            )}

            {post.advertisement?.poll && (
              <View style={styles.discussionDividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>COMMUNITY DISCUSSION</Text>
                <View style={styles.dividerLine} />
              </View>
            )}

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
  pollPinnedContainer: {
    backgroundColor: '#FFFBF9',
    borderWidth: 1,
    borderColor: '#FFE4DD',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  pollHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pollBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFE9E4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pollBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.5,
  },
  pollLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pollLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#34C759',
  },
  pollLiveText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#1E3A2B',
  },
  pollQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
    lineHeight: 19,
    marginBottom: 10,
  },
  pollOptionsList: {
    gap: 8,
  },
  pollOptionBtn: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pollOptionBtnPicked: {
    borderColor: '#D42F13',
    backgroundColor: '#FFF8F6',
  },
  pollProgressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#F2F2F7',
  },
  pollProgressBarPicked: {
    backgroundColor: '#FFE4DD',
  },
  pollOptionContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  },
  pollOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  pollOptionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2C2C2E',
    flex: 1,
  },
  pollOptionTextPicked: {
    color: '#D42F13',
    fontWeight: '700',
  },
  pollOptionPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8E8E93',
    marginLeft: 4,
  },
  pollOptionPercentPicked: {
    color: '#D42F13',
  },
  pollFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#FFE7E2',
  },
  pollVoteCount: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  pollRewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFE9E4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pollRewardText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },
  pollHintText: {
    fontSize: 11,
    color: '#D42F13',
    fontWeight: '600',
  },
  voucherToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF2EE',
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F8B4A6',
  },
  voucherToastText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#D42F13',
    flex: 1,
  },
  discussionDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.8,
  },
});
