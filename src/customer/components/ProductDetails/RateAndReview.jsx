import React, { useState, useEffect } from "react";
import { Rating, LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import SendIcon from "@mui/icons-material/Send";
import { authService, reviewService } from "../../../services";

const RateAndReview = ({ product, productId: propProductId }) => {
    const routeParams = useParams();
    const currentProductId = propProductId || product?.id || routeParams.productId;

    const [reviews, setReviews] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [likedReviews, setLikedReviews] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New review form states
    const [newRating, setNewRating] = useState(5);
    const [newTitle, setNewTitle] = useState("");
    const [newComment, setNewComment] = useState("");

    const loadReviews = async () => {
        if (!currentProductId) return;
        try {
            const list = await reviewService.fetchReviewsByProductId(currentProductId, product);
            setReviews(list);
        } catch (err) {
            console.warn("Error loading reviews:", err);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [currentProductId]);

    const handleToggleLike = (id) => {
        setLikedReviews((prev) => {
            const isLiked = prev[id];
            const updatedLikes = isLiked ? -1 : 1;

            setReviews((prevReviews) =>
                prevReviews.map((r) => (r.id === id ? { ...r, likes: (r.likes || 0) + updatedLikes } : r))
            );

            return { ...prev, [id]: !isLiked };
        });
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!newComment.trim()) {
            alert("Vui lòng nhập nội dung đánh giá chi tiết!");
            return;
        }

        try {
            setIsSubmitting(true);
            const user = await authService.getCurrentUser();
            
            const reviewPayload = {
                productId: String(currentProductId),
                storeId: product?.id_store || product?.storeId || "store-001",
                userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "Khách hàng NexCart",
                avatarUrl: user?.avatarUrl || "",
                rating: newRating,
                title: newTitle.trim() || "Đánh giá chất lượng",
                comment: newComment.trim(),
            };

            const saved = await reviewService.createReview(reviewPayload);
            setReviews((prev) => [saved, ...prev]);
            
            setNewTitle("");
            setNewComment("");
            setNewRating(5);
            setShowReviewForm(false);
            alert("Cảm ơn bạn đã gửi đánh giá cho sản phẩm!");
        } catch (err) {
            console.error("Error creating review:", err);
            alert("Có lỗi xảy ra khi lưu đánh giá lên server!");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate dynamic rating metrics
    const totalReviewsCount = reviews.length;
    const avgRatingScore = totalReviewsCount > 0
        ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / totalReviewsCount).toFixed(1)
        : (product?.rating ? Number(product.rating).toFixed(1) : "5.0");

    const satisfiedPercent = totalReviewsCount > 0
        ? Math.round((reviews.filter((r) => Number(r.rating) >= 4).length / totalReviewsCount) * 100)
        : 100;

    const starCountsBreakdown = [5, 4, 3, 2, 1].map((stars) => {
        const count = reviews.filter((r) => Math.round(Number(r.rating)) === stars).length;
        const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
        return { stars, count, percentage };
    });

    const filteredReviews = (reviews || []).filter((r) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "5") return Math.round(Number(r.rating)) === 5;
        if (activeFilter === "4") return Math.round(Number(r.rating)) === 4;
        if (activeFilter === "3") return Math.round(Number(r.rating)) === 3;
        if (activeFilter === "low") return Math.round(Number(r.rating)) <= 2;
        return true;
    });

    return (
        <div className="py-10 border-t border-gray-200 font-sans">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                        Customer Ratings & Reviews
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Đánh giá thực tế từ các khách hàng đã trải nghiệm sản phẩm này
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                    <RateReviewOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>{showReviewForm ? "Đóng Form Đánh Giá" : "Viết Đánh Giá"}</span>
                </button>
            </div>

            {/* Review Form Modal / Collapse */}
            {showReviewForm && (
                <form
                    onSubmit={handleAddReview}
                    className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-6 sm:p-8 mb-10 shadow-xs transition-all animate-in fade-in slide-in-from-top-4 duration-300"
                >
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-1">
                        Viết đánh giá của bạn
                    </h3>
                    <p className="text-xs text-gray-500 mb-6">
                        Chia sẻ cảm nhận chân thực về chất lượng sản phẩm và trải nghiệm mua sắm
                    </p>

                    <div className="space-y-4">
                        {/* Rating Star Selection */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Đánh giá sao *
                            </label>
                            <Rating
                                name="new-rating"
                                value={newRating}
                                onChange={(e, val) => setNewRating(val || 5)}
                                size="medium"
                                sx={{ color: "#6366f1" }}
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Tiêu đề đánh giá
                            </label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Ví dụ: Sản phẩm rất tốt, giao hàng nhanh!"
                                className="w-full bg-white border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 rounded-xl px-4 py-2.5 text-xs text-gray-900 outline-none transition-all"
                            />
                        </div>

                        {/* Comment Content */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Nội dung chi tiết *
                            </label>
                            <textarea
                                rows={3}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Hãy mô tả chi tiết cảm nhận của bạn về chất liệu, kích cỡ, độ hoàn thiện..."
                                required
                                className="w-full bg-white border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 rounded-xl p-4 text-xs text-gray-900 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Form Submit Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(false)}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center gap-1.5 px-6 py-2.5 text-white text-xs font-bold rounded-xl shadow-md transition-all ${
                                    isSubmitting
                                        ? "bg-indigo-400 cursor-not-allowed opacity-80"
                                        : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 cursor-pointer"
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        <span>Đang gửi...</span>
                                    </>
                                ) : (
                                    <>
                                        <SendIcon sx={{ fontSize: 14 }} />
                                        <span>Gửi đánh giá</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Ratings Summary Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs">
                {/* Overall Score Box */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-indigo-50/50 to-white rounded-2xl border border-indigo-50">
                    {totalReviewsCount > 0 ? (
                        <>
                            <span className="text-5xl font-black text-gray-900 tracking-tight mb-2">
                                {avgRatingScore}
                            </span>
                            <Rating value={Number(avgRatingScore)} precision={0.1} readOnly size="medium" sx={{ color: "#6366f1" }} />
                            <p className="text-xs font-semibold text-gray-500 mt-2">
                                Dựa trên {totalReviewsCount} lượt đánh giá
                            </p>
                            <span className="mt-3 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                                {satisfiedPercent}% Khách hàng hài lòng
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="text-xl font-extrabold text-gray-400 mb-2">
                                Chưa có đánh giá
                            </span>
                            <Rating value={0} readOnly size="medium" sx={{ color: "#cbd5e1" }} />
                            <p className="text-xs text-gray-500 mt-2">
                                0 lượt đánh giá từ khách hàng
                            </p>
                            <span className="mt-3 text-[11px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Chưa có dữ liệu
                            </span>
                        </>
                    )}
                </div>

                {/* Star Progress Bars */}
                <div className="lg:col-span-8 flex flex-col justify-center space-y-3">
                    {starCountsBreakdown.map((row) => (
                        <div key={row.stars} className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 w-14 text-gray-600 font-bold">
                                <span>{row.stars}</span>
                                <StarIcon sx={{ fontSize: 14 }} className={totalReviewsCount > 0 ? "text-amber-400" : "text-gray-300"} />
                            </div>
                            <div className="flex-1">
                                <LinearProgress
                                    variant="determinate"
                                    value={row.percentage}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: "#f1f5f9",
                                        "& .MuiLinearProgress-bar": {
                                            bgcolor: "#6366f1",
                                            borderRadius: 4,
                                        },
                                    }}
                                />
                            </div>
                            <span className="w-10 text-right font-semibold text-gray-400">
                                {row.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Tabs */}
            {totalReviewsCount > 0 && (
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { id: "all", label: `Tất cả (${totalReviewsCount})` },
                        { id: "5", label: `5 Sao (${starCountsBreakdown.find((s) => s.stars === 5)?.count || 0})` },
                        { id: "4", label: `4 Sao (${starCountsBreakdown.find((s) => s.stars === 4)?.count || 0})` },
                        { id: "3", label: `3 Sao (${starCountsBreakdown.find((s) => s.stars === 3)?.count || 0})` },
                        { id: "low", label: "1-2 Sao" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveFilter(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                                activeFilter === tab.id
                                    ? "bg-indigo-600 text-white shadow-xs"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-2xs space-y-3 hover:shadow-md transition-shadow"
                        >
                            {/* Reviewer Header */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl overflow-hidden bg-indigo-50 shrink-0 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm">
                                        {review.avatarUrl ? (
                                            <img src={review.avatarUrl} alt={review.userName} className="w-full h-full object-cover" />
                                        ) : (
                                            (review.userName || "U").charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                                                {review.userName}
                                            </h4>
                                            {review.verified && (
                                                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                    <CheckCircleIcon sx={{ fontSize: 12 }} />
                                                    Đã mua hàng
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[11px] text-gray-400 font-medium">
                                            {review.date || "Vừa xong"}
                                        </span>
                                    </div>
                                </div>

                                {/* Rating */}
                                <Rating value={Number(review.rating) || 5} readOnly size="small" sx={{ color: "#6366f1" }} />
                            </div>

                            {/* Title & Comment */}
                            <div className="space-y-1 pl-1">
                                {review.title && (
                                    <h5 className="text-xs sm:text-sm font-extrabold text-gray-900">
                                        {review.title}
                                    </h5>
                                )}
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                                    {review.comment}
                                </p>
                            </div>

                            {/* Footer Action */}
                            <div className="flex items-center justify-end pt-2 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={() => handleToggleLike(review.id)}
                                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                        likedReviews[review.id]
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} />
                                    <span>Hữu ích ({review.likes || 0})</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-2xs my-4">
                        <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                            <RateReviewOutlinedIcon sx={{ fontSize: 28 }} />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 mb-1">Chưa có đánh giá nào</h4>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                            Hãy là người đầu tiên trải nghiệm và gửi đánh giá cho sản phẩm này!
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default RateAndReview;
