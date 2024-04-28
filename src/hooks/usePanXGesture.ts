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
import {
  ANIMATION_DURATION,
  EDraggingDirection,
  LEFT_DRAG_BOUNDARY,
  RIGHT_DRAG_BOUNDARY,
} from '../constants';

export const usePanXGesture = () => {
  const offsetX = useSharedValue(0);
  const startX = useSharedValue(0);

  const leftTouchableStartWidth = useSharedValue(0);
  const leftTouchableWidth = useSharedValue(0);

  const rightTouchableStartWidth = useSharedValue(0);
  const rightTouchableWidth = useSharedValue(0);

  const dragDirectionShared = useSharedValue(EDraggingDirection.none);

  const resetOffsets = (duration?: number) => {
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

  const handlePanX = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    ('worklet');
    const dragX = startX.value + e.translationX;
    /*
    dragX > 0 -> dragging to right side.
    dragX < 0 -> dragging to left side.
    here in one drag, we want to let user drag only one touchable either left or right
    he cannot see both touchables in one drag
    */
    if (dragDirectionShared.value === EDraggingDirection.right) {
      if (dragX > 0) {
        //drag item to right
        offsetX.value = dragX;

        //increase left touchable width as per the dragged distance
        leftTouchableWidth.value =
          leftTouchableStartWidth.value + e.translationX;
      } else {
        //while dragging right, if dragged to leftmost end reset values
        resetOffsets();
        resetLeftWidth();
      }
    }
    if (dragDirectionShared.value === EDraggingDirection.left) {
      if (dragX < 0) {
        //drag item to left
        offsetX.value = dragX;

        //increase right touchable width as per the dragged distance
        rightTouchableWidth.value =
          rightTouchableStartWidth.value - e.translationX;
      } else {
        //while dragging left, if dragged to rightmost end reset values
        resetOffsets();
        resetRightWidth();
      }
    }

    if (dragX === 0) {
      //make all touchable widths 0
      resetRightWidth();
      resetLeftWidth();
    }
  };

  const panXGesture = Gesture.Pan()
    .onStart(e => {
      //set drag direction at start
      const dragX = e.translationX + startX.value;
      dragDirectionShared.value =
        dragX > 0
          ? EDraggingDirection.right
          : dragX < 0
          ? EDraggingDirection.left
          : EDraggingDirection.none;
    })
    .onUpdate(e => {
      handlePanX(e);
    })
    .onEnd(() => {
      if (offsetX.value >= RIGHT_DRAG_BOUNDARY) {
        //if drag is more than defined boundary at right, drag item at the right boundary
        offsetX.value = withTiming(RIGHT_DRAG_BOUNDARY, {
          duration: ANIMATION_DURATION,
        });
        startX.value = RIGHT_DRAG_BOUNDARY;

        //if drag is more than defined boundary at right, make left touchable width same as right boundry
        leftTouchableWidth.value = withTiming(RIGHT_DRAG_BOUNDARY, {
          duration: ANIMATION_DURATION,
        });
        leftTouchableStartWidth.value = RIGHT_DRAG_BOUNDARY;
      } else if (offsetX.value <= LEFT_DRAG_BOUNDARY) {
        //if drag is more than defined boundary at left, drag item at the left boundary
        offsetX.value = withTiming(LEFT_DRAG_BOUNDARY, {
          duration: ANIMATION_DURATION,
        });
        startX.value = LEFT_DRAG_BOUNDARY;

        //if drag is more than defined boundary at left, make left touchable width same as left boundry
        rightTouchableWidth.value = withTiming(-LEFT_DRAG_BOUNDARY, {
          duration: ANIMATION_DURATION,
        });
        rightTouchableStartWidth.value = -LEFT_DRAG_BOUNDARY;
      } else {
        //reset all values
        resetOffsets(ANIMATION_DURATION);
        resetLeftWidth(ANIMATION_DURATION);
        resetRightWidth(ANIMATION_DURATION);
        dragDirectionShared.value = EDraggingDirection.none;
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
