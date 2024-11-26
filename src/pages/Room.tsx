import React from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import Controls from '../components/Controls';
import { useWebRTC } from '../hooks/useWebRTC';
import { Link } from 'lucide-react';

function Room() {
  const { roomId } = useParams();
  const {
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    shareScreen,
    endCall,
    connectionError
  } = useWebRTC();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Video Chat</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Room ID:</span>
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-1">
              <code className="text-sm">{roomId}</code>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="text-gray-400 hover:text-white"
                title="Copy room link"
              >
                <Link className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {connectionError && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {connectionError}
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            {localStream ? (
              <VideoPlayer stream={localStream} muted />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Loading camera...</p>
              </div>
            )}
            <div className="absolute bottom-4 left-4 text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              You
            </div>
          </div>

          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            {remoteStream ? (
              <VideoPlayer stream={remoteStream} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Waiting for someone to join...</p>
              </div>
            )}
            {remoteStream && (
              <div className="absolute bottom-4 left-4 text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                Remote User
              </div>
            )}
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <Controls
              isAudioEnabled={isAudioEnabled}
              isVideoEnabled={isVideoEnabled}
              onToggleAudio={toggleAudio}
              onToggleVideo={toggleVideo}
              onShareScreen={shareScreen}
              onEndCall={endCall}
            />
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Room;