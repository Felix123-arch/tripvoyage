import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { LoadingOverlay, ErrorBanner } from '../components';
import * as api from '../services';

const AMAP_KEY = 'f437d8e1df9e233e62b78cad68860eb6';

// On native, use WebView; on web, MapScreen.web.tsx is used instead
let WebView: any = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

interface Props {
  navigation: any;
}

export function MapScreen({ navigation }: Props) {
  const t = useTheme();
  const { isAuthenticated } = useAuth();
  const [pins, setPins] = useState<api.MapPinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMapPins();
      setPins(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load map data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPins(); }, [loadPins]);

  // Build the HTML for the Gaode map embedded in WebView
  const mapHtml = `
<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<style>body{margin:0;padding:0}#map{width:100vw;height:100vh}</style>
</head><body>
<div id="map"></div>
<script>
var pins = ${JSON.stringify(pins)};
var cb = '_amap_' + Date.now();
window[cb] = function() {
  var map = new AMap.Map('map', { zoom: 3, center: [105, 35], resizeEnable: true });
  var colors = { blue: '#2563EB', green: '#059669', amber: '#D97706', red: '#DC2626' };
  pins.forEach(function(p) {
    var c = colors[p.color] || '#2563EB';
    var el = document.createElement('div');
    el.innerHTML = '<div style="width:28px;height:28px;border-radius:50%;background:'+c+';border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;">📍</div>';
    var m = new AMap.Marker({ position: [p.lng, p.lat], content: el.firstChild, offset: new AMap.Pixel(-14, -14) });
    m.on('click', function() {
      try { window.ReactNativeWebView.postMessage(JSON.stringify(p)); } catch(e) {}
    });
    map.add(m);
  });
};
var s = document.createElement('script');
s.src = 'https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&callback=' + cb;
document.head.appendChild(s);
</script>
</body></html>`;

  if (!WebView) {
    // Fallback for unexpected web rendering (should never happen since MapScreen.web.tsx is used)
    return (
      <View style={[s.screen, { backgroundColor: t.colors.background }]}>
        <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
          <Text style={{ fontWeight: '600', fontSize: 18, color: t.colors.onSurface }}>Explore Map</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 40 }}>🗺️</Text>
          <Text style={{ marginTop: 12, color: t.colors.onSurfaceMuted }}>Please use the web app for maps</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 8 }}>
            <Text style={{ fontSize: 20, color: t.colors.primary }}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 22 }}>{'📍'}</Text>
          <Text style={{ fontWeight: '600', fontSize: 18, color: t.colors.onSurface, marginLeft: 8 }}>Map</Text>
        </View>
      </View>

      {loading ? (
        <LoadingOverlay message="Loading map..." />
      ) : error ? (
        <ErrorBanner message={error} onRetry={loadPins} />
      ) : (
        <WebView
          source={{ html: mapHtml }}
          style={{ flex: 1 }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={(e: any) => {
            try {
              const pin = JSON.parse(e.nativeEvent.data);
              // Show pin details via alert for now
              // In a full implementation, use a bottom sheet
            } catch {}
          }}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
});
