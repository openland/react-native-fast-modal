import * as React from 'react';
import { View, Button } from 'react-native';
import { ModalProvider, showModal } from 'react-native-fast-modal';

class App extends React.Component<{}> {

  render() {
    return (
      <>
        <View style={{ flexGrow: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            title="Show Modal"
            onPress={() => {
              showModal(() => {
                return null;
              });
            }}
          />
        </View>
        <ModalProvider />
      </>
    )
  }
}

export default App
