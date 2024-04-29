import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';

import {ListItem} from '../components/ListItem';
import {SCREEN_PADDING, SONGS} from '../constants';
import {styles} from './List.styles';

export const List = () => {
  const [songs, setSongs] = useState(SONGS);

  const deleteItem = (id: number) => {
    setSongs(prevSongs => prevSongs.filter(eachSong => eachSong.id !== id));
  };

  return (
    <View style={styles.listContainer}>
      <ScrollView style={{paddingHorizontal: SCREEN_PADDING}}>
        {songs.map(eachSong => (
          <ListItem item={eachSong} key={eachSong.id} deleteItem={deleteItem} />
        ))}
      </ScrollView>
    </View>
  );
};
