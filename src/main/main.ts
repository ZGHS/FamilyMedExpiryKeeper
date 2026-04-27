import { app, BrowserWindow } from 'electron';
import path from 'path';
import { startServer } from '../server/server';
import { startScheduler, checkAndNotify } from './scheduler';

let mainWindow: BrowserWindow | null = null;

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: '家庭药品效期管家',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const indexPath = path.join(__dirname, '..', 'renderer', 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  console.log('[Main] BrowserWindow created');
}

app.whenReady().then(async () => {
  console.log('[Main] App ready, starting...');

  await startServer();
  startScheduler();

  await createWindow();

  setTimeout(() => {
    checkAndNotify();
  }, 5000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  console.log('[Main] App quitting');
});
