import * as React from 'react';
import { ModalComponent, showRawModal, ModalProps } from './ModalProvider';
import { View, StyleSheet, TouchableWithoutFeedback, ScrollView, ViewStyle, KeyboardAvoidingView } from 'react-native';
import { SAnimatedView, SAnimated } from 'react-native-fast-animations';
import { useSafeArea } from 'react-native-safe-area-context';
import uuid from 'uuid/v4';
import { animations } from './animations';

const styles = StyleSheet.create({
    fill: {
        width: '100%',
        height: '100%',
    },
    background: {
        opacity: 0,
        width: '100%',
        height: '100%',
    },
    backgroundDefault: {
        backgroundColor: 'rgba(0, 0, 0, 0.48)'
    }
});

export interface ModalConfiguration {
    backgroundStyle?: ViewStyle;
    containerStyle?: ViewStyle;
    showAnimation?: (views: { background: string, container: string }) => void;
    hideAnimation?: (views: { background: string, container: string }) => void;
    dismissOffset?: number;
}

const BaseModalComponent = React.memo((props: { children?: any, props: ModalProps, config: ModalConfiguration, modal: ModalComponent }) => {
    const rootName = React.useMemo(() => uuid(), []);
    const containerName = React.useMemo(() => uuid(), []);

    const doHide = React.useMemo(() => {
        let hidden = false;
        return () => {
            if (hidden) {
                return;
            }
            hidden = true;

            // Hide Sequence
            SAnimated.beginTransaction();
            (props.config.hideAnimation || animations.defaultModalHideAnimation)(
                { background: rootName, container: containerName }
            );
            SAnimated.commitTransaction(() => {
                props.props.hide();
            });
        };
    }, []);

    React.useEffect(() => {
        SAnimated.beginTransaction();
        (props.config.showAnimation || animations.defaultModalShowAnimation)(
            { background: rootName, container: containerName }
        );
        SAnimated.commitTransaction();
    }, []);

    const element = React.useMemo(() => props.modal({ hide: doHide }), []);
    const safeArea = useSafeArea();

    return (
        <View style={styles.fill}>
            <TouchableWithoutFeedback onPress={doHide}>
                <View style={StyleSheet.absoluteFill}>
                    <SAnimatedView
                        name={rootName}
                        style={[styles.backgroundDefault, props.config.backgroundStyle, styles.background]}
                    />
                </View>
            </TouchableWithoutFeedback>
            <SAnimatedView name={containerName} style={styles.fill}>
                <KeyboardAvoidingView behavior="padding">
                    <ScrollView
                        alwaysBounceVertical={true}
                        decelerationRate={0.8}
                        style={styles.fill}
                        onScrollEndDrag={(e) => {
                            if (e.nativeEvent.contentOffset.y < -(props.config.dismissOffset !== undefined ? props.config.dismissOffset : 30)) {
                                doHide();
                            }
                        }}
                        contentContainerStyle={{
                            flexDirection: 'column',
                            flexGrow: 1,
                            marginBottom: safeArea.bottom,
                            marginTop: safeArea.top,
                            marginLeft: safeArea.left,
                            marginRight: safeArea.right,
                        }}
                    >
                        <TouchableWithoutFeedback onPress={doHide}>
                            <View style={{ flexGrow: 1 }} />
                        </TouchableWithoutFeedback>
                        <View
                            style={[{ backgroundColor: 'white', borderRadius: 18, padding: 8 }, props.config.containerStyle]}
                        >
                            {element}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SAnimatedView>
        </View>
    )
});

export function showModal(modal: ModalComponent, config?: ModalConfiguration) {
    showRawModal((props) => {
        return (
            <BaseModalComponent props={props} modal={modal} config={config || {}} />
        );
    });
}