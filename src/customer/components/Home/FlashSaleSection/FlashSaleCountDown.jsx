import React, { useState, useEffect } from 'react';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

export default function FlashSaleCountdown() {
  // Đặt thời gian kết thúc (ví dụ: 4 giờ 22 phút 59 giây từ thời điểm hiện tại)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 4,
    minutes: 22,
    seconds: 59,
  });

  useEffect(() => {
    // Tính tổng số giây còn lại
    let totalSeconds =
      timeLeft.days * 86400 +
      timeLeft.hours * 3600 +
      timeLeft.minutes * 60 +
      timeLeft.seconds;

    if (totalSeconds <= 0) return;

    const timer = setInterval(() => {
      totalSeconds -= 1;

      if (totalSeconds <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(totalSeconds / (3600 * 24));
      const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = Math.floor(totalSeconds % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format số luôn có 2 chữ số (ví dụ: 05 thay vì 5)
  const formatTime = (num) => String(num).padStart(2, '0');

  const timeUnits = [
    { val: formatTime(timeLeft.days), label: 'Days' },
    { val: formatTime(timeLeft.hours), label: 'Hours' },
    { val: formatTime(timeLeft.minutes), label: 'Mins' },
    { val: formatTime(timeLeft.seconds), label: 'Secs' },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-[#e9eef9] px-3.5 py-2 rounded-2xl border border-indigo-100/60 shadow-xs">
      {/* Icon + Label */}
      <div className="flex items-center gap-1 text-[#431fc3] mr-1">
        <AccessTimeFilledIcon className="animate-pulse" sx={{ fontSize: 20 }} />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
          Ends In
        </span>
      </div>

      {/* Timer Display */}
      <div className="flex items-center gap-1.5">
        {timeUnits.map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#431fc3] text-white rounded-xl flex items-center justify-center font-mono text-sm sm:text-base font-bold shadow-sm">
                {item.val}
              </div>
              <span className="text-[9px] font-semibold text-gray-500 uppercase mt-1 tracking-tighter">
                {item.label}
              </span>
            </div>
            {idx < timeUnits.length - 1 && (
              <span className="text-[#431fc3] font-bold text-sm sm:text-base -mt-3.5">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}