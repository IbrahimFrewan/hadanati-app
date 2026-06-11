import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';
import { isSupabaseConfigured } from '../lib/supabase';
import type { KycDocType } from '../data/api';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function UploadTile({ label, required, uploaded, busy, onPress }: {
  label: string; required?: boolean; uploaded?: boolean; busy?: boolean; onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} disabled={busy} style={{
      flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14,
      borderWidth: 1.5, borderColor: uploaded ? C.green : C.line,
      borderStyle: uploaded ? 'solid' : 'dashed',
      borderRadius: 14, backgroundColor: uploaded ? C.tint : '#fff', marginBottom: 11,
    }}>
      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: uploaded ? C.green : C.cream, alignItems: 'center', justifyContent: 'center' }}>
        {busy
          ? <ActivityIndicator color={C.dgreen} />
          : <Icon name={uploaded ? 'checkCircle' : 'upload'} size={22} color={uploaded ? '#fff' : C.dgreen} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: F.bodyBold, fontSize: 14, fontWeight: '600', color: C.ink, marginBottom: 2 }}>{label}</Text>
        <Text style={{ fontSize: 11.5, color: C.mut }}>{uploaded ? 'Uploaded' : 'Tap to upload · photo'}</Text>
      </View>
      {required && !uploaded && (
        <View style={{ backgroundColor: '#fbeede', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#b06d22' }}>Required</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function NKyc() {
  const navigation = useNavigation<Nav>();
  const { lang, actions } = useN();
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (type: KycDocType) => {
    setErr('');
    // No backend configured → keep the original local toggle behaviour.
    if (!isSupabaseConfigured) {
      setUploaded((u) => ({ ...u, [type]: !u[type] }));
      return;
    }

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { setErr('Photo permission is needed to upload documents.'); return; }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    const asset = res.canceled ? undefined : res.assets?.[0];
    if (!asset?.base64) return;

    setBusyKey(type);
    try {
      await actions.uploadKyc(type, {
        base64: asset.base64,
        mimeType: asset.mimeType ?? undefined,
      });
      setUploaded((u) => ({ ...u, [type]: true }));
    } catch (e: any) {
      setErr(e?.message ?? 'Upload failed. Please try again.');
    } finally {
      setBusyKey(null);
    }
  };

  const onContinue = async () => {
    setErr('');
    if (!isSupabaseConfigured) { navigation.navigate('NApproval'); return; }
    setSubmitting(true);
    try {
      await actions.submitKyc();
      navigation.navigate('NApproval');
    } catch (e: any) {
      setErr(e?.message ?? 'Could not submit for review.');
    } finally {
      setSubmitting(false);
    }
  };

  const ready = uploaded.license && uploaded.commercial && uploaded.owner_id;

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar title={t(lang, 'kycTitle')} subtitle={t(lang, 'kycSubtitle')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: C.cream, borderRadius: 14, padding: 14, marginBottom: 22 }}>
          <Text style={{ fontFamily: F.body, fontSize: 13, color: C.dgreen, lineHeight: 20 }}>
            All documents are encrypted and reviewed only by Hadanati's compliance team. Required items must be uploaded to proceed.
          </Text>
        </View>

        <UploadTile label={t(lang, 'nurseryLicense')} required uploaded={uploaded.license} busy={busyKey === 'license'} onPress={() => pick('license')} />
        <UploadTile label={t(lang, 'commercialDoc')} required uploaded={uploaded.commercial} busy={busyKey === 'commercial'} onPress={() => pick('commercial')} />
        <UploadTile label={t(lang, 'ownerIdDoc')} required uploaded={uploaded.owner_id} busy={busyKey === 'owner_id'} onPress={() => pick('owner_id')} />
        <UploadTile label={t(lang, 'insuranceDoc')} uploaded={uploaded.insurance} busy={busyKey === 'insurance'} onPress={() => pick('insurance')} />

        {err ? <Text style={{ fontFamily: F.body, fontSize: 13, color: C.danger, marginTop: 4 }}>{err}</Text> : null}
      </ScrollView>

      <View style={{ padding: 22, paddingBottom: 34, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button
          onPress={onContinue}
          full size="lg"
          disabled={!ready || submitting}
        >
          {submitting ? '…' : t(lang, 'continueBtn')}
        </Button>
      </View>
    </View>
  );
}
