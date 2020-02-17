import * as React from 'react';
import uuid from 'uuid/v4';
import { View, StyleSheet } from 'react-native';

export type ModalProps = { hide: () => void };
export type ModalComponent = (props: ModalProps) => React.ReactElement<{}> | null;

interface ModalController {
    showModal(modal: ModalComponent): void;
    hideModals(): void;
}

let activeModalController: ModalController | null = null;

export function showRawModal(modal: ModalComponent) {
    if (activeModalController) {
        activeModalController.showModal(modal);
    }
}

export const ModalProvider = React.memo(() => {
    let [modals, setModals] = React.useState<{ element: React.ReactElement<{}> | null, key: string }[]>([]);
    // Using memo for registering controller ASAP
    React.useMemo<ModalController>(() => {
        let res: ModalController = {
            showModal: (modal) => {
                let key = uuid();
                let modalProps: ModalProps = {
                    hide: () => {
                        setModals((state) => state.filter((v) => v.key !== key));
                    }
                };
                let element = modal(modalProps);
                setModals((state) => [...state, { key, element }]);
            },
            hideModals: () => {
                setModals([]);
            }
        }
        activeModalController = res;
        return res;
    }, []);

    return (
        <>
            {modals.length > 0 && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]}>
                    {modals.map((v) => (
                        <View key={v.key} style={StyleSheet.absoluteFill}>
                            {v.element}
                        </View>
                    ))}
                </View>
            )}
        </>
    )
});