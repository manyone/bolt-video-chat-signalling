import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Video } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full p-6 text-center">
        <div className="mb-8">
          <Video className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
          <h1 className="text-4xl font-bold mb-2">Video Chat</h1>
          <p className="text-gray-400">Connect with anyone, anywhere</p>
        </div>
        
        <button
          onClick={createRoom}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          Create Room
        </button>
      </div>
    </div>
  );
}

export default Home;