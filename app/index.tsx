import config from '@/config'
import React from 'react'
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Index = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.appName}>{config.appName}</Text>
      <Text style={styles.appDescription}>{config.appTagLine}</Text>
      
      <TouchableOpacity style={styles.getStartedButton}>
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Designed & Developed by{' '}
          <Text 
            style={styles.footerLink}
            onPress={() => Linking.openURL('https://github.com/ashutosh887')}
          >
            ashutosh887 🇮🇳
          </Text>
        </Text>
      </View>
    </View>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#010100',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  appDescription: {
    fontSize: 16,
    color: '#101010',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 22,
    maxWidth: 280,
  },
  getStartedButton: {
    backgroundColor: '#010100',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#101010',
    textAlign: 'center',
  },
  footerLink: {
    color: '#010100',
    fontWeight: '600',
  },
})
