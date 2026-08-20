import React, { useRef } from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";

const MAX_IMAGES = 4;

const MediaSection = ({ formData, handleChange }) => {
  const fileInputRef = useRef(null);

  // images[] là mảng base64, imageUrl luôn = images[0] (cover)
  const images = Array.isArray(formData.images) ? formData.images : 
    (formData.imageUrl ? [formData.imageUrl] : []);

  const syncImages = (newImages) => {
    // Cập nhật cả images[] và imageUrl (= ảnh đầu tiên)
    handleChange({ target: { name: "images", value: newImages } });
    handleChange({ target: { name: "imageUrl", value: newImages[0] || "" } });
  };

  // Nén ảnh qua Canvas trước khi lưu base64
  const compressImage = (file, maxPx = 1000, quality = 0.75) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;

          // Scale down nếu vượt maxPx
          if (width > maxPx || height > maxPx) {
            if (width > height) {
              height = Math.round((height / width) * maxPx);
              width = maxPx;
            } else {
              width = Math.round((width / height) * maxPx);
              height = maxPx;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // reset sớm để upload lại cùng file được

    if (images.length >= MAX_IMAGES) {
      alert(`Bạn chỉ có thể upload tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.");
      return;
    }

    try {
      const compressed = await compressImage(file);
      const newImages = [...images, compressed];
      syncImages(newImages);
    } catch {
      alert("Không thể xử lý ảnh. Vui lòng thử ảnh khác.");
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    syncImages(newImages);
  };

  const handleSetCover = (index) => {
    if (index === 0) return;
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    syncImages(newImages);
  };

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
          Product Media
        </h2>
        <span className="text-xs font-semibold text-gray-400">
          {images.length}/{MAX_IMAGES} ảnh · Ảnh đầu = Cover
        </span>
      </div>

      {/* Image URL input (manual) */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Hoặc dán URL ảnh <span className="font-normal text-gray-400">(tùy chọn)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            id="imageUrlInput"
            placeholder="https://images.unsplash.com/..."
            className="flex-1 bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = e.target.value.trim();
                if (!val) return;
                if (images.length >= MAX_IMAGES) {
                  alert(`Tối đa ${MAX_IMAGES} ảnh.`);
                  return;
                }
                syncImages([...images, val]);
                e.target.value = "";
              }
            }}
          />
          <button
            type="button"
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            onClick={() => {
              const input = document.getElementById("imageUrlInput");
              const val = input?.value.trim();
              if (!val) return;
              if (images.length >= MAX_IMAGES) {
                alert(`Tối đa ${MAX_IMAGES} ảnh.`);
                return;
              }
              syncImages([...images, val]);
              if (input) input.value = "";
            }}
          >
            Thêm
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Existing images */}
        {images.map((src, index) => (
          <div
            key={index}
            className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-gray-50 shadow-sm group transition-all ${
              index === 0 ? "border-indigo-500" : "border-gray-200 hover:border-indigo-300"
            }`}
          >
            <img
              src={src}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Cover badge */}
            {index === 0 && (
              <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase shadow">
                COVER
              </span>
            )}

            {/* Hover overlay with actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {/* Set as cover */}
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetCover(index)}
                  className="w-7 h-7 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                  title="Đặt làm ảnh cover"
                >
                  <StarIcon sx={{ fontSize: 14 }} />
                </button>
              )}
              {/* Remove */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="w-7 h-7 rounded-full bg-white/90 text-rose-500 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                title="Xóa ảnh"
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </button>
            </div>

            {/* Index badge */}
            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              {index + 1}
            </span>
          </div>
        ))}

        {/* Upload slot */}
        {canAddMore && (
          <div
            className="aspect-square rounded-2xl border-2 border-dashed border-indigo-200 bg-[#f8f9fc]/60 hover:bg-indigo-50/40 hover:border-indigo-400 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-500 flex items-center justify-center transition-colors">
              <CloudUploadOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-500 transition-colors text-center leading-tight px-1">
              Upload ảnh<br/>
              <span className="font-normal">({images.length}/{MAX_IMAGES})</span>
            </p>
          </div>
        )}

        {/* Empty placeholder slots */}
        {Array.from({ length: Math.max(0, MAX_IMAGES - images.length - (canAddMore ? 1 : 0)) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/40"
          />
        ))}
      </div>

      <p className="text-[11px] text-gray-400">
        Upload tối đa {MAX_IMAGES} ảnh · JPG, PNG hoặc WEBP · Mỗi ảnh tối đa 5MB · Hover vào ảnh để đặt cover hoặc xóa
      </p>
    </div>
  );
};

export default MediaSection;
