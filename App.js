import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const cameraRef = useRef(null);

  // Request camera permissions
  const getPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    getPermissions();
  }, []);

  // Start recording
  const startRecording = async () => {
    console.log('Started Recording');
    console.log('Recording state:', recording);
    console.log('Camera ref:', cameraRef.current);
    try {
      setRecording(true);
      const { uri } = await cameraRef.current.recordAsync();
      setVideoUri(uri);
      setRecording(true);
    } catch (error) {
      setRecording(false);
      console.error('Error starting recording:', error);
    }
  };
  

  // Stop recording
  const stopRecording = async () => {
    console.log('Recording state:', recording);
    if (cameraRef.current) {
      try {
    
        let res=await cameraRef.current.stopRecording();
        console.log(res);
        setRecording(false);
        console.log('Recording state:f ', recording);
      } catch (error) {
        setRecording(false);
        console.log('Recording state:f', recording);
        console.error('Error stopping recording:', error);

      }
    }else{

      console.log('camera ref' +false);
    }
  };

  // Render the camera preview or recorded video
  const renderCamera = () => {
    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <Camera
        ref={(ref) => {
          cameraRef.current = ref;
        }}
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ratio="16:9"
      />
    );
  };
  

  return (
    <View style={{ flex: 1 }}>
      {renderCamera()}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        {!recording ? (
          <TouchableOpacity onPress={startRecording} style={styles.captureButton}>
            <Text style={{ fontSize: 20, color: 'white' }}>Record</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={stopRecording} style={styles.captureButton}>
            <Text style={{ fontSize: 20, color: 'white' }}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = {
  captureButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 15,
    marginHorizontal: 20,
  },
};
