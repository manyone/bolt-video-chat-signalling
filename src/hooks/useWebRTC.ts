import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { WebRTCService } from '../services/webrtc';

const SIGNALING_SERVER = import.meta.env.VITE_SIGNALING_SERVER || 'http://localhost:3000';

export const useWebRTC = () => {
  // ... rest of the code remains exactly the same ...
};