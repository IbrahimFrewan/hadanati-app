import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { NurseryImage, AvailBadge, Rating } from '../components';
import { useApp } from '../context/AppContext';
import { NURSERIES, Nursery } from '../data';
import { t } from '../i18n';

function buildMapHtml(nurseries: typeof NURSERIES, userLat?: number, userLng?: number) {
  const pins = nurseries.map(n => ({
    id: n.id,
    name: n.name,
    lat: n.lat,
    lng: n.lng,
    price: n.priceFrom,
    unit: n.unit,
    avail: n.avail,
  }));

  const centerLat = userLat ?? 31.9700;
  const centerLng = userLng ?? 35.9200;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  body,html { margin:0;padding:0;height:100%;width:100%; }
  #map { height:100%;width:100%; }
  .pin-label {
    background: #fff;
    border:none;
    border-radius: 20px;
    padding: 5px 11px;
    font-family: sans-serif;
    font-size: 13px;
    font-weight: 800;
    color: #2c5a3d;
    box-shadow: 0 2px 10px rgba(0,0,0,0.18);
    cursor:pointer;
    white-space:nowrap;
  }
  .pin-label.selected {
    background: #2f5e41;
    color: #fff;
  }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', { zoomControl: false }).setView([${centerLat}, ${centerLng}], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  var selected = null;
  var markers = {};

  ${userLat ? `
  var userIcon = L.divIcon({
    html: '<div style="width:16px;height:16px;border-radius:50%;background:#3d8ef8;border:3px solid #fff;box-shadow:0 0 0 4px rgba(61,142,248,0.3)"></div>',
    className: '', iconSize: [16,16], iconAnchor: [8,8]
  });
  L.marker([${userLat}, ${userLng}], {icon:userIcon}).addTo(map);
  ` : ''}

  var pins = ${JSON.stringify(pins)};
  pins.forEach(function(p) {
    var el = document.createElement('div');
    el.className = 'pin-label';
    el.innerHTML = p.price + ' JD/' + p.unit;
    var icon = L.divIcon({ html: el, className: '', iconSize: null, iconAnchor: [el.offsetWidth/2 || 40, 20] });
    var marker = L.marker([p.lat, p.lng], {icon:icon}).addTo(map);
    markers[p.id] = {marker: marker, el: el, data: p};
    marker.on('click', function() {
      if (selected) {
        markers[selected].el.classList.remove('selected');
      }
      selected = p.id;
      el.classList.add('selected');
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type:'select', id: p.id}));
    });
  });

  map.on('click', function() {
    if (selected) {
      markers[selected].el.classList.remove('selected');
      selected = null;
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type:'deselect'}));
    }
  });

  function locateMe(lat, lng) {
    map.setView([lat, lng], 14);
  }

  document.addEventListener('message', function(e) {
    try { var d = JSON.parse(e.data); if(d.type==='locate') locateMe(d.lat, d.lng); } catch(x){}
  });
</script>
</body>
</html>`;
}

export function MapScreen({ navigation }: any) {
  const { lang } = useApp();
  const [sel, setSel] = useState<Nursery | null>(null);
  const [locating, setLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapHtml, setMapHtml] = useState(() => buildMapHtml(NURSERIES));
  const webRef = useRef<any>(null);
  const isRTL = lang === 'ar';
  const insets = useSafeAreaInsets();
  const cardBottom = insets.bottom + 16;
  const btnBottom = sel ? cardBottom + 112 : insets.bottom + 16;

  const locateMe = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setLocating(false); return; }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude: lat, longitude: lng } = pos.coords;
      setUserCoords({ lat, lng });
      setMapHtml(buildMapHtml(NURSERIES, lat, lng));
      webRef.current?.postMessage(JSON.stringify({ type: 'locate', lat, lng }));
    } catch { }
    setLocating(false);
  };

  const onMessage = (e: any) => {
    try {
      const d = JSON.parse(e.nativeEvent.data);
      if (d.type === 'select') {
        const n = NURSERIES.find(n => n.id === d.id) || null;
        setSel(n);
      } else if (d.type === 'deselect') {
        setSel(null);
      }
    } catch { }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webRef}
        source={{ html: mapHtml }}
        style={{ flex: 1 }}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
      />

      {/* Header overlay */}
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
        <View style={{ padding: 16, flexDirection: isRTL ? 'row-reverse' : 'row', gap: 9, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <Icon name={isRTL ? 'chevRight' : 'chevLeft'} size={22} color={C.ink} />
          </TouchableOpacity>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, height: 42, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 13, shadowColor: '#000', shadowOpacity: 0.06, elevation: 2 }}>
            <Icon name="pin" size={17} color={C.green} />
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold }}>Amman, Jordan</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.replace('results', {})} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: C.header, alignItems: 'center', justifyContent: 'center', elevation: 3 }}>
            <Icon name="list" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Approximate notice */}
        <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 }}>
          <Icon name="info" size={13} color={C.mut} />
          <Text style={{ fontSize: 11, color: C.mut, fontWeight: '600' }}>{t(lang, 'approximateAreas')}</Text>
        </View>
      </SafeAreaView>

      {/* Locate me button */}
      <TouchableOpacity
        onPress={locateMe}
        style={{ position: 'absolute', right: 16, bottom: btnBottom, zIndex: 3, width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 8, elevation: 5 }}
      >
        {locating ? <ActivityIndicator size="small" color={C.green} /> : <Icon name="crosshair" size={22} color={C.green} />}
      </TouchableOpacity>

      {/* Search this area button */}
      <TouchableOpacity
        onPress={() => setSel(null)}
        style={{ position: 'absolute', bottom: btnBottom, alignSelf: 'center', zIndex: 3, backgroundColor: '#fff', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 18, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 4, flexDirection: 'row', alignItems: 'center', gap: 7 }}
      >
        <Icon name="refresh" size={16} color={C.dgreen} />
        <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 13, color: C.dgreen }}>{t(lang, 'searchThisArea')}</Text>
      </TouchableOpacity>

      {/* Mini card */}
      {sel && (
        <TouchableOpacity
          onPress={() => navigation.push('nursery', { id: sel.id })}
          style={{ position: 'absolute', left: 16, right: 16, bottom: cardBottom, zIndex: 4, backgroundColor: '#fff', borderRadius: 18, padding: 12, flexDirection: 'row', gap: 12, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 15, elevation: 8 }}
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
