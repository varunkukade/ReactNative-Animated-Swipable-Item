import React from 'react';
import {ScrollView, View} from 'react-native';

import {ListItem} from '../components/ListItem';
import {SCREEN_PADDING, SONGS, SONG_HEIGHT} from '../constants';
import {styles} from './List.styles';

export const List = () => {
  return (
    <View style={styles.listContainer}>
      <ScrollView
        contentContainerStyle={{
          height: SONGS.length * SONG_HEIGHT,
        }}
        style={{paddingHorizontal: SCREEN_PADDING}}>
        {SONGS.map(eachSong => (
          <ListItem item={eachSong} key={eachSong.id} />
        ))}
      </ScrollView>
    </View>
  );
};
