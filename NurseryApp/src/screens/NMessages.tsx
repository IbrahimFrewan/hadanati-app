import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StatusBar as RNStatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, EmptyView, AvatarPlaceholder } from '../components';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

export function NMessages() {
  const { lang, store, actions } = useN();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'chats' | 'alerts'>('chats');
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [text, setText] = useState('');

  const thread = store.threads.find((t) => t.id === openThread);
  const unreadChats = store.threads.reduce((a, t) => a + t.unread, 0);
  const unreadAlerts = store.notifications.filter((n) => !n.read).length;

  const send = () => {
    if (!text.trim() || !openThread) return;
    actions.sendMessage(openThread, text.trim());
    setText('');
  };

  const KIND_STYLES: Record<string, [string, string, string]> = {
    booking: ['bell', '#b06d22', '#fbeede'],
    payment: ['wallet', '#2f7a44', '#e4f1e6'],
    review: ['star', '#b06d22', '#fbeede'],
    system: ['info', '#6b7568', '#eef0ec'],
  };

  if (thread) {
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.page }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <RNStatusBar barStyle="dark-content" />
        <TopBar
          title={thread.parent}
          subtitle={`Parent of ${thread.child}`}
          onBack={() => setOpenThread(null)}
          right={
            <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="phone" size={18} color={C.ink} />
            </TouchableOpacity>
          }
        />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 8, gap: 9 }} showsVerticalScrollIndicator={false}>
          <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.cream, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 5, marginTop: 4, marginBottom: 8 }}>
            <Icon name="shield" size={13} color={C.mut} />
            <Text style={{ fontSize: 10.5, color: C.mut }}>{t(lang, 'safetyNote')}</Text>
          </View>
          {thread.messages.map((msg, i) => (
            <View key={i} style={{ maxWidth: '78%', alignSelf: msg.me ? 'flex-end' : 'flex-start', backgroundColor: msg.me ? C.header : '#fff', borderWidth: msg.me ? 0 : 1, borderColor: C.line, borderRadius: msg.me ? 16 : 16, borderBottomRightRadius: msg.me ? 5 : 16, borderBottomLeftRadius: msg.me ? 16 : 5, paddingHorizontal: 13, paddingVertical: 10 }}>
              <Text style={{ fontSize: 13.5, color: msg.me ? '#fff' : C.ink, lineHeight: 21 }}>{msg.text}</Text>
              <Text style={{ fontSize: 9.5, color: msg.me ? '#ffffff99' : C.mut, textAlign: 'right', marginTop: 4 }}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Canned replies */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 7, paddingBottom: 8 }}>
          {["Thanks for letting us know.", "She's napping now 💚", "See you at pickup!"].map((c) => (
            <TouchableOpacity key={c} onPress={() => setText(c)} style={{ borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, flexShrink: 0 }}>
              <Text style={{ fontFamily: F.bodyBold, fontSize: 12, color: C.dgreen, fontWeight: '600' }}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 16, paddingVertical: 6, paddingBottom: insets.bottom + 10, borderTopWidth: 1, borderTopColor: C.line }}>
          <TouchableOpacity style={{ width: 42, height: 42, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="camera" size={19} color={C.mut} />
          </TouchableOpacity>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message…"
            placeholderTextColor={C.mut}
            style={{ flex: 1, height: 44, borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingHorizontal: 16, fontFamily: F.body, fontSize: 14, backgroundColor: '#fff', color: C.ink }}
          />
          <TouchableOpacity onPress={send} style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: text.trim() ? C.header : '#cdd6cd', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="send" size={19} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <View style={{ paddingHorizontal: 22, paddingTop: insets.top + 6, paddingBottom: 14 }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink }}>{t(lang, 'inbox')}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 22, paddingBottom: 14 }}>
        {([['chats', t(lang, 'chats'), unreadChats], ['alerts', t(lang, 'alerts'), unreadAlerts]] as const).map(([k, l, cnt]) => (
          <TouchableOpacity key={k} onPress={() => { setTab(k); if (k === 'alerts') setTimeout(() => actions.readNotifs(), 800); }} style={{ flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: 'center', backgroundColor: tab === k ? C.header : C.cream, position: 'relative' }}>
            <Text style={{ fontFamily: F.bodyBold, fontSize: 13, fontWeight: '700', color: tab === k ? '#fff' : C.mut }}>
              {l}
              {cnt > 0 && <Text style={{ marginLeft: 5 }}> {cnt}</Text>}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {tab === 'chats' ? (
          store.threads.length === 0 ? (
            <EmptyView title={t(lang, 'noMessages')} body={t(lang, 'noMessagesBody')} />
          ) : store.threads.map((th) => (
            <TouchableOpacity key={th.id} onPress={() => setOpenThread(th.id)} style={{ flexDirection: 'row', gap: 13, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.line, alignItems: 'center' }}>
              <View style={{ width: 50, height: 50, borderRadius: 999, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 18, color: C.dgreen }}>{th.parent[0]}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                  <Text style={{ fontFamily: F.displayBold, fontSize: 15.5, fontWeight: '700', color: C.ink }}>
                    {th.parent}<Text style={{ color: C.mut, fontWeight: '500', fontSize: 12 }}> · {th.child}</Text>
                  </Text>
                  <Text style={{ fontSize: 11, color: C.mut }}>{th.time}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 12.5, color: th.unread ? C.ink : C.mut, fontWeight: th.unread ? '600' : '400', flex: 1 }} numberOfLines={1}>{th.last}</Text>
                  {th.unread > 0 && (
                    <View style={{ minWidth: 18, height: 18, borderRadius: 999, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, flexShrink: 0 }}>
                      <Text style={{ color: '#fff', fontSize: 10.5, fontWeight: '700' }}>{th.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          store.notifications.map((nt) => {
            const [ic, fg, bg] = KIND_STYLES[nt.kind] || KIND_STYLES.system;
            return (
              <View key={nt.id} style={{ flexDirection: 'row', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: nt.read ? '#fff' : '#fbfdfb', marginBottom: 10, alignItems: 'flex-start', position: 'relative' }}>
                <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={ic as any} size={19} color={fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                    <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink, flex: 1 }}>{nt.title}</Text>
                    <Text style={{ fontSize: 10.5, color: C.mut, flexShrink: 0 }}>{nt.time}</Text>
                  </View>
                  <Text style={{ fontSize: 12.5, color: C.mut, lineHeight: 20 }}>{nt.body}</Text>
                </View>
                {!nt.read && <View style={{ position: 'absolute', top: 16, right: 14, width: 8, height: 8, borderRadius: 999, backgroundColor: C.green }} />}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
