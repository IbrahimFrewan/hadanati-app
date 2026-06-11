import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { C, F } from '../theme';

type Props = { children: React.ReactNode; name?: string };
type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.warn(`[ErrorBoundary:${this.props.name ?? 'screen'}]`, error?.message, info?.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <View style={{ flex: 1, backgroundColor: C.page, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <Text style={{ fontSize: 32 }}>🌿</Text>
        </View>
        <Text style={{ fontFamily: F.displayBold, fontSize: 20, fontWeight: '700', color: C.ink, marginBottom: 8, textAlign: 'center' }}>
          Something went wrong
        </Text>
        <Text style={{ fontSize: 13, color: C.mut, textAlign: 'center', lineHeight: 19, marginBottom: 18, maxWidth: 280 }}>
          This screen ran into a problem. You can try again — the rest of the app is unaffected.
        </Text>
        <ScrollView style={{ maxHeight: 120, alignSelf: 'stretch', marginBottom: 18 }} contentContainerStyle={{ paddingHorizontal: 4 }}>
          <Text style={{ fontSize: 11, color: C.danger, textAlign: 'center', fontFamily: F.body }}>
            {String(error?.message || error)}
          </Text>
        </ScrollView>
        <TouchableOpacity onPress={this.reset} style={{ backgroundColor: C.header, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 28 }}>
          <Text style={{ color: '#fff', fontFamily: F.bodyBold, fontWeight: '700', fontSize: 14.5 }}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export function withBoundary<P extends object>(Comp: React.ComponentType<P>, name: string) {
  const Wrapped = (props: P) => (
    <ErrorBoundary name={name}>
      <Comp {...props} />
    </ErrorBoundary>
  );
  Wrapped.displayName = `Boundary(${name})`;
  return Wrapped;
}
