import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import { OCRService } from '../services/OCRService';
import { StorageService } from '../services/StorageService';
import { ScanHistory, OCRResult } from '../types';
import { colors, spacing, fontSizes, fontWeights, borderRadius, shadows } from '../utils/styles';

const { width, height } = Dimensions.get('window');

interface CameraScannerProps {
  onScanComplete: (result: OCRResult, imageUri: string) => void;
  onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onScanComplete,
  onClose,
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();
      
      setHasPermission(
        cameraPermission === 'granted' && microphonePermission === 'granted'
      );
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      Alert.alert(
        'Permission refusée',
        'L\'accès à la caméra est nécessaire pour scanner les prix.'
      );
    }
  };

  const takePicture = async () => {
    if (!camera.current || isScanning) return;

    try {
      setIsScanning(true);
      
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: flash,
        enableShutterSound: false,
      });

      // Traiter l'image avec OCR
      const ocrResult = await OCRService.recognizeText(photo.path);
      
      // Sauvegarder dans l'historique
      const scanHistory: ScanHistory = {
        id: Date.now().toString(),
        imageUri: photo.path,
        ocrResult,
        timestamp: Date.now(),
      };
      
      await StorageService.addScanToHistory(scanHistory);
      
      // Appeler le callback avec le résultat
      onScanComplete(ocrResult, photo.path);
      
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert(
        'Erreur',
        'Impossible de traiter l\'image. Veuillez réessayer.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const toggleFlash = () => {
    setFlash(flash === 'off' ? 'on' : 'off');
  };

  const switchCamera = () => {
    setCameraPosition(cameraPosition === 'back' ? 'front' : 'back');
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Icon name="camera" size={64} color={colors.primary[600]} />
          <Text style={styles.permissionTitle}>
            Permission d'accès à la caméra requise
          </Text>
          <Text style={styles.permissionSubtitle}>
            Cette application a besoin d'accéder à votre caméra pour scanner les prix
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={checkPermissions}>
            <Icon name="check" size={16} color={colors.white} style={styles.buttonIcon} />
            <Text style={styles.permissionButtonText}>Autoriser l'accès</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Chargement de la caméra...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        enableZoomGesture={true}
      >
        {/* Overlay de guidage */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          
          <View style={styles.instructionContainer}>
            <Icon name="bullseye" size={24} color={colors.white} />
            <Text style={styles.instructionText}>
              Placez le prix dans le cadre
            </Text>
          </View>
        </View>

        {/* Contrôles de la caméra */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <Icon name="times" size={20} color={colors.white} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <Icon 
              name={flash === 'off' ? 'bolt' : 'bolt'} 
              size={20} 
              color={flash === 'off' ? colors.warning[500] : colors.warning[400]} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
            <Icon name="refresh" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Bouton de capture */}
        <View style={styles.captureContainer}>
          <TouchableOpacity
            style={[styles.captureButton, isScanning && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator size="large" color={colors.white} />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
          
          <Text style={styles.captureText}>
            {isScanning ? 'Traitement...' : 'Appuyez pour scanner'}
          </Text>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.8,
    height: height * 0.3,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary[500],
    borderTopWidth: 3,
    borderLeftWidth: 3,
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  cornerBottomLeft: {
    top: 'auto',
    bottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  cornerBottomRight: {
    top: 'auto',
    bottom: 0,
    right: 0,
    left: 'auto',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.full,
    marginTop: spacing[5],
  },
  instructionText: {
    color: colors.white,
    fontSize: fontSizes.base,
    marginLeft: spacing[2],
    fontWeight: fontWeights.medium,
  },
  controls: {
    position: 'absolute',
    top: spacing[12],
    right: spacing[5],
    flexDirection: 'column',
  },
  controlButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
    ...shadows.md,
  },
  captureContainer: {
    position: 'absolute',
    bottom: spacing[12],
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    ...shadows.lg,
  },
  captureButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
  },
  captureText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    marginTop: spacing[3],
    fontWeight: fontWeights.medium,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[8],
  },
  permissionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing[6],
    marginBottom: spacing[3],
  },
  permissionSubtitle: {
    fontSize: fontSizes.base,
    color: colors.gray[300],
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: fontSizes.xl,
  },
  permissionButton: {
    backgroundColor: colors.primary[600],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  buttonIcon: {
    marginRight: spacing[2],
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    marginTop: spacing[5],
    fontWeight: fontWeights.medium,
  },
});