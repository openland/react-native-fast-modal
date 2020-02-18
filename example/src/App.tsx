import * as React from 'react';
import { View } from 'react-native';
import { ModalProvider, ModalBody } from 'react-native-fast-modal';
import { SafeAreaProvider } from 'react-native-safe-area-context';

class App extends React.Component<{}> {

  render() {
    return (
      <SafeAreaProvider>
        <View style={{ flexGrow: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          {/* <Button
            title="Show Modal"
            onPress={() => {
              showModal(() => {
                return (
                  <View style={{ height: 900, width: 300, flexDirection: 'column', alignItems: 'stretch' }}>
                    <TextInput style={{ height: 56, backgroundColor: 'red' }} />
                  </View>
                );
              });
            }}
          /> */}
          <ModalBody />
        </View>
        <ModalProvider />
      </SafeAreaProvider>
    )
  }
}

export default App
