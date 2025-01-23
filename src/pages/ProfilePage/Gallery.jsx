import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './GalleryStyles';

const Gallery = ({ images, onAddImage }) => {
  const [sortedImages, setSortedImages] = useState(images);

  useEffect(() => {
    const sorted = [...images].sort((a, b) => a.id - b.id);
    setSortedImages(sorted);
  }, [images]);

  const renderGalleryItem = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.galleryImage} />
  );

  return (
    <View style={styles.galleryContainer}>
      {/* <Text style={styles.sectionTitle}>Gallery</Text> */}
      <FlatList
        data={sortedImages}
        renderItem={renderGalleryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.galleryContent}
      />
      <TouchableOpacity style={styles.addImageButton} onPress={onAddImage}>
        <MaterialIcons name="add-photo-alternate" size={20} color="white" />
        <Text style={styles.addImageButtonText}>Add Image</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Gallery;
