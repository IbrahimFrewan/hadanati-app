import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, NurseryImage, EmptyView } from '../components';
import { useApp } from '../context/AppContext';
import { getNursery } from '../data';
import { t } from '../i18n';

export function MessagesScreen({ navigation }: any) {
  const { store, lang, actions } = useApp();
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [text, setText] = useState('');
  const isRTL = lang === 'ar';

  const thread = store.threads.find(t => t.id === openThread);
  const insets = useSafeAreaInsets();

  const send = () => {
    if (!text.trim() || !openThread) return;
    actions.sendMessage(openThread, text.trim());
    setText('');
  };

  if (thread) {
    const n = getNursery(thread.nurseryId);
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.page }}>
        <TopBar
          title={n?.name || 'Chat'}
          subtitle={t(lang, 'usuallyReplies')}
          onBack={() => setOpenThread(null)}
          right={
            <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="phone" size={18} color={C.ink} />
            </TouchableOpacity>
          }
        />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          <FlatList
            data={thread.messages}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={{ padding: 18, gap: 9 }}
            ListHeaderComponent={
              <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.cream, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 11, marginBottom: 8 }}>
                <Icon name="shield" size={13} color={C.mut} />
                <Text style={{ fontSize: 10.5, color: C.mut }}>{t(lang, 'inAppOnly')}</Text>
              </View>
            }
            renderItem={({ item: msg }) => (
              <View style={{ maxWidth: '78%', alignSelf: msg.me ? 'flex-end' : 'flex-start', backgroundColor: msg.me ? C.header : '#fff', borderWidth: msg.me ? 0 : 1, borderColor: C.line, borderRadius: 16, borderBottomRightRadius: msg.me ? 5 : 16, borderBottomLeftRadius: msg.me ? 16 : 5, padding: 13 }}>
                <Text style={{ fontSize: 13.5, lineHeight: 20, color: msg.me ? '#fff' : C.ink, textAlign: isRTL ? 'right' : 'left' }}>{msg.text}</Text>
                <Text style={{ fontSize: 9.5, opacity: 0.6, textAlign: 'right', marginTop: 4, color: msg.me ? '#fff' : C.mut }}>{msg.time}</Text>
              </View>
            )}
          />
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', padding: 16, paddingBottom: 10, borderTopWidth: 1, borderTopColor: C.line, gap: 9, alignItems: 'center', backgroundColor: C.page }}>
            <TouchableOpacity style={{ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="paperclip" size={19} color={C.mut} />
            </TouchableOpacity>
            <TextInput
              value={text}
              onChangeText={setText}
              onSubmitEditing={send}
              placeholder={t(lang, 'messagePlaceholder')}
              placeholderTextColor={C.mut}
              style={{ flex: 1, height: 44, borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingHorizontal: 16, fontFamily: F.body, fontSize: 14, color: C.ink, backgroundColor: '#fff', textAlign: isRTL ? 'right' : 'left' }}
            />
            <TouchableOpacity onPress={send} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: text.trim() ? C.header : '#cdd6cd', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="send" size={19} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <View style={{ paddingHorizontal: 22, paddingTop: 6, paddingBottom: 12 }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'messages')}</Text>
      </View>
      <FlatList
        data={store.threads}
        keyExtractor={tt => tt.id}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 96 }}
        ListEmptyComponent={<EmptyView title={t(lang, 'noMessagesTitle')} body={t(lang, 'noMessagesBody')} />}
        renderItem={({ item: tt }) => {
          const n = getNursery(tt.nurseryId);
          return (
            <TouchableOpacity onPress={() => setOpenThread(tt.id)} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 13, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.line, alignItems: 'center' }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, overflow: 'hidden', flexShrink: 0 }}>
                <NurseryImage src={n?.img} seed={tt.nurseryId} radius={26} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: F.displayBold, fontSize: 15.5, fontWeight: '700', color: C.ink, textAlign: isRTL ? 'right' : 'left' }}>{n?.name || ''}</Text>
                  <Text style={{ fontSize: 11, color: C.mut }}>{tt.time}</Text>
                </View>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 3 }}>
                  <Text numberOfLines={1} style={{ fontSize: 12.5, color: tt.unread ? C.ink : C.mut, fontWeight: tt.unread ? '600' : '400', flex: 1, textAlign: isRTL ? 'right' : 'left' }}>{tt.last}</Text>
                  {tt.unread > 0 && (
                    <View style={{ minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, flexShrink: 0 }}>
                      <Text style={{ color: '#fff', fontSize: 10.5, fontWeight: '700' }}>{tt.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
