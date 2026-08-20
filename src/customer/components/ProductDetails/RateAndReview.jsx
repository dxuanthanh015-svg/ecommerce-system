import React, { useState } from "react";
import { Rating, LinearProgress } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import SendIcon from "@mui/icons-material/Send";


const ratingBreakdownMock = [
    { stars: 5, count: 96, percentage: 75 },
    { stars: 4, count: 23, percentage: 18 },
    { stars: 3, count: 5, percentage: 4 },
    { stars: 2, count: 2, percentage: 2 },
    { stars: 1, count: 2, percentage: 1 },
];

const RateAndReview = () => {
    const [reviews, setReviews] = useState(() => {
        const saved = localStorage.getItem("reviews");
        return saved ? JSON.parse(saved) : [];
    });
    const [activeFilter, setActiveFilter] = useState("all");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [likedReviews, setLikedReviews] = useState({});

    // New review form states
    const [newRating, setNewRating] = useState(5);
    const [newTitle, setNewTitle] = useState("");
    const [newComment, setNewComment] = useState("");

    const handleToggleLike = (id) => {
        setLikedReviews((prev) => {
            const isLiked = prev[id];
            const updatedLikes = isLiked ? -1 : 1;

            setReviews((prevReviews) =>
                prevReviews.map((r) => (r.id === id ? { ...r, likes: r.likes + updatedLikes } : r))
            );

            return { ...prev, [id]: !isLiked };
        });
    };

    const handleAddReview = (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            alert("Vui lòng nhập nội dung đánh giá!");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user")) || {
            firstName: "Bạn",
            lastName: "(Khách hàng)",
        };

        const createdReview = {
            id: Date.now(),
            userName: `${user.firstName || "Người dùng"} ${user.lastName || ""}`.trim(),
            avatarUrl: user.avatarUrl || "",
            rating: newRating,
            date: "Vừa xong",
            title: newTitle.trim() || "Đánh giá tuyệt vời",
            comment: newComment.trim(),
            verified: true,
            likes: 0,
        };

        const updated = [createdReview, ...reviews];
        setReviews(updated);
        localStorage.setItem("reviews", JSON.stringify(updated));
        setNewTitle("");
        setNewComment("");
        setNewRating(5);
        setShowReviewForm(false);
        alert("Cảm ơn bạn đã gửi đánh giá cho sản phẩm!");
    };

    const filteredReviews = (reviews || []).filter((r) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "5") return r.rating === 5;
        if (activeFilter === "4") return r.rating === 4;
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
                        Đánh giá thực tế từ các khách hàng đã mua sản phẩm này
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm hover:shadow-indigo-500/25 transition-all cursor-pointer self-start sm:self-auto"
                >
                    <RateReviewOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>{showReviewForm ? "Đóng Form" : "Viết Đánh Giá"}</span>
                </button>
            </div>

            {/* Interactive Review Form */}
            {showReviewForm && (
                <form onSubmit={handleAddReview} className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 mb-8 space-y-4">
                    <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                        Viết nhận xét của bạn
                    </h3>

                    <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">
                            Đánh giá của bạn
                        </label>
                        <Rating
                            value={newRating}
                            onChange={(e, val) => setNewRating(val || 5)}
                            size="medium"
                            sx={{ color: "#6366f1" }}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">
                            Tiêu đề nhận xét
                        </label>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="VD: Chất lượng tuyệt vời, chuẩn form!"
                            className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">
                            Nội dung chi tiết
                        </label>
                        <textarea
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Hãy chia sẻ trải nghiệm về sản phẩm, đường may, kích thước..."
                            required
                            className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-gray-900"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                            <span>Gửi Đánh Giá</span>
                            <SendIcon sx={{ fontSize: 14 }} />
                        </button>
                    </div>
                </form>
            )}

            {/* Ratings Summary & Breakdown Grid */}
            <div className="bg-[#f8f9fc] rounded-3xl p-6 sm:p-8 border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

                {/* Score Column */}
                <div className="md:col-span-4 text-center md:border-r border-gray-200/80 md:pr-8">
                    <div className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                        4.8
                    </div>
                    <div className="flex justify-center my-2">
                        <Rating value={4.8} precision={0.1} readOnly size="medium" sx={{ color: "#6366f1" }} />
                    </div>
                    <p className="text-xs font-semibold text-gray-500">
                        Dựa trên {reviews.length + 125} đánh giá thực tế
                    </p>
                    <span className="inline-block mt-3 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        97% Khách hàng hài lòng
                    </span>
                </div>

                {/* Breakdown Progress Bars */}
                <div className="md:col-span-8 space-y-2.5">
                    {ratingBreakdownMock.map((item) => (
                        <div key={item.stars} className="flex items-center gap-3 text-xs">
                            <div className="w-12 flex items-center gap-1 font-bold text-gray-700 shrink-0">
                                <span>{item.stars}</span>
                                <StarIcon sx={{ fontSize: 14, color: "#6366f1" }} />
                            </div>

                            <div className="flex-1 bg-gray-200/80 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>

                            <span className="w-10 text-right font-semibold text-gray-500 shrink-0">
                                {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                {[
                    { id: "all", label: `Tất cả (${reviews.length})` },
                    { id: "5", label: "5 Sao ⭐⭐⭐⭐⭐" },
                    { id: "4", label: "4 Sao ⭐⭐⭐⭐" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFilter(tab.id)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeFilter === tab.id
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews && filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-2xs hover:shadow-sm transition-all space-y-3"
                        >
                            {/* Reviewer Header */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl overflow-hidden bg-indigo-50 shrink-0 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm">
                                        {review.avatarUrl ? (
                                            <img src={review.avatarUrl} alt={review.userName} className="w-full h-full object-cover" />
                                        ) : (
                                            review.userName.charAt(0).toUpperCase()
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
                                            {review.date}
                                        </span>
                                    </div>
                                </div>

                                {/* Rating */}
                                <Rating value={review.rating} readOnly size="small" sx={{ color: "#6366f1" }} />
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
                                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${likedReviews[review.id]
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} />
                                    <span>Hữu ích ({review.likes})</span>
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
