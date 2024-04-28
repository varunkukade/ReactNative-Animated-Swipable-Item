import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  ANIMATION_DURATION,
  EDraggingDirection,
  LEFT_DRAG_BOUNDARY,
  RIGHT_DRAG_BOUNDARY,
} from '../constants';
import {useState} from 'react';

export const usePanXGesture = () => {
  const offsetX = useSharedValue(0);
  const startX = useSharedValue(0);

  const leftTouchableStartWidth = useSharedValue(0);
  const leftTouchableWidth = useSharedValue(0);

  const rightTouchableStartWidth = useSharedValue(0);
  const rightTouchableWidth = useSharedValue(0);

  const [draggingDirection, setDraggingDirection] =
    useState<EDraggingDirection>(EDraggingDirection.none);

  const resetOffsets = (duration: number) => {
    'worklet';
    if (duration) {
      offsetX.value = withTiming(0, {duration});
    } else {
      offsetX.value = 0;
    }
    startX.value = 0;
  };

  const resetLeftWidth = (duration?: number) => {
    'worklet';
    if (duration) {
      leftTouchableWidth.value = withTiming(0, {duration});
    } else {
      leftTouchableWidth.value = 0;
    }
    leftTouchableStartWidth.value = 0;
  };

  const resetRightWidth = (duration?: number) => {
    'worklet';
    if (duration) {
      rightTouchableWidth.value = withTiming(0, {duration});
    } else {
      rightTouchableWidth.value = 0;
    }
    rightTouchableStartWidth.value = 0;
  };

  const resetDragDirection = () => {
    'worklet';
    runOnJS(setDraggingDirection)(EDraggingDirection.none);
  };

  const handlePanX = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    'worklet';
    const dragX = startX.value + e.translationX;
    if (dragX > 0 && draggingDirection === EDraggingDirection.right) {
      //drag item to right
      runOnJS(setDraggingDirection)(EDraggingDirection.right);
      offsetX.value = dragX;
      leftTouchableWidth.value = leftTouchableStartWidth.value + e.translationX;
    }
    if (dragX < 0 && draggingDirection === EDraggingDirection.left) {
      //drag item to left
      runOnJS(setDraggingDirection)(EDraggingDirection.left);
      offsetX.value = dragX;
      rightTouchableWidth.value =
        rightTouchableStartWidth.value - e.translationX;
    }
    if (dragX === 0) {
      resetRightWidth();
      resetLeftWidth();
    }
  };

  const panXGesture = Gesture.Pan()
    .onUpdate(e => {
      handlePanX(e);
    })
    .onStart(e => {
      runOnJS(setDraggingDirection)(
        e.translationX > 0
          ? EDraggingDirection.right
          : e.translationX < 0
          ? EDraggingDirection.left
          : EDraggingDirection.none,
      );
    })
    .onEnd(() => {
      if (offsetX.value >= RIGHT_DRAG_BOUNDARY) {
        offsetX.value = withTiming(RIGHT_DRAG_BOUNDARY, {
          duration: ANIMATION_DURATION,
        });
        startX.value = RIGHT_DRAG_BOUNDARY;

        leftTouchableWidth.value = withTiming(RIGHT_DRAG_BOUNDARY, {
          duration: ANIMATION_DURATION,
        });
        leftTouchableStartWidth.value = RIGHT_DRAG_BOUNDARY;
      } else if (offsetX.value <= LEFT_DRAG_BOUNDARY) {
        offsetX.value = withTiming(LEFT_DRAG_BOUNDARY, {
          duration: ANIMATION_DURATION,
        });
        startX.value = LEFT_DRAG_BOUNDARY;

        rightTouchableWidth.value = withTiming(-LEFT_DRAG_BOUNDARY, {
          duration: ANIMATION_DURATION,
        });
        rightTouchableStartWidth.value = -LEFT_DRAG_BOUNDARY;
      } else {
        resetOffsets(ANIMATION_DURATION);
        resetLeftWidth(ANIMATION_DURATION);
        resetRightWidth(ANIMATION_DURATION);
        resetDragDirection();
      }
    });

  const panXAnimatedStyles = useAnimatedStyle(() => {
    return {
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

  const rightTouchableAnimatedStyles = useAnimatedStyle(() => {
    return {
      width: rightTouchableWidth.value,
    };
  }, []);

  return {
    panXAnimatedStyles,
    panXGesture,
    leftTouchableAnimatedStyles,
    rightTouchableAnimatedStyles,
  };
};
