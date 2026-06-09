import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function UploadTile({ label, required, uploaded, onPress }: {
  label: string; required?: boolean; uploaded?: boolean; onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{
      flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14,
      borderWidth: 1.5, borderColor: uploaded ? C.green : C.line,
      borderStyle: uploaded ? 'solid' : 'dashed',
      borderRadius: 14, backgroundColor: uploaded ? C.tint : '#fff', marginBottom: 11,
    }}>
      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: uploaded ? C.green : C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={uploaded ? 'checkCircle' : 'upload'} size={22} color={uploaded ? '#fff' : C.dgreen} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: F.bodyBold, fontSize: 14, fontWeight: '600', color: C.ink, marginBottom: 2 }}>{label}</Text>
        <Text style={{ fontSize: 11.5, color: C.mut }}>{uploaded ? 'Uploaded' : 'Tap to upload · PDF or photo'}</Text>
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
  const { lang } = useN();
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});

  const toggle = (k: string) => setUploaded((u) => ({ ...u, [k]: !u[k] }));

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

        <UploadTile label={t(lang, 'nurseryLicense')} required uploaded={uploaded.license} onPress={() => toggle('license')} />
        <UploadTile label={t(lang, 'commercialDoc')} required uploaded={uploaded.commercial} onPress={() => toggle('commercial')} />
        <UploadTile label={t(lang, 'ownerIdDoc')} required uploaded={uploaded.id} onPress={() => toggle('id')} />
        <UploadTile label={t(lang, 'insuranceDoc')} uploaded={uploaded.insurance} onPress={() => toggle('insurance')} />
      </ScrollView>

      <View style={{ padding: 22, paddingBottom: 34, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button
          onPress={() => navigation.navigate('NApproval')}
          full size="lg"
          disabled={!uploaded.license || !uploaded.commercial || !uploaded.id}
        >
          {t(lang, 'continueBtn')}
        </Button>
      </View>
    </View>
  );
}
