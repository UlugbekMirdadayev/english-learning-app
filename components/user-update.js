import React from 'react';
import {Modal, View} from 'react-native';
import Input from './input';
import Typography from './typography';
import Button from './button';

const UserUpdate = ({
  modalVisible,
  styles,
  user,
  handleEdit,
  form,
  setForm,
  loading,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.form}>
        <View style={styles.body}>
          <Typography>Edit</Typography>
          <View style={styles.hr} />
          <Input
            placeholder="Name"
            label="Name"
            styleInput={{marginBottom: 16}}
            inputProps={{
              defaultValue: user?.name,
              onChangeText: text => setForm({...form, name: text}),
            }}
          />
          <Input
            placeholder="Surname"
            label="Surname"
            styleInput={{marginBottom: 16}}
            inputProps={{
              defaultValue: user?.surname,
              onChangeText: text => setForm({...form, surname: text}),
            }}
          />
          <Input
            placeholder="Email"
            label="Email"
            styleInput={{marginBottom: 16}}
            inputProps={{
              defaultValue: user?.email,
              onChangeText: text => setForm({...form, email: text}),
            }}
          />
          <Input
            placeholder="Password"
            label="Password"
            password
            styleInput={{marginBottom: 16}}
            inputProps={{
              onChangeText: text => setForm({...form, password: text}),
            }}
          />
          <Button title="Save" onPress={handleEdit} loading={loading} />
        </View>
      </View>
    </Modal>
  );
};

export default UserUpdate;
