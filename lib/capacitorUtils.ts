'use client';

/**
 * Capacitor Utilities
 * Helpers for checking platform and handling Capacitor-specific functionality
 */

import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Check if running on native platform (iOS or Android)
 */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform?.() ?? false;
}

/**
 * Check if running on web platform
 */
export function isWebPlatform(): boolean {
  return !isNativePlatform();
}

/**
 * Get platform name
 */
export function getPlatformName(): string {
  if (isNativePlatform()) {
    return Capacitor.getPlatform();
  }
  return 'web';
}

/**
 * Exit app (mobile only)
 */
export async function exitApp(): Promise<void> {
  if (isNativePlatform()) {
    await App.exitApp();
  }
}

/**
 * Get app version
 */
export async function getAppVersion(): Promise<string> {
  try {
    const info = await App.getInfo();
    return info.version;
  } catch {
    return 'unknown';
  }
}

/**
 * Get app ID
 */
export async function getAppId(): Promise<string> {
  try {
    const info = await App.getInfo();
    return info.id;
  } catch {
    return 'unknown';
  }
}

/**
 * Check if app is in background
 */
export function onAppPause(callback: () => void): void {
  if (isNativePlatform()) {
    App.addListener('pause', callback);
  }
}

/**
 * Check if app comes to foreground
 */
export function onAppResume(callback: () => void): void {
  if (isNativePlatform()) {
    App.addListener('resume', callback);
  }
}

/**
 * Handle back button (Android)
 */
export function onAppBackButton(callback: () => void): void {
  if (isNativePlatform()) {
    App.addListener('backButton', async () => {
      callback();
    });
  }
}

/**
 * Remove all listeners
 */
export function removeAllAppListeners(): void {
  if (isNativePlatform()) {
    App.removeAllListeners();
  }
}
