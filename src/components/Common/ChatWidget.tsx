import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Zoom, Paper, TextField, InputAdornment, Avatar, Chip, Fade } from '@mui/material';
import { 
  SmartToy as RobotIcon, 
  Close as CloseIcon, 
  Send as SendIcon, 
  WhatsApp as WAIcon
} from '@mui/icons-material';
import { packageService } from '../../services/allServices';
import { formatRupiah } from '../../utils/formatRupiah';
import { useLocation } from 'react-router-dom';

interface Message {
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Halo! Saya KuyBot 🤖. Ada yang bisa saya bantu hari ini?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show bubble after short delay
    const timer = setTimeout(() => setShowBubble(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Visibility check moved to JSX to maintain Hook order

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(async () => {
      let botResponse = "Maaf, saya tidak mengerti. Bisa hubungi Admin kami via WhatsApp untuk bantuan lebih lanjut.";
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('halo') || lowerText.includes('hi')) {
        botResponse = "Halo juga! Mau cari paket keren hari ini? Coba tanya 'paket murah' atau 'cara bayar'.";
      } else if (lowerText.includes('murah') || lowerText.includes('rekomendasi')) {
        try {
          const { data } = await packageService.getAll();
          const cheapest = data.sort((a: { price: number }, b: { price: number }) => a.price - b.price)[0];
          botResponse = `Tentu! Saya merekomendasikan ${cheapest.name} seharga ${formatRupiah(cheapest.price)}. Menarik bukan?`;
        } catch {
          botResponse = "Cek menu 'Paket' untuk daftar harga termurah!";
        }
      } else if (lowerText.includes('bayar')) {
        botResponse = "Pembayaran bisa via GoPay, DANA, OVO atau VA Bank. Sangat cepat!";
      }

      setMessages(prev => [...prev, { text: botResponse, sender: 'bot', timestamp: new Date() }]);
      setTyping(false);
    }, 1200);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/6281234567890?text=Halo%20Admin%20KuotaKuy!%20Saya%20butuh%20bantuan.', '_blank');
  };

  return (
    <Box sx={{ 
      display: location.pathname.startsWith('/admin') ? 'none' : 'flex',
      position: 'fixed', bottom: 30, right: 30, zIndex: 10000, flexDirection: 'column', alignItems: 'flex-end' 
    }}>
      {/* Interactive Chat Window */}
      <Zoom in={isOpen}>
        <Paper elevation={16} sx={{ 
          width: { xs: '90vw', sm: 360 }, height: 500, borderRadius: 6, display: 'flex', flexDirection: 'column', mb: 3, overflow: 'hidden',
          bgcolor: '#FBFCFE', border: '1px solid #E0E7FF', boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
        }}>
          {/* Header */}
          <Box sx={{ p: 2.5, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 40, height: 40 }}><RobotIcon /></Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>KuyBot AI</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Siap membantu 24/7</Typography>
              </Box>
            </Box>
            <Box>
              <IconButton size="small" onClick={openWhatsApp} sx={{ color: 'white', mr: 0.5 }}><WAIcon fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}><CloseIcon fontSize="small" /></IconButton>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((m, i) => (
              <Fade in key={i}>
                <Box sx={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <Paper elevation={0} sx={{ 
                    p: 2, borderRadius: 4, 
                    bgcolor: m.sender === 'user' ? 'primary.main' : 'white', 
                    color: m.sender === 'user' ? 'white' : 'text.primary',
                    border: m.sender === 'user' ? 'none' : '1px solid #EEE'
                  }}>
                    <Typography variant="body2">{m.text}</Typography>
                  </Paper>
                </Box>
              </Fade>
            ))}
            {typing && <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontStyle: 'italic' }}>KuyBot sedang mengetik...</Typography>}
            <div ref={chatEndRef} />
          </Box>

          <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['Paket Termurah', 'Cara Bayar'].map((action) => (
              <Chip key={action} label={action} size="small" clickable onClick={() => handleSend(action)} sx={{ fontWeight: 600, fontSize: '0.65rem' }} />
            ))}
          </Box>

          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #EEE' }}>
            <TextField
              fullWidth size="small" placeholder="Tanya sesuatu..." value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleSend(input)} color="primary" disabled={!input}><SendIcon /></IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 10, bgcolor: '#F8F9FA' }
              }}
            />
          </Box>
        </Paper>
      </Zoom>

      {/* Main Anchor Robot Button */}
      <Box sx={{ position: 'relative' }}>
        <Zoom in={!isOpen && showBubble}>
          <Box sx={{ 
            bgcolor: 'white', p: 1.5, borderRadius: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #FFE0B2', position: 'absolute', top: -60, right: 0, width: 160, 
            animation: 'floatBubble 3s ease-in-out infinite',
            '@keyframes floatBubble': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } }
          }}>
            <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.7rem' }}>Butuh bantuan kilat? Klik saya! 🤖</Typography>
            <Box sx={{ position: 'absolute', bottom: -6, right: 20, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid white' }} />
          </Box>
        </Zoom>

        {/* Pulsing Aura */}
        {!isOpen && (
          <Box sx={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 80, height: 80, bgcolor: 'primary.main', borderRadius: '50%', opacity: 0.2,
            animation: 'pulseGlowRobot 2s infinite',
            '@keyframes pulseGlowRobot': {
              '0%': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: 0.3 },
              '100%': { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 }
            }
          }} />
        )}

        <IconButton 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(!isOpen)}
          sx={{ 
            width: 70, height: 70, bgcolor: 'primary.main', color: 'white',
            boxShadow: '0 15px 40px rgba(255,112,67,0.4)',
            transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': { bgcolor: '#FF5722', transform: 'scale(1.1) rotate(5deg)' },
            animation: !isOpen ? 'floatIconAnchor 4s ease-in-out infinite' : 'none',
            '@keyframes floatIconAnchor': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } }
          }}
        >
          {isOpen ? (
            <CloseIcon sx={{ fontSize: 30 }} />
          ) : (
            isHovered ? <WAIcon sx={{ fontSize: 34 }} /> : <RobotIcon sx={{ fontSize: 42 }} />
          )}

          {/* Robot Eye Blink Indicators - Only show when bot is visible */}
          {!isOpen && !isHovered && (
             <Box sx={{ 
                position: 'absolute', top: 18, right: 18, width: 6, height: 6, 
                bgcolor: '#66BB6A', borderRadius: '50%', border: '2px solid white',
                animation: 'blinkEye 3s infinite',
                '@keyframes blinkEye': { '0%, 90%, 100%': { opacity: 1 }, '95%': { opacity: 0.2 } }
              }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatWidget;
