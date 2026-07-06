import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, User, CreditCard, CheckCircle2, ChevronRight, X, Wallet, Building2, QrCode, Search } from 'lucide-react';
import { games, paymentMethods, type Game, type Package, type PaymentMethod } from './data';

function StoreApp() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [currentOrderId, setCurrentOrderId] = useState('');
  
  // Auth and Voucher states
  const [currentUser, setCurrentUser] = useState<{name: string, email: string} | null>(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState({ text: '', type: '' });

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (showQrisModal && currentOrderId) {
      interval = setInterval(async () => {
        try {
          // Check local storage first (for static hosting like Vercel)
          const isPaidLocally = localStorage.getItem('qris_paid_' + currentOrderId) === 'true';
          
          let isPaidServer = false;
          try {
            const res = await fetch(`/api/payment-status/${currentOrderId}`);
            const data = await res.json();
            isPaidServer = data.paid;
          } catch (e) {
            // Ignore API errors if on Vercel
          }

          if (isPaidLocally || isPaidServer) {
            clearInterval(interval);
            proceedWithPayment(currentOrderId);
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [showQrisModal, currentOrderId]);

  const proceedWithPayment = (orderId?: string) => {
    if (!selectedGame || !userId || !selectedPackage || !selectedPayment) return;
    if (selectedGame.requiresZoneId && !zoneId) return;

    setErrorMsg('');
    setIsProcessing(true);
    setShowQrisModal(false);

    const finishPayment = () => {
      const receipt = {
        orderId: orderId || ('ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase()),
        date: new Date().toLocaleString('id-ID'),
        game: selectedGame.name,
        userId: `${userId}${zoneId ? ` / ${zoneId}` : ''}`,
        item: `${selectedPackage.amount} ${selectedGame.currency}`,
        payment: selectedPayment.name,
        subtotal: selectedPackage.price,
        fee: selectedPayment.fee,
        discount: discountAmount,
        total: selectedPackage.price + selectedPayment.fee - discountAmount,
      };

      setReceiptData(receipt);
      setIsProcessing(false);
      setShowReceipt(true);
    };

    if (orderId) {
      // For QRIS, it's already paid, just show receipt
      finishPayment();
    } else {
      // Simulate payment delay of 5-10 seconds as requested for other methods
      const delay = Math.floor(Math.random() * 5000) + 5000;
      setTimeout(finishPayment, delay);
    }
  };

  const handlePay = () => {
    if (!selectedGame || !userId || !selectedPackage || !selectedPayment) return;
    if (selectedGame.requiresZoneId && !zoneId) return;

    if (selectedPayment.type === 'qris') {
      const orderId =
        'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();

      setCurrentOrderId(orderId);
      setShowQrisModal(true);
      return;
    }
    proceedWithPayment();
  };

  const resetForm = () => {
    setUserId('');
    setZoneId('');
    setSelectedPackage(null);
    setSelectedPayment(null);
    setErrorMsg('');
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    resetForm();
  };

  const isFormValid = () => {
    if (!selectedGame || !userId || !selectedPackage || !selectedPayment) return false;
    if (selectedGame.requiresZoneId && !zoneId) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Gamepad2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">G-Store</h1>
              <p className="text-xs text-indigo-400 font-medium">Instant Game Top Up</p>
            </div>
          </div>
          
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-white/5 rounded-full pl-2 pr-4 py-1.5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setCurrentUser(null)}>
                <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-sm font-medium text-white">{currentUser.name}</div>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentUser({ name: 'Bagas', email: 'bagasprivasi@gmail.com' })}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Step 1: Select Game */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold">1</span>
            <h2 className="text-xl font-semibold text-white">Pilih Game</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game)}
                className={`relative group overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-square flex flex-col transition-all ${
                  selectedGame?.id === game.id
                    ? 'ring-2 ring-indigo-500 scale-[1.02] shadow-xl shadow-indigo-500/20 bg-indigo-900/40'
                    : 'ring-1 ring-white/10 hover:ring-white/30 hover:scale-[1.02] bg-slate-800'
                }`}
              >
                <div className="p-4 flex-1 flex items-center justify-center w-full">
                  <div className="text-xl font-bold text-white text-center tracking-tight transition-transform group-hover:scale-110">{game.name}</div>
                </div>
                <div className={`w-full p-3 text-center border-t transition-colors ${selectedGame?.id === game.id ? 'border-indigo-500/30 bg-indigo-500/20' : 'border-white/5 bg-white/5 group-hover:bg-white/10'}`}>
                  <h3 className="font-bold text-white text-sm">{game.name}</h3>
                </div>
                {selectedGame?.id === game.id && (
                  <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1 shadow-md z-20">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <AnimatePresence>
          {selectedGame && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Step 2: Account Details */}
              <section className="bg-slate-900 rounded-2xl p-6 ring-1 ring-white/5 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold">2</span>
                  <h2 className="text-xl font-semibold text-white">Masukkan Data Akun</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-2 w-full">
                    <label className="text-sm font-medium text-slate-400">User ID</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => { setUserId(e.target.value); setErrorMsg(''); }}
                        placeholder="Masukkan User ID"
                        className="block w-full pl-10 bg-slate-950 border border-slate-800 rounded-xl py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                  {selectedGame.requiresZoneId && (
                    <div className="w-full sm:w-48 space-y-2">
                      <label className="text-sm font-medium text-slate-400">Zone ID</label>
                      <input
                        type="text"
                        value={zoneId}
                        onChange={(e) => { setZoneId(e.target.value); setErrorMsg(''); }}
                        placeholder="(1234)"
                        className="block w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  )}
                </div>
                
                {errorMsg && (
                  <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {errorMsg}
                  </div>
                )}
                <p className="mt-4 text-xs text-slate-500">
                  Untuk mengetahui User ID Anda, silakan klik menu profile dibagian kiri atas pada menu utama game. User ID akan terlihat dibagian bawah Nama Karakter Game Anda.
                </p>
              </section>

              {/* Step 3: Select Nominal */}
              <section className="bg-slate-900 rounded-2xl p-6 ring-1 ring-white/5 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold">3</span>
                  <h2 className="text-xl font-semibold text-white">Pilih Nominal</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedGame.packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative flex flex-col p-4 rounded-xl text-left transition-all ${
                        selectedPackage?.id === pkg.id
                          ? 'bg-indigo-600 ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/25'
                          : 'bg-slate-950 ring-1 ring-slate-800 hover:ring-slate-600 hover:bg-slate-900'
                      }`}
                    >
                      <span className={`text-lg font-bold ${selectedPackage?.id === pkg.id ? 'text-white' : 'text-slate-200'}`}>
                        {pkg.amount} <span className="text-sm font-normal opacity-80">{selectedGame.currency}</span>
                      </span>
                      <span className={`text-sm mt-1 ${selectedPackage?.id === pkg.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {formatRupiah(pkg.price)}
                      </span>
                      {selectedPackage?.id === pkg.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Step 4: Payment Method */}
              <section className="bg-slate-900 rounded-2xl p-6 ring-1 ring-white/5 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold">4</span>
                  <h2 className="text-xl font-semibold text-white">Pilih Pembayaran</h2>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.type === 'ewallet' ? Wallet : method.type === 'bank' ? Building2 : QrCode;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method)}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                          selectedPayment?.id === method.id
                            ? 'bg-indigo-600/10 ring-2 ring-indigo-500'
                            : 'bg-slate-950 ring-1 ring-slate-800 hover:ring-slate-600'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${selectedPayment?.id === method.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold ${selectedPayment?.id === method.id ? 'text-white' : 'text-slate-200'}`}>
                            {method.name}
                          </div>
                          {method.fee > 0 && (
                            <div className="text-xs text-slate-500">
                              + Biaya {formatRupiah(method.fee)}
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Voucher Section */}
              <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl ring-1 ring-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Gamepad2 className="w-32 h-32" />
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold">5</span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Kode Voucher (Opsional)</h2>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Masukkan kode voucher..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                  <button 
                    onClick={() => {
                      if (voucherCode === 'DISKON20' && selectedPackage) {
                        setDiscountAmount(selectedPackage.price * 0.2);
                        setVoucherMessage({ text: 'Voucher berhasil digunakan! Diskon 20%', type: 'success' });
                      } else {
                        setDiscountAmount(0);
                        setVoucherMessage({ text: 'Kode voucher tidak valid.', type: 'error' });
                      }
                    }}
                    className="px-6 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors whitespace-nowrap"
                  >
                    Gunakan
                  </button>
                </div>
                {voucherMessage.text && (
                  <div className={`mt-3 text-sm font-medium ${voucherMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {voucherMessage.text}
                  </div>
                )}
              </section>
              
              {/* Checkout Footer */}
              <div className="sticky bottom-4 z-30">
                <div className="bg-slate-800/90 backdrop-blur-xl p-4 sm:p-6 rounded-2xl ring-1 ring-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-slate-400">Total Pembayaran</div>
                    <div className="text-2xl font-bold text-white flex items-baseline gap-2">
                      {selectedPackage ? formatRupiah(selectedPackage.price + (selectedPayment?.fee || 0) - discountAmount) : '-'}
                      {selectedPackage && <span className="text-sm font-normal text-slate-400">untuk {selectedPackage.amount} {selectedGame.currency}</span>}
                    </div>
                    {discountAmount > 0 && (
                      <div className="text-xs text-green-400 font-medium">Hemat {formatRupiah(discountAmount)}</div>
                    )}
                  </div>
                  <button
                    onClick={handlePay}
                    disabled={!isFormValid() || isProcessing}
                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Memproses...</span>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Bayar Sekarang</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* QRIS Modal */}
      <AnimatePresence>
        {showQrisModal && selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => !isProcessing && setShowQrisModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 text-center"
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setShowQrisModal(false)} 
                  disabled={isProcessing}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center mb-4">
                <div className="font-bold text-2xl tracking-tighter text-blue-600 italic">QRIS</div>
              </div>

              <div className="text-sm text-slate-500 mb-1">Total Pembayaran</div>
              <div className="text-2xl font-bold text-slate-900 mb-6">
                {formatRupiah(selectedPackage.price + (selectedPayment?.fee || 0) - discountAmount)}
              </div>

              <div className="bg-slate-100 p-4 rounded-2xl mb-6 inline-block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/pay?orderId=${currentOrderId}&amount=${selectedPackage.price + (selectedPayment?.fee || 0) - discountAmount}`)}`}
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto mix-blend-multiply" 
                />
              </div>

              <p className="text-sm text-slate-600 mb-6">
                Scan QR code di atas menggunakan aplikasi e-wallet atau m-banking Anda.
              </p>

              <div className="w-full py-4 bg-indigo-50 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <span>Menunggu Pembayaran...</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceipt && receiptData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setShowReceipt(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Ticket Header */}
              <div className="bg-indigo-600 p-6 text-center text-white relative">
                <div className="absolute top-4 right-4">
                  <button onClick={() => setShowReceipt(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">Transaksi Berhasil!</h3>
                <p className="text-indigo-200 text-sm mt-1">Pembayaran telah kami terima.</p>
              </div>

              {/* Ticket Body */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono font-medium">{receiptData.orderId}</span>
                </div>
                
                <div className="space-y-3 border-b border-slate-100 pb-4">
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-slate-500">Waktu</span>
                    <span className="font-medium text-right">{receiptData.date}</span>
                  </div>
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-slate-500">Game</span>
                    <span className="font-medium text-right">{receiptData.game}</span>
                  </div>
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-slate-500">User ID</span>
                    <span className="font-medium text-right">{receiptData.userId}</span>
                  </div>
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-slate-500">Item</span>
                    <span className="font-medium text-right text-indigo-600">{receiptData.item}</span>
                  </div>
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-slate-500">Metode Pembayaran</span>
                    <span className="font-medium text-right">{receiptData.payment}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span>{formatRupiah(receiptData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Biaya Layanan</span>
                    <span>{formatRupiah(receiptData.fee)}</span>
                  </div>
                  {receiptData.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Diskon</span>
                      <span>-{formatRupiah(receiptData.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-slate-200 border-dashed mt-2">
                    <span>Total Pembayaran</span>
                    <span className="text-indigo-600">{formatRupiah(receiptData.total)}</span>
                  </div>
                </div>
              </div>

              {/* Ticket Footer */}
              <div className="bg-slate-50 p-6 flex flex-col items-center">
                <button
                  onClick={() => {
                    setShowReceipt(false);
                    setSelectedGame(null);
                    resetForm();
                  }}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                >
                  Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MockPaymentPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');
  const amount = urlParams.get('amount');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handlePay = async () => {
    setStatus('processing');
    
    // Fallback for Vercel (static hosting without backend)
    if (orderId) {
      localStorage.setItem('qris_paid_' + orderId, 'true');
    }
    
    try {
      const res = await fetch(`/api/pay/${orderId}`, { method: 'POST' });
      // If API doesn't exist (Vercel), we still consider it success because of localStorage above
      if (res.ok || res.status === 404) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      // Catch fetch errors (like no connection) but still succeed via localstorage for demo
      setStatus('success');
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
        <div className="flex justify-center">
           <div className="font-bold text-3xl tracking-tighter text-blue-600 italic">QRIS</div>
        </div>
        
        {status === 'success' ? (
          <div className="space-y-4">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
             </div>
             <h2 className="text-xl font-bold text-slate-900">Pembayaran Berhasil!</h2>
             <p className="text-slate-500 text-sm">Anda dapat menutup halaman ini.</p>
          </div>
        ) : (
          <>
            <div>
              <div className="text-sm text-slate-500 mb-1">Bayar ke</div>
              <div className="font-bold text-slate-900">G-Store TopUp</div>
            </div>
            
            <div className="py-4 border-y border-slate-100">
               <div className="text-3xl font-bold text-slate-900">{amount ? formatRupiah(parseInt(amount)) : '-'}</div>
            </div>

            <button
              onClick={handlePay}
              disabled={status === 'processing'}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg flex justify-center items-center gap-2"
            >
               {status === 'processing' ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   <span>Memproses...</span>
                 </>
               ) : (
                 'Bayar Sekarang'
               )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function MainApp() {
  const path = window.location.pathname;
  if (path === '/pay') {
    return <MockPaymentPage />;
  }
  return <StoreApp />;
}
