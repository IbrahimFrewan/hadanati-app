import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { NurseryImage, AvailBadge, Rating } from '../components';
import { useApp } from '../context/AppContext';
import { NURSERIES, Nursery } from '../data';
import { t } from '../i18n';

const pins = [
  { n: NURSERIES[0], top: '30%', left: '26%' },
  { n: NURSERIES[1], top: '46%', left: '62%' },
  { n: NURSERIES[2], top: '64%', left: '38%' },
  { n: NURSERIES[3], top: '24%', left: '70%' },
];

export function MapScreen({ navigation }: any) {
  const { lang } = useApp();
  const [sel, setSel] = useState<Nursery | null>(null);
  const isRTL = lang === 'ar';

  return (
    <View style={{ flex: 1, backgroundColor: '#e8ece4' }}>
      {/* Faux map background */}
      <View style={{ position: 'absolute', inset: 0, backgroundColor: '#e8ece4' }}>
        {/* Grid lines */}
        {[...Array(8)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * 76, height: 1, backgroundColor: '#dfe6da' }} />
        ))}
        {[...Array(6)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: i * 62, width: 1, backgroundColor: '#d7ded1' }} />
        ))}
      </View>

      {/* District fuzz circles */}
      {pins.map((p, i) => (
        <View key={i} style={{ position: 'absolute', top: p.top as any, left: p.left as any, width: 120, height: 120, borderRadius: 60, backgroundColor: '#3f8a5a22', borderWidth: 1, borderColor: '#3f8a5a66', transform: [{ translateX: -60 }, { translateY: -60 }] }} />
      ))}

      {/* Header overlay */}
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
        <View style={{ padding: 16, flexDirection: isRTL ? 'row-reverse' : 'row', gap: 9, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <Icon name={isRTL ? 'chevRight' : 'chevLeft'} size={22} color={C.ink} />
          </TouchableOpacity>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, height: 42, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 13, shadowColor: '#000', shadowOpacity: 0.06, elevation: 2 }}>
            <Icon name="pin" size={17} color={C.green} />
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold }}>Abdoun, Amman</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.replace('results', {})} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: C.header, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <Icon name="list" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Approximate location notice */}
      <View style={{ position: 'absolute', top: 96, alignSelf: 'center', zIndex: 2, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 }}>
        <Icon name="info" size={13} color={C.mut} />
        <Text style={{ fontSize: 11, color: C.mut, fontWeight: '600' }}>{t(lang, 'approximateAreas')}</Text>
      </View>

      {/* Cluster pins */}
      {pins.map((p, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setSel(p.n)}
          style={{
            position: 'absolute', top: p.top as any, left: p.left as any, zIndex: 3,
            backgroundColor: sel?.id === p.n.id ? C.header : '#fff',
            borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12,
            shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 6, elevation: 4,
            transform: [{ translateX: -30 }, { translateY: -18 }],
            flexDirection: 'row', alignItems: 'center', gap: 5,
          }}
        >
          <Icon name="pin" size={15} color={sel?.id === p.n.id ? '#fff' : C.dgreen} />
          <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 13, color: sel?.id === p.n.id ? '#fff' : C.dgreen }}>{p.n.priceFrom}</Text>
        </TouchableOpacity>
      ))}

      {/* Search this area button */}
      <TouchableOpacity
        onPress={() => setSel(null)}
        style={{ position: 'absolute', bottom: sel ? 200 : 28, alignSelf: 'center', zIndex: 3, backgroundColor: '#fff', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 18, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 4, flexDirection: 'row', alignItems: 'center', gap: 7 }}
      >
        <Icon name="refresh" size={16} color={C.dgreen} />
        <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 13, color: C.dgreen }}>{t(lang, 'searchThisArea')}</Text>
      </TouchableOpacity>

      {/* Mini card */}
      {sel && (
        <TouchableOpacity
          onPress={() => navigation.push('nursery', { id: sel.id })}
          style={{ position: 'absolute', left: 16, right: 16, bottom: 24, zIndex: 4, backgroundColor: '#fff', borderRadius: 18, padding: 12, flexDirection: 'row', gap: 12, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 15, elevation: 8 }}
        >
          <View style={{ width: 70, height: 70, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
            <NurseryImage src={sel.img} seed={sel.id} radius={12} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.ink, marginBottom: 3 }}>{sel.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Rating value={sel.rating} count={sel.reviews} size={12} />
              <AvailBadge avail={sel.avail} label={t(lang, sel.avail)} />
            </View>
            <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 14, color: C.dgreen }}>{sel.priceFrom} JD<Text style={{ fontSize: 11, color: C.mut, fontWeight: '600' }}> /{sel.unit}</Text></Text>
          </View>
          <Icon name={isRTL ? 'chevLeft' : 'chevRight'} size={20} color={C.mut} />
        </TouchableOpacity>
      )}
    </View>
  );
}
