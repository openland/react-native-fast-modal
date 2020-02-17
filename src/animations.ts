import { SAnimated } from 'react-native-fast-animations';
import { Platform } from 'react-native';
export const animations = {
    defaultModalShowAnimation: (views: { background: string, container: string }) => {
        SAnimated.timing(views.background, { property: 'opacity', from: 0, to: 1, duration: 0.4 });
        if (Platform.OS === 'ios') {
            SAnimated.spring(views.container, { property: 'translateY', from: 300, to: 0, duration: 0.5 });
        } else {
            SAnimated.timing(views.container, { property: 'translateY', from: 300, to: 0, duration: 0.5 });
        }
    },
    defaultModalHideAnimation: (views: { background: string, container: string }) => {
        SAnimated.timing(views.background, { property: 'opacity', from: 1, to: 0, duration: 0.3 });
        SAnimated.timing(views.container, { property: 'translateY', easing: { bezier: [.17, .67, .83, .67] }, from: 0, to: 1000, duration: 0.35 });
    }
};