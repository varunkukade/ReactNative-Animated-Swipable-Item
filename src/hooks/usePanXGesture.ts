import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {TItem} from '../types';
import {SCREEN_PADDING, SONG_HEIGHT} from '../constants';
import {Dimensions} from 'react-native';

const ITEM_WIDTH = Dimensions.get('window').width - SCREEN_PADDING * 2;
const RIGHT_DRAG_BOUNDARY = ITEM_WIDTH * 0.3;
const LEFT_DRAG_BOUNDARY = -(ITEM_WIDTH * 0.3);

export const usePanXGesture = (item: TItem) => {
  const offsetX = useSharedValue(0);
  const startX = useSharedValue(0);
  const top = useSharedValue(item.id * SONG_HEIGHT);

  const leftTouchableStartWidth = useSharedValue(0);
  const leftTouchableWidth = useSharedValue(0);

  const handlePanX = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    'worklet';
    offsetX.value = startX.value + e.translationX;
    if (offsetX.value > 0) {
      leftTouchableWidth.value = leftTouchableStartWidth.value + e.translationX;
    } else {
      leftTouchableWidth.value = 0;
    }
    if (offsetX.value >= RIGHT_DRAG_BOUNDARY) {
      console.log('more than right boundary');
    } else if (offsetX.value <= LEFT_DRAG_BOUNDARY) {
      console.log('More than left boundry');
    }
  };

  const panXGesture = Gesture.Pan()
    .onStart(() => {})
    .onUpdate(e => {
      handlePanX(e);
    })
    .onEnd(() => {
      if (offsetX.value >= RIGHT_DRAG_BOUNDARY) {
        offsetX.value = withTiming(RIGHT_DRAG_BOUNDARY, {duration: 200});
        startX.value = RIGHT_DRAG_BOUNDARY;
        leftTouchableWidth.value = withTiming(RIGHT_DRAG_BOUNDARY, {
          duration: 200,
        });
        leftTouchableStartWidth.value = RIGHT_DRAG_BOUNDARY;
      } else if (offsetX.value <= LEFT_DRAG_BOUNDARY) {
        offsetX.value = withTiming(LEFT_DRAG_BOUNDARY, {duration: 200});
        startX.value = LEFT_DRAG_BOUNDARY;
      } else {
        offsetX.value = withTiming(0, {duration: 200});
        startX.value = 0;

        leftTouchableWidth.value = withTiming(0, {duration: 200});
        leftTouchableStartWidth.value = 0;
      }
    });

  const panXAnimatedStyles = useAnimatedStyle(() => {
    return {
      top: top.value,
      transform: [
        {
          translateX: offsetX.value,
        },
      ],
    };
  }, []);

  const leftTouchableAnimatedStyles = useAnimatedStyle(() => {
    return {
      width: leftTouchableWidth.value,
    };
  }, []);

  return {
    panXAnimatedStyles,
    panXGesture,
    leftTouchableAnimatedStyles,
  };
};
