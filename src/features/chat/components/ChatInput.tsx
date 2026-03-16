import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';

interface ChatInputProps {
  onSend: (text: string) => void;
  isTyping?: boolean;
}

export function ChatInput({ onSend, isTyping = false }: ChatInputProps) {
  const [text, setText] = useState('');
  const theme = useColorScheme();
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (text.trim().length > 0) {
      onSend(text);
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].surface, paddingBottom: Math.max(insets.bottom, 16) }]}>

      {/* Typing indicator logic directly inside the input bar for simplicity in mock scale */}
      {isTyping && (
        <View style={styles.typingIndicatorContainer}>
          <ActivityIndicator size="small" color={colors[theme].textSecondary} />
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors[theme].surfaceElevated,
              color: colors[theme].text,
              borderColor: colors[theme].border
            }
          ]}
          placeholder="Digite uma mensagem..."
          placeholderTextColor={colors[theme].textSecondary}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: text.trim() ? colors[theme].primary : colors[theme].surfaceElevated }
          ]}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <Feather
            name="send"
            size={20}
            color={text.trim() ? '#FFF' : colors[theme].textSecondary}
            style={{ marginLeft: 2 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.2)',
    paddingTop: 12,
    paddingBottom:10,
    paddingHorizontal: 16,
  },
  typingIndicatorContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120, // max growth
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 12, // Needs to be paired with paddingBottom for multiline
    paddingBottom: 12,
    borderWidth: 1,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
