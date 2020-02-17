import * as React from 'react';
import { ModalComponent, showRawModal, ModalProps } from './ModalProvider';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        backgroundColor: 'rgba(0, 0, 0, 0.48)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});

const BaseModalComponent = React.memo((props: { children?: any, props: ModalProps }) => {
    return (
        <View style={styles.root}>
            <TouchableWithoutFeedback onPress={props.props.hide}>
                <View style={styles.background} />
            </TouchableWithoutFeedback>
            <View>
                <View style={{ width: 100, height: 100, backgroundColor: 'red' }} pointerEvents="box-only">
                    {props.children}
                </View>
            </View>
        </View>
    )
});

export function showModal(modal: ModalComponent) {
    showRawModal((props) => {
        let child = modal(props);
        return (
            <BaseModalComponent props={props}>
                {child}
            </BaseModalComponent>
        )
    });
}