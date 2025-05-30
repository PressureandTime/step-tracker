import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const FloatingDevButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  if (!__DEV__) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsVisible(true)}
      >
        <MaterialIcons name="bug-report" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Network Logs</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    bottom: 90, // Above tab bar
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
});
