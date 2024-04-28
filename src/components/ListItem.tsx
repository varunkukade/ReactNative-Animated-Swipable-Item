import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {TListItem} from '../types';
import {styles} from './ListItem.styles';
import {usePanXGesture} from '../hooks/usePanXGesture';

export const ListItem = ({item}: TListItem) => {
  const {panXAnimatedStyles, panXGesture, leftTouchableAnimatedStyles} =
    usePanXGesture(item);

  return (
    <>
      <Animated.View
        style={[styles.leftClickContainer, leftTouchableAnimatedStyles]}>
        <TouchableOpacity onPress={() => {}}>
          <Text>Left Click</Text>
        </TouchableOpacity>
      </Animated.View>
      <GestureDetector gesture={panXGesture}>
        <Animated.View
          key={item.id}
          style={[styles.itemContainer, panXAnimatedStyles]}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.imageSrc,
              }}
              style={styles.image}
              borderRadius={8}
            />
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description1}>{item.title}</Text>
            <Text style={styles.description2}>{item.singer}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};
