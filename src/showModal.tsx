import * as React from 'react';
import { ModalComponent, showRawModal, ModalProps } from './ModalProvider';
import { View, StyleSheet, TouchableWithoutFeedback, Modal, InputAccessoryView } from 'react-native';
import { SAnimatedView, SAnimated } from 'react-native-fast-animations';
import uuid from 'uuid/v4';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        opacity: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.48)',
        width: '100%',
        height: '100%',
    }
});

function playOpenAnimation(rootName: string, containerName: string) {
    SAnimated.timing(rootName, { property: 'opacity', from: 0, to: 1, duration: 0.25 });
    SAnimated.timing(containerName, { property: 'opacity', from: 0, to: 1, duration: 0.15 });
    SAnimated.spring(containerName, { property: 'translateY', from: 100, to: 0, duration: 0.15 });
}

function playHideAnimation(rootName: string, containerName: string) {
    SAnimated.timing(rootName, { property: 'opacity', from: 1, to: 0, duration: 0.15 });
    SAnimated.timing(containerName, { property: 'opacity', from: 1, to: 0, duration: 0.15 });
    SAnimated.spring(containerName, { property: 'translateY', from: 0, to: 100, duration: 0.15 });
}

const BaseModalComponent = React.memo((props: { children?: any, props: ModalProps, modal: ModalComponent }) => {
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
            playHideAnimation(rootName, containerName)
            SAnimated.commitTransaction(() => {
                props.props.hide();
            });
        };
    }, []);

    React.useEffect(() => {
        SAnimated.beginTransaction();
        playOpenAnimation(rootName, containerName)
        SAnimated.commitTransaction();
    }, []);

    const element = React.useMemo(() => props.modal({ hide: doHide }), []);

    return (
        <View style={styles.root}>
            <TouchableWithoutFeedback onPress={doHide}>
                <View style={StyleSheet.absoluteFill}>
                    <SAnimatedView name={rootName} style={styles.background} />
                </View>
            </TouchableWithoutFeedback>
            <SAnimatedView name={containerName}>
                <View style={{ width: 100, height: 100, backgroundColor: 'white', borderRadius: 18 }} pointerEvents="box-only">
                    {element}
                </View>
            </SAnimatedView>
        </View>
    )
});

export function showModal(modal: ModalComponent) {
    showRawModal((props) => {
        return (
            <BaseModalComponent props={props} modal={modal} />
        );
    });
}