import React from 'react';
import {Modal, View, StyleSheet, Pressable} from 'react-native';
import Button from './button';
import Typography from './typography';

const ConfirmModal = ({visible, onConfirm, onCancel, overlayClick}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.centeredView}>
        <Pressable onPress={overlayClick} style={styles.overlay} />
        <View style={styles.modalView}>
          <Typography style={styles.modalText}>Are you sure?</Typography>
          <Button title="Yes" onPress={onConfirm} style={styles.button} />
          <Button title="No" onPress={onCancel} style={styles.button} />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: '#00000066',
  },
  modalView: {
    zIndex: 2,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#007aff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
    width: 200,
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
});
export default ConfirmModal;
