import { Socket } from 'socket.io-client';

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private socket: Socket;
  private onStreamCallback: ((stream: MediaStream) => void) | null = null;

  constructor(socket: Socket) {
    this.socket = socket;
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('user-connected', (userId: string) => {
      console.log('User connected:', userId);
      this.createPeerConnection(userId);
    });

    this.socket.on('offer', async (payload: { sdp: RTCSessionDescription, from: string }) => {
      await this.handleOffer(payload);
    });

    this.socket.on('answer', async (payload: { sdp: RTCSessionDescription, from: string }) => {
      await this.handleAnswer(payload);
    });

    this.socket.on('ice-candidate', async (payload: { candidate: RTCIceCandidateInit, from: string }) => {
      await this.handleNewICECandidate(payload);
    });
  }

  private async createPeerConnection(targetUserId: string) {
    try {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      this.peerConnection.ontrack = (event) => {
        if (this.onStreamCallback && event.streams[0]) {
          this.onStreamCallback(event.streams[0]);
        }
      };

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('ice-candidate', {
            target: targetUserId,
            candidate: event.candidate
          });
        }
      };

      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection?.addTrack(track, this.localStream!);
        });
      }

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      this.socket.emit('offer', {
        target: targetUserId,
        sdp: offer
      });
    } catch (error) {
      console.error('Error creating peer connection:', error);
      throw error;
    }
  }

  async initializeMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  private async handleOffer(payload: { sdp: RTCSessionDescription, from: string }) {
    try {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      this.peerConnection.ontrack = (event) => {
        if (this.onStreamCallback && event.streams[0]) {
          this.onStreamCallback(event.streams[0]);
        }
      };

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('ice-candidate', {
            target: payload.from,
            candidate: event.candidate
          });
        }
      };

      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection?.addTrack(track, this.localStream!);
        });
      }

      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.socket.emit('answer', {
        target: payload.from,
        sdp: answer
      });
    } catch (error) {
      console.error('Error handling offer:', error);
      throw error;
    }
  }

  private async handleAnswer(payload: { sdp: RTCSessionDescription, from: string }) {
    try {
      if (!this.peerConnection) return;
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  }

  private async handleNewICECandidate(payload: { candidate: RTCIceCandidateInit, from: string }) {
    try {
      if (!this.peerConnection) return;
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(payload.candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onStreamCallback = callback;
  }

  toggleAudio(enabled: boolean) {
    this.localStream?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  toggleVideo(enabled: boolean) {
    this.localStream?.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  async shareScreen() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      const videoTrack = screenStream.getVideoTracks()[0];

      if (this.peerConnection) {
        const sender = this.peerConnection
          .getSenders()
          .find((s) => s.track?.kind === 'video');

        if (sender) {
          sender.replaceTrack(videoTrack);
        }

        videoTrack.onended = async () => {
          const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const newVideoTrack = newStream.getVideoTracks()[0];
          if (sender) {
            sender.replaceTrack(newVideoTrack);
          }
        };
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
      throw error;
    }
  }

  cleanup() {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.peerConnection?.close();
    this.peerConnection = null;
    this.localStream = null;
  }
}