import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {TListItem} from '../types';
import {styles} from './ListItem.styles';
import {usePanXGesture} from '../hooks/usePanXGesture';
import {getRandomColor} from '../helpers';
import {Color_Pallete, ETouchableType} from '../constants';

export const ListItem = ({item, deleteItem}: TListItem) => {
  const totalLeftTouchableWidth = item.leftTouchables?.reduce(
    (acc, touchable) => acc + touchable.width,
    0,
  );

  const totalRightTouchableWidth = item.rightTouchables?.reduce(
    (acc, touchable) => acc + touchable.width,
    0,
  );

  const {panXAnimatedStyles, panXGesture} = usePanXGesture(
    totalLeftTouchableWidth,
    totalRightTouchableWidth,
    item,
    deleteItem,
  );

  return (
    <Animated.View style={styles.container}>
      {item.type === ETouchableType['left-touchable'] ||
      item.type === ETouchableType['left-right-touchable'] ? (
        <Animated.View style={styles.touchableContainer}>
          {item.leftTouchables?.map(eachTouchable => {
            return (
              <Animated.View
                key={eachTouchable.id}
                style={[
                  styles.leftContainer,
                  {
                    backgroundColor: eachTouchable.bgColor || getRandomColor(),
                    width: eachTouchable.width,
                  },
                ]}>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={{color: Color_Pallete.metal_black}}>
                    {eachTouchable.title}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>
      ) : null}
      {item.type === ETouchableType['swipe-right-to-delete'] ? (
        <Animated.View
          style={[
            styles.leftContainer,
            styles.deleteContainer,
            styles.leftDelete,
          ]}>
          <Text style={{color: Color_Pallete.crystal_white}}>{'Delete'}</Text>
        </Animated.View>
      ) : null}

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
      {item.type === ETouchableType['right-touchable'] ||
      item.type === ETouchableType['left-right-touchable'] ? (
        <Animated.View
          style={[styles.touchableContainer, styles.rightContainer]}>
          {item.rightTouchables?.map(eachTouchable => {
            return (
              <Animated.View
                key={eachTouchable.id}
                style={[
                  styles.leftContainer,
                  {
                    backgroundColor: eachTouchable.bgColor || getRandomColor(),
                    width: eachTouchable.width,
                  },
                ]}>
                <TouchableOpacity onPress={() => {}}>
                  <Text>{eachTouchable.title}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>
      ) : null}
      {item.type === ETouchableType['swipe-left-to-delete'] ? (
        <Animated.View
          style={[
            styles.rightContainer,
            styles.deleteContainer,
            styles.rightDelete,
          ]}>
          <Text style={{color: Color_Pallete.crystal_white}}>{'Delete'}</Text>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
};
