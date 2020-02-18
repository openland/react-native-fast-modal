import * as React from 'react';
import { View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
    block, set, cond, eq, event, add, sub, min, max, greaterThan, lessThan, multiply, divide, debug, or
} from 'react-native-reanimated';
// UIScrollView decelerationRate = 0.55
// iOS default swipe tolerance = 10pt

function projectedTarget(initialVelicity: number, decelerationRate: number = 0.55) {
    if (decelerationRate <= 0) {
        throw Error('decelerationRate should be larger than 0');
    }
    if (decelerationRate >= 1) {
        throw Error('decelerationRate should be smaller than 1');
    }

    // https://medium.com/@esskeetit/scrolling-mechanics-of-uiscrollview-142adee1142c
    // Original Apple formula
    // return (initialVelicity / 1000.0) * decelerationRate / (1.0 - decelerationRate)
    // Better formula (not interpolated)
    return initialVelicity / 1000 * Math.log(decelerationRate)
}

// Rubber Band Effect from iOS
function rubberBandOffset(x: number, d: number = 300, c: number = 0.55) {
    return Math.sign(x) * (Math.abs(x) * d * c) / (d + c * Math.abs(x));
}

function rubberBandOffsetAnimated(x: Animated.Node<number>, d: number = 300, c: number = 0.55) {
    return divide(multiply(x, d * c), add(d, multiply(x, c)));
}

function rubberBandModal(x: number) {
    return rubberBandOffset(x, 300, 0.1);
}

export const ModalBody = React.memo(() => {

    const contentHeight = 300;
    const containerHeight = 200;

    const animatedValues = React.useMemo(() => {

        let contentOffset = new Animated.Value<number>(0);
        let gestureStarted = new Animated.Value<number>(0);
        let dragStartOffset = new Animated.Value<number>(0);
        let dragStartY = new Animated.Value<number>(0);
        let dragY = new Animated.Value<number>(0);
        let dragVelocityY = new Animated.Value<number>(0);
        let gestureState = new Animated.Value(-1);
        let onGestureEvent = event([{
            nativeEvent: {
                absoluteY: dragY,
                state: gestureState,
                velocityY: dragVelocityY
            },
        }])

        const dragYDistance = sub(dragY, dragStartY);
        const dragDestinationY = add(dragStartOffset, dragYDistance);

        function rubberBand(x: Animated.Node<number>) {
            return block([
                cond(lessThan(x, 0), [
                    multiply(rubberBandOffsetAnimated(multiply(x, -1)), -1)
                ], [
                    cond(greaterThan(x, contentHeight - containerHeight), [
                        add(rubberBandOffsetAnimated(sub(x, contentHeight - containerHeight)), contentHeight - containerHeight)
                    ], [
                        x
                    ])
                ])
            ]);
        }

        let processDragging = block([
            cond(or(eq(gestureState, State.ACTIVE), eq(gestureState, State.BEGAN)), [
                cond(eq(gestureStarted, 0), [
                    set(gestureStarted, 1),
                    set(dragStartY, dragY),
                    set(dragStartOffset, contentOffset),
                ], []),
                debug('dest', dragDestinationY),
                set(contentOffset, rubberBand(dragDestinationY)),
            ], [
                set(gestureStarted, 0),
                set(dragStartY, 0),
                set(dragStartOffset, 0),
                debug('stopped', gestureState)
            ]),
        ]);

        let output = block([
            processDragging,
            contentOffset
        ]);

        return {
            output,
            onGestureEvent
        };
    }, []);

    // const responder = React.useMemo(() => {

    //     let tracking = false;
    //     let startOffset = 0;
    //     let currentOffset = 0;

    //     return {
    //         onHandlerStateChange: (event: PanGestureHandlerStateChangeEvent) => {
    //             if (event.nativeEvent.state === State.ACTIVE) {
    //                 startOffset = event.nativeEvent.absoluteY;
    //                 animatedValues.touched.setValue(1);
    //             } else if (event.nativeEvent.state === State.END) {
    //                 currentOffset = 0;
    //                 animatedValues.touched.setValue(0);
    //             }
    //         },
    //         onGestureEvent: (event: PanGestureHandlerGestureEvent) => {
    //             currentOffset += event.nativeEvent.absoluteY - startOffset;
    //             startOffset = event.nativeEvent.absoluteY;
    //             animatedValues.contentOffset.setValue(currentOffset);
    //             // if (tracking) {
    //             //     currentOffset += event.nativeEvent.absoluteY - startOffset;
    //             //     startOffset = event.nativeEvent.absoluteY;
    //             //     value.setValue(rubberBandModal(currentOffset));
    //             // }
    //         }
    //     }
    // }, []);

    return (
        <View
            style={{ width: '100%', height: '100%', backgroundColor: 'pink', justifyContent: 'center' }}
        >
            <PanGestureHandler onGestureEvent={animatedValues.onGestureEvent} onHandlerStateChange={animatedValues.onGestureEvent}>
                <Animated.View
                    style={{
                        height: 200,
                        transform: [{ translateY: animatedValues.output }]
                    }}
                >
                    <View style={{ height: 56, backgroundColor: 'blue', borderRadius: 16, marginHorizontal: 24, marginVertical: 8 }} />
                    <View style={{ height: 56, backgroundColor: 'blue', borderRadius: 16, marginHorizontal: 24, marginVertical: 8 }} />
                    <View style={{ height: 56, backgroundColor: 'blue', borderRadius: 16, marginHorizontal: 24, marginVertical: 8 }} />
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
});