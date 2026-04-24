/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Scissors, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Instagram, 
  Facebook, 
  Phone, 
  MapPin, 
  Clock, 
  User, 
  MessageCircle,
  Quote,
  Star
} from 'lucide-react';

// --- SVGs & Components ---

const LogoSVG = ({ className = "h-48" }: { className?: string }) => (
  <svg viewBox="0 0 400 480" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background Shield - Perfectly Symmetrical */}
    <path d="M200 450C200 450 370 400 370 200V80L200 30L30 80V200C30 400 200 450 200 450Z" fill="#FFFFFF" />
    
    {/* Outer Borders - Clean and Balanced */}
    <path d="M200 450C200 450 370 400 370 200V80L200 30L30 80V200C30 400 200 450 200 450Z" fill="none" stroke="#000000" strokeWidth="12" />
    <path d="M200 432C200 432 350 385 350 200V92L200 45L50 92V200C50 385 200 432 200 432Z" fill="none" stroke="#000000" strokeWidth="2" />
    
    {/* Refined Crown at the Top Peak */}
    <path d="M170 80 L180 65 L200 85 L220 65 L230 80 L220 100 L180 100 Z" fill="#000000" />
    <circle cx="170" cy="80" r="4" fill="#000000" />
    <circle cx="200" cy="65" r="4" fill="#000000" />
    <circle cx="230" cy="80" r="4" fill="#000000" />

    {/* Elegant mustache - Symmetrical center */}
    <path d="M120 180 C120 180 160 145 200 180 C240 145 280 180 280 180 C280 180 260 225 200 210 C140 225 120 180 120 180Z" fill="#000000" />
    
    {/* Clean Separator Line */}
    <line x1="120" y1="240" x2="280" y2="240" stroke="#000000" strokeWidth="2" />

    {/* Perfectly Balanced Crossed Scissors */}
    <g transform="translate(200, 310)" fill="#000000">
      {/* Right blade */}
      <rect x="-8" y="-70" width="16" height="140" rx="8" transform="rotate(45)" />
      {/* Left blade */}
      <rect x="-8" y="-70" width="16" height="140" rx="8" transform="rotate(-45)" />
      
      {/* Finger rings */}
      <circle cx="-65" cy="-75" r="28" fill="none" stroke="#000000" strokeWidth="12" />
      <circle cx="65" cy="-75" r="28" fill="none" stroke="#000000" strokeWidth="12" />
      
      {/* Pivot point */}
      <circle cx="0" cy="-15" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
    </g>

    {/* Decorative Symmetrical Stars */}
    <g fill="#000000">
      <path d="M90 280 L100 290 L110 280 L100 270 Z" />
      <path d="M310 280 L300 290 L290 280 L300 270 Z" />
      <path d="M200 395 L210 410 L200 425 L190 410 Z" />
    </g>
  </svg>
);

const FlourishSVG = () => (
  <svg width="240" height="40" viewBox="0 0 240 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-gold">
    <path d="M0 20C40 20 60 5 80 5C100 5 110 35 120 35C130 35 140 5 160 5C180 5 200 20 240 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <circle cx="120" cy="15" r="3" fill="currentColor" />
  </svg>
);

// --- Data ---

const BARBERS = [
  { id: 1, name: "Barbero 1", specialty: "Cortes clásicos", exp: "8 años" },
  { id: 2, name: "Barbero 2", specialty: "Degradados y diseños", exp: "5 años" },
  { id: 3, name: "Barbero 3", specialty: "Barba y perfiles", exp: "12 años" },
];

const SERVICES = [
  { id: 1, name: "Corte clásico", price: "$20.000", desc: "Acabado tradicional a tijera o máquina.", icon: <Scissors className="w-8 h-8" /> },
  { id: 2, name: "Degrade", price: "$22.000", desc: "Fade moderno con técnica de precisión.", icon: <User className="w-8 h-8" /> },
  { id: 3, name: "Barba completa", price: "$15.000", desc: "Perfilado, hidratación y toalla caliente.", icon: <Scissors className="w-8 h-8" /> },
  { id: 4, name: "Corte + Barba", price: "$30.000", desc: "El servicio premium completo.", icon: <Scissors className="w-8 h-8" /> },
  { id: 5, name: "Cejas", price: "$5.000", desc: "Limpieza y perfilado especializado.", icon: <Scissors className="w-8 h-8" /> },
  { id: 6, name: "Afeitado clásico", price: "$10.000", desc: "Navaja tradicional y masajes cutáneos.", icon: <Scissors className="w-8 h-8" /> },
];

const TESTIMONIALS = [
  { name: "Carlos M.", text: "La mejor experiencia. La atención al detalle de los muchachos es insuperable.", stars: 5 },
  { name: "Juan P.", text: "Ambiente exclusivo y un corte perfecto. Definitivamente mi barbería de confianza.", stars: 5 },
  { name: "Sebastián R.", text: "El servicio de barba con toalla caliente es de otro mundo. Super recomendado.", stars: 5 },
];

// --- Main App Component ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showToast, setShowToast] = useState(false);

  // Reservation Logic
  const hours = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const occupiedHours = ["11:00", "15:00"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: (firstDay + 6) % 7 }, (_, i) => i);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));

  const handleConfirm = () => {
    if (selectedBarber && selectedDate && selectedHour) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="font-sans text-white selection:bg-gold selection:text-black pro-radial-bg min-h-screen">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black border-2 border-gold px-8 py-4 rounded-2xl flex items-center gap-3 gold-shadow"
          >
            <Check className="text-gold" />
            <span className="font-semibold text-gold">✓ Turno reservado con éxito</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoSVG className="h-12 w-auto" />
            <span className="font-serif text-2xl font-bold tracking-tight hidden sm:block">THE BARBERS</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {["Reservas", "Servicios", "Equipo", "Galería", "Contacto"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium hover:text-gold transition-colors duration-200"
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => document.getElementById('reservas')?.scrollIntoView()}
              className="bg-gold text-black px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gold-hover transition-all duration-300"
            >
              Reservar
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#0A0A0A] border-b border-border-gold overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {["Reservas", "Servicios", "Equipo", "Galería", "Contacto"].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-medium"
                  >
                    {item}
                  </a>
                ))}
                <button 
                  onClick={() => { setIsMenuOpen(false); document.getElementById('reservas')?.scrollIntoView(); }}
                  className="bg-gold text-black w-full py-4 rounded-xl font-bold text-lg"
                >
                  Reservar Turno
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[95vh] flex flex-col items-center justify-center pt-24 px-6 diagonal-pattern overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center z-10"
        >
          <div className="relative mb-12 group">
             <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full scale-150 transition-all group-hover:scale-175 opacity-0 group-hover:opacity-100 duration-1000"></div>
             <LogoSVG className="h-44 md:h-64 mx-auto drop-shadow-[0_0_30px_rgba(201,168,76,0.1)] relative z-10" />
          </div>
          <h1 className="font-serif text-6xl md:text-9xl font-bold mb-4 tracking-tighter">THE BARBERS</h1>
          <FlourishSVG />
          <p className="mt-8 text-xl md:text-2xl text-[#AAAAAA] font-light tracking-[0.3em] uppercase italic">Precisión. Estilo. Distinción.</p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('reservas')?.scrollIntoView()}
              className="bg-gold text-black px-10 py-5 rounded-[20px] font-bold text-lg hover:bg-gold-hover transition-all duration-300 transform hover:scale-105"
            >
              Reservar turno
            </button>
            <button 
              onClick={() => document.getElementById('servicios')?.scrollIntoView()}
              className="border-2 border-gold text-gold px-10 py-5 rounded-[20px] font-bold text-lg hover:bg-gold-muted transition-all duration-300"
            >
              Ver servicios
            </button>
          </div>
        </motion.div>
      </header>

      {/* Reservation Section */}
      <section id="reservas" className="py-20 md:py-32 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Reservá tu turno</h2>
            <p className="text-[#AAAAAA] font-light text-lg">Rápido, simple y sin llamadas.</p>
            <div className="w-24 h-0.5 bg-gold mx-auto mt-6"></div>
          </div>

          <div className="space-y-16">
            {/* Step 1: Barber Selection */}
            <div>
              <h3 className="text-xl font-serif font-bold mb-10 flex items-center gap-4">
                <span className="w-10 h-10 rounded-full border border-gold/30 text-gold flex items-center justify-center text-sm font-bold bg-gold/5 italic">1</span>
                ¿Con quién te vas a cortar?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BARBERS.map((barber) => (
                  <button 
                    key={barber.id}
                    onClick={() => setSelectedBarber(barber.id)}
                    className={`p-8 rounded-[32px] bg-[#1A1A1A] border-2 transition-all duration-500 text-left gold-shadow ${
                      selectedBarber === barber.id ? 'border-gold bg-gold/[0.03] scale-105' : 'border-gold/10 bg-transparent'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                      selectedBarber === barber.id ? 'bg-gold text-black shadow-lg shadow-gold/20 rotate-6' : 'bg-white/5 text-white'
                    }`}>
                      <User size={28} />
                    </div>
                    <div className={`font-serif text-2xl font-bold ${selectedBarber === barber.id ? 'text-gold' : 'text-white'}`}>{barber.name}</div>
                    <div className="text-sm text-[#AAAAAA] mt-2 font-light italic">{barber.specialty}</div>
                    {selectedBarber === barber.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 text-gold flex justify-end">
                        <Check size={20} />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Calendar */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h3 className="text-xl font-serif font-bold mb-10 flex items-center gap-4">
                <span className="w-10 h-10 rounded-full border border-gold/30 text-gold flex items-center justify-center text-sm font-bold bg-gold/5 italic">2</span>
                Seleccioná una fecha
              </h3>
              <div className="bg-[#1A1A1A]/40 backdrop-blur-xl p-10 rounded-[40px] border border-gold/10 gold-shadow">
                <div className="flex items-center justify-between mb-10 border-b border-gold/10 pb-6">
                  <h4 className="font-serif text-3xl text-white italic">
                    {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </h4>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:text-gold transition-colors"><ChevronLeft /></button>
                    <button onClick={nextMonth} className="p-2 hover:text-gold transition-colors"><ChevronRight /></button>
                  </div>
                </div>
                <div className="calendar-grid text-center">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => <div key={d} className="text-[#AAAAAA] text-xs font-bold mb-4">{d}</div>)}
                  {blanks.map(i => <div key={`blank-${i}`} />)}
                  {days.map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`h-12 w-full rounded-xl flex items-center justify-center transition-all duration-200 border ${
                        selectedDate === d 
                          ? 'bg-gold text-black font-bold border-gold rounded-full' 
                          : 'bg-[#1A1A1A] text-white border-transparent hover:border-gold'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Step 3: Hour Selection */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  {/* Step 3: Hour Selection */}
                  <div className="mt-12">
                     <h3 className="text-xl font-serif font-bold mb-10 flex items-center gap-4">
                        <span className="w-10 h-10 rounded-full border border-gold/30 text-gold flex items-center justify-center text-sm font-bold bg-gold/5 italic">3</span>
                        Elegí un horario
                     </h3>
                     <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {hours.map((h) => {
                      const isOccupied = occupiedHours.includes(h);
                      return (
                        <button
                          key={h}
                          disabled={isOccupied}
                          onClick={() => setSelectedHour(h)}
                          className={`py-3 rounded-full border text-sm font-medium transition-all ${
                            isOccupied 
                              ? 'bg-[#111111] text-[#444444] border-transparent line-through cursor-not-allowed'
                              : selectedHour === h
                                ? 'bg-gold text-black border-gold font-bold scale-105'
                                : 'bg-[#1A1A1A] text-white border-[#2A2A2A] hover:border-gold'
                          }`}
                        >
                          {h}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Step 4: Client Info */}
                  <AnimatePresence>
                    {selectedHour && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="overflow-hidden mt-12"
                      >
                        <h3 className="text-xl font-serif font-bold mb-10 flex items-center gap-4">
                          <span className="w-10 h-10 rounded-full border border-gold/30 text-gold flex items-center justify-center text-sm font-bold bg-gold/5 italic">4</span>
                          Tus datos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold mb-3 text-gold uppercase tracking-[0.2em]">Nombre completo</label>
                            <input 
                              type="text" 
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              className="w-full bg-[#1A1A1A] border border-gold/10 rounded-2xl p-5 text-white focus:outline-none focus:border-gold transition-all" 
                              placeholder="Ej: Juan Pérez"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-3 text-gold uppercase tracking-[0.2em]">Teléfono</label>
                            <input 
                              type="tel" 
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              className="w-full bg-[#1A1A1A] border border-gold/10 rounded-2xl p-5 text-white focus:outline-none focus:border-gold transition-all" 
                              placeholder="Ej: 11 1234 5678"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
            </AnimatePresence>

            <button 
              disabled={!selectedBarber || !selectedDate || !selectedHour || !clientName || !clientPhone}
              onClick={handleConfirm}
              className={`w-full py-5 rounded-[20px] font-bold text-lg transition-all duration-300 ${
                !selectedBarber || !selectedDate || !selectedHour || !clientName || !clientPhone
                  ? 'bg-[#2A2A2A] text-[#666666] cursor-not-allowed'
                  : 'bg-gold text-black hover:bg-gold-hover hover:scale-[1.01] active:scale-100 gold-shadow'
              }`}
            >
              Confirmar reserva
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Nuestros servicios</h2>
            <div className="w-24 h-0.5 bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((s) => (
              <motion.div 
                whileHover={{ y: -15, scale: 1.02 }}
                key={s.id}
                className="bg-[#1A1A1A]/40 backdrop-blur-sm p-10 rounded-[32px] border border-gold/10 transition-all hover:border-gold/40 gold-shadow group"
              >
                <div className="text-gold mb-10 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 bg-gold/5 w-16 h-16 rounded-2xl flex items-center justify-center">
                  {s.icon}
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-2xl font-bold">{s.name}</h3>
                  <span className="text-gold font-bold text-xl">{s.price}</span>
                </div>
                <div className="ornament-line mb-6 opacity-10"></div>
                <p className="text-[#AAAAAA] font-light leading-relaxed italic">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-20 md:py-32 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Conocé al equipo</h2>
            <div className="w-24 h-0.5 bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {BARBERS.map((b) => (
              <div key={b.id} className="bg-[#1A1A1A]/50 backdrop-blur-sm rounded-[40px] overflow-hidden border border-gold/10 gold-shadow hover:border-gold/30 transition-all duration-500 group">
                <div className="h-72 bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gold/5 diagonal-pattern opacity-50"></div>
                   <User className="text-white opacity-5 w-40 h-40 absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 transition-transform group-hover:scale-110" />
                   <div className="w-40 h-40 rounded-full border-2 border-gold/10 flex items-center justify-center bg-black/50 backdrop-blur-xl z-10 transition-all duration-500 group-hover:border-gold/40 group-hover:scale-105">
                     <User size={80} className="text-white" />
                   </div>
                </div>
                <div className="p-10">
                  <h3 className="font-serif text-3xl font-bold mb-2 italic">{b.name}</h3>
                  <div className="text-[#AAAAAA] mb-6 font-light uppercase tracking-widest text-xs italic">{b.specialty}</div>
                  <div className="text-gold font-bold mb-8 flex items-center gap-3 text-sm italic">
                    <Clock size={18} className="text-gold/50" /> {b.exp} de experiencia
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 bg-[#050505] border border-gold/20 text-gold text-[10px] rounded-full uppercase tracking-[0.2em] font-bold italic">Maestro</span>
                    <span className="px-4 py-1.5 bg-[#050505] border border-gold/20 text-gold text-[10px] rounded-full uppercase tracking-[0.2em] font-bold italic">Precisión</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galería" className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Nuestro trabajo</h2>
            <div className="w-24 h-0.5 bg-gold mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05, y: -5 }}
                className="h-[180px] md:h-[280px] bg-[#1A1A1A]/40 backdrop-blur-sm rounded-[32px] border border-gold/10 flex items-center justify-center hover:border-gold/30 transition-all duration-500 gold-shadow overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-gold/5 diagonal-pattern opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Scissors className="text-gold opacity-10 w-16 h-16 md:w-24 md:h-24 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
            <div className="w-24 h-0.5 bg-gold mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-[#1A1A1A]/30 backdrop-blur-md p-12 rounded-[48px] border border-gold/10 gold-shadow relative">
                <div className="absolute top-0 right-10 -translate-y-1/2 w-12 h-12 bg-black border border-gold/20 rounded-full flex items-center justify-center">
                  <Quote className="text-gold w-6 h-6" />
                </div>
                <p className="italic text-[#AAAAAA] text-xl mb-10 leading-relaxed font-light font-serif">"{t.text}"</p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#050505] flex items-center justify-center border border-gold/10">
                    <User className="text-gold/50" size={24} />
                  </div>
                  <div>
                    <div className="font-serif text-lg font-bold text-white italic">{t.name}</div>
                    <div className="flex gap-1 mt-1.5">
                      {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="text-gold fill-gold" size={14} />)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Encontranos</h2>
            <div className="w-24 h-0.5 bg-gold mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info Side */}
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold border border-gold/20">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold mb-2">Ubicación</h4>
                    <p className="text-[#AAAAAA] text-lg">Calle Ficticia 1234<br />CABA, Argentina</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold border border-gold/20">
                    <Clock size={28} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold mb-2">Horarios</h4>
                    <p className="text-[#AAAAAA] text-lg font-light tracking-wide uppercase">Lunes a Sábado<br /><span className="text-white font-bold tracking-normal italic">09:00 — 20:00</span></p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold border border-gold/20">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold mb-2">Teléfono</h4>
                    <p className="text-[#AAAAAA] text-xl">+54 11 1234 5678</p>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-3 bg-gold text-black px-10 py-5 rounded-[20px] font-bold text-lg hover:bg-gold-hover transition-all gold-shadow group">
                <MessageCircle className="group-hover:translate-x-1 transition-transform" />
                Escribinos por WhatsApp
              </button>

              <div className="h-[300px] bg-[#1A1A1A] rounded-[24px] border border-gold/10 overflow-hidden relative shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.34757657!2d-58.452668!3d-34.575089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5973fe62737%3A0xc34a5d8934578168!2zQXYuIMOBbHZhcmV6IFRob21hcyAxMjM0LCBDMTQyN0RCWiBDQUJB!5e0!3m2!1ses-419!2sar!4v1713980000000!5m2!1ses-419!2sar" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de The Barbers"
                ></iframe>
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-[#111111]/80 backdrop-blur-xl p-10 md:p-14 rounded-[56px] border border-gold/10 gold-shadow">
              <h3 className="font-serif text-4xl font-bold mb-10 italic">Envianos un mensaje</h3>
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-bold mb-4 text-gold uppercase tracking-[0.3em] font-sans">Nombre Completo</label>
                  <input type="text" className="w-full bg-[#050505] border border-gold/10 rounded-2xl p-6 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 placeholder:text-[#333]" placeholder="Ej: Juan Pérez" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-4 text-gold uppercase tracking-[0.3em] font-sans">Email</label>
                  <input type="email" className="w-full bg-[#050505] border border-gold/10 rounded-2xl p-6 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 placeholder:text-[#333]" placeholder="juan@ejemplo.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-4 text-gold uppercase tracking-[0.3em] font-sans">Mensaje</label>
                  <textarea rows={4} className="w-full bg-[#050505] border border-gold/10 rounded-2xl p-6 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 resize-none placeholder:text-[#333]" placeholder="¿En qué podemos ayudarte?"></textarea>
                </div>
                <button className="w-full bg-gold text-black py-6 rounded-[24px] font-bold text-xl hover:bg-gold-hover transition-all duration-500 gold-shadow shadow-gold/30 uppercase tracking-widest active:scale-[0.98]">Enviar Mensaje</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] pt-24 pb-12 border-t border-gold/10 rounded-t-[80px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
            <div className="flex items-center gap-4">
              <LogoSVG className="h-16 w-auto" />
              <div className="font-serif text-3xl font-bold tracking-tight">THE BARBERS</div>
            </div>
            
            <div className="flex gap-10">
              <a href="#" className="flex items-center gap-3 text-[#AAAAAA] hover:text-gold transition-colors font-medium">
                <Instagram size={20} /> Instagram
              </a>
              <a href="#" className="flex items-center gap-3 text-[#AAAAAA] hover:text-gold transition-colors font-medium">
                <Facebook size={20} /> Facebook
              </a>
            </div>
          </div>

          <div className="mb-16">
             <FlourishSVG />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-[#222222] text-[#666666] text-sm">
            <p>© 2025 The Barbers. Todos los derechos reservados.</p>
            <div className="flex gap-8 mt-6 md:mt-0 uppercase tracking-widest font-bold text-[10px]">
              <a href="#" className="hover:text-gold transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-gold transition-colors">Términos y Condiciones</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
