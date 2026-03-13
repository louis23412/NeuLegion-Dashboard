import os from 'os';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  let ipAddress;

  Object.keys(interfaces).forEach((ifaceName) => {
    interfaces[ifaceName].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
      }
    });
  });

  return ipAddress;
}

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  server: {
    port: 3001,
    host: getLocalIP(),
    strictPort: true
  }
})