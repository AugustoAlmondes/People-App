import React from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { ThemedView } from '@/src/shared/components/ThemedView';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { Avatar } from '@/src/shared/components/Avatar';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';

import { User } from '@/src/features/users/types';
import { useChat } from '@/src/features/chat/hooks/useChat';
import { MessageBubble } from '@/src/features/chat/components/MessageBubble';
import ChatInput from '@/src/features/chat/components/ChatInput';

export default function ChatScreen() {
    const { userId, userStr } = useLocalSearchParams<{ userId: string; userStr: string }>();
    const router = useRouter();
    const theme = useColorScheme();

    const user = userStr ? (JSON.parse(userStr) as User) : null;

    // Pass the full user object so the hook can build the AI system prompt and snapshot
    const { messages, isTyping, sendMessage } = useChat(userId, user!);

    if (!user) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ThemedText>Erro ao carregar o chat do usuário.</ThemedText>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <ThemedText type="link">Voltar</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ThemedView style={styles.container}>
                <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
                    <View style={[styles.header, { borderBottomColor: colors[theme].border }]}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Feather name="chevron-left" size={28} color={colors[theme].primary} />
                        </TouchableOpacity>

                        <View style={styles.headerUserInfo}>
                            <Avatar uri={user.picture.thumbnail} size={40} status="online" />
                            <View style={styles.headerTextInfo}>
                                <ThemedText type="defaultSemiBold" style={styles.headerName}>
                                    {user.name.first} {user.name.last}
                                </ThemedText>
                                <ThemedText style={styles.headerStatusText}>online</ThemedText>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MessageBubble message={item} />}
                    contentContainerStyle={styles.listContainer}
                    inverted={true}
                    showsVerticalScrollIndicator={false}
                />

                <ChatInput onSend={sendMessage} isTyping={isTyping} />

            </ThemedView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerSafeArea: {
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backButton: {
        padding: 8,
    },
    headerUserInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    headerTextInfo: {
        marginLeft: 12,
        justifyContent: 'center',
    },
    headerName: {
        fontSize: 16,
    },
    headerStatusText: {
        fontSize: 12,
        color: '#4ADE80',
        marginTop: 2,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
});