'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  Scan,
  Calendar,
  MapPin,
  Clock,
  User,
  Ticket,
  ChevronDown,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
// import { Button } from "../../components/ui/button"
// import { Card, CardContent } from "../../components/ui/card"
// import { Badge } from "../../components/ui/badge"

interface MovieTicket {
  id: string;
  movieTitle: string;
  theater: string;
  date: string;
  time: string;
  seat: string;
  price: string;
  genre: string;
  duration: string;
  rating: string;
  poster: string;
}

const mockTickets: MovieTicket[] = [
  {
    id: 'TKT001',
    movieTitle: 'Avengers: Endgame',
    theater: 'AMC Times Square',
    date: '2024-01-15',
    time: '7:30 PM',
    seat: 'A12',
    price: '$15.99',
    genre: 'Action/Adventure',
    duration: '181 min',
    rating: 'PG-13',
    poster: '/placeholder.svg?height=300&width=200',
  },
  {
    id: 'TKT002',
    movieTitle: 'The Dark Knight',
    theater: 'Regal Cinema',
    date: '2024-01-20',
    time: '9:00 PM',
    seat: 'B8',
    price: '$12.50',
    genre: 'Action/Crime',
    duration: '152 min',
    rating: 'PG-13',
    poster: '/placeholder.svg?height=300&width=200',
  },
];

export default function QRScannerMovie() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTicket, setScannedTicket] = useState<MovieTicket | null>(null);
  const [scanStatus, setScanStatus] = useState<
    'idle' | 'scanning' | 'success' | 'error'
  >('idle');
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanning = async () => {
    setIsScanning(true);
    setScanStatus('scanning');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Simulate QR code detection after 3 seconds
      setTimeout(() => {
        const randomTicket =
          mockTickets[Math.floor(Math.random() * mockTickets.length)];
        setScannedTicket(randomTicket);
        setScanStatus('success');
        setIsScanning(false);

        // Stop camera
        stream.getTracks().forEach((track) => track.stop());
      }, 3000);
    } catch (error) {
      console.error('Camera access denied:', error);
      setScanStatus('error');
      setIsScanning(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScanStatus('scanning');
      // Simulate QR code processing
      setTimeout(() => {
        const randomTicket =
          mockTickets[Math.floor(Math.random() * mockTickets.length)];
        setScannedTicket(randomTicket);
        setScanStatus('success');
      }, 2000);
    }
  };

  const resetScanner = () => {
    setScannedTicket(null);
    setScanStatus('idle');
    setIsScanning(false);
    setShowDropdown(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
            <Scan className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Movie Ticket Scanner
          </h1>
          <p className="text-slate-600">
            Scan your QR code to view ticket details
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!scannedTicket ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Scanner Interface */}
              <div className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <div className="p-8">
                  <div className="relative">
                    {isScanning ? (
                      <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 border-4 border-white/30 rounded-2xl">
                          <div className="absolute inset-4 border-2 border-dashed border-white/50 rounded-xl flex items-center justify-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                              }}
                              className="w-32 h-32 border-4 border-white rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          {/* <Badge variant="secondary" className="bg-white/90 text-slate-800"> */}
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Scanning...
                          </motion.div>
                          {/* </Badge> */}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square max-w-md mx-auto rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-white">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-6">
                          <Camera className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          Ready to Scan
                        </h3>
                        <p className="text-slate-600 text-center mb-6">
                          Position your QR code within the frame to scan
                        </p>

                        {scanStatus === 'error' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-600 mb-4"
                          >
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm">
                              Camera access denied
                            </span>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                      onClick={startScanning}
                      disabled={isScanning}
                      className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      {isScanning ? 'Scanning...' : 'Start Camera'}
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        variant="outline"
                        className="flex-1 sm:flex-none h-12 px-6 border-2 border-slate-200 hover:border-indigo-300 rounded-xl font-medium transition-all duration-200"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Image
                        <ChevronDown
                          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                            showDropdown ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10 min-w-48"
                          >
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-150 flex items-center gap-3"
                            >
                              <Upload className="w-4 h-4 text-slate-500" />
                              <span className="text-sm font-medium">
                                Choose from device
                              </span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {scanStatus === 'scanning' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-700 rounded-full">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: 'linear',
                        }}
                        className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                      />
                      Processing QR code...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 text-green-700 rounded-full mb-6">
                  <CheckCircle className="w-5 h-5" />
                  QR Code scanned successfully!
                </div>
              </motion.div>

              {/* Ticket Details */}
              <div className="overflow-hidden border-0 shadow-xl bg-white">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div className="p-0">
                  <div className="grid md:grid-cols-3 gap-0">
                    {/* Movie Poster */}
                    <div className="md:col-span-1 p-6 bg-gradient-to-br from-slate-50 to-white">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={scannedTicket.poster || '/placeholder.svg'}
                          alt={scannedTicket.movieTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Ticket Information */}
                    <div className="md:col-span-2 p-6 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                          {scannedTicket.movieTitle}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          <div
                            variant="secondary"
                            className="bg-indigo-100 p-3 rounded-lg text-indigo-700"
                          >
                            {scannedTicket.genre}
                          </div>
                          <div
                            variant="secondary"
                            className="bg-purple-100 p-3 rounded-lg text-purple-700"
                          >
                            {scannedTicket.rating}
                          </div>
                          <div
                            variant="secondary"
                            className="bg-slate-100 p-3 rounded-lg text-slate-700"
                          >
                            {scannedTicket.duration}
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Theater</p>
                              <p className="font-medium text-slate-800">
                                {scannedTicket.theater}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Date</p>
                              <p className="font-medium text-slate-800">
                                {formatDate(scannedTicket.date)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Clock className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">
                                Show Time
                              </p>
                              <p className="font-medium text-slate-800">
                                {scannedTicket.time}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Seat</p>
                              <p className="font-medium text-slate-800">
                                {scannedTicket.seat}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-3">
                          <Ticket className="w-5 h-5 text-slate-500" />
                          <span className="text-sm text-slate-500">
                            Ticket ID: {scannedTicket.id}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Total Price</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                            {scannedTicket.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={resetScanner}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-slate-200 hover:border-indigo-300 rounded-xl font-medium transition-all duration-200"
                >
                  <X className="w-5 h-5 mr-2" />
                  Scan Another Ticket
                </button>
                <button className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  <Ticket className="w-5 h-5 mr-2" />
                  Save Ticket
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
