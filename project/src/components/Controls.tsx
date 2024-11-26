import React from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff } from 'lucide-react';

interface ControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onShareScreen: () => void;
  onEndCall: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onShareScreen,
  onEndCall,
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 bg-gray-900 p-4 rounded-lg">
      <button
        onClick={onToggleAudio}
        className={`p-3 rounded-full ${
          isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {isAudioEnabled ? (
          <Mic className="w-6 h-6 text-white" />
        ) : (
          <MicOff className="w-6 h-6 text-white" />
        )}
      </button>
      <button
        onClick={onToggleVideo}
        className={`p-3 rounded-full ${
          isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {isVideoEnabled ? (
          <Video className="w-6 h-6 text-white" />
        ) : (
          <VideoOff className="w-6 h-6 text-white" />
        )}
      </button>
      <button
        onClick={onShareScreen}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
      >
        <Monitor className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={onEndCall}
        className="p-3 rounded-full bg-red-500 hover:bg-red-600"
      >
        <PhoneOff className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default Controls;