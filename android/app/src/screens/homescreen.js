import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';

export default function homescreen() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      sendImageToAPI(result.uri);
    }
  };

  const sendImageToAPI = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'skin.jpg',
    });

    try {
      const res = await axios.post('http://192.168.1.70:8000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPrediction(res.data.prediction);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      {prediction && <Text>Disease: {prediction}</Text>}
    </View>
  );
}
