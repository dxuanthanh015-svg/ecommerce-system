import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createDefaultProductFormState } from "../productManagement.data";
import { useCurrentUser } from "../../../../hooks/useAuthQuery";
import { useDetailProducts, useSaveProduct } from "../../../../hooks/useProductQuery";

export const useProductForm = (isEdit, initialData, productId, onSubmitProduct) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(createDefaultProductFormState);

  const { data: activeUser } = useCurrentUser();
  const { data: productDetail } = useDetailProducts(isEdit ? productId : null);
  const { mutateAsync: saveProductMutate, isPending: isSubmitting } = useSaveProduct();

  // Khi edit: load sản phẩm từ React Query cache
  useEffect(() => {
    if (isEdit && productDetail) {
      setFormData({
        ...createDefaultProductFormState(),
        ...productDetail,
        price: productDetail.price ?? "",
        discountedPrice: productDetail.discountedPrice ?? "",
        size: Array.isArray(productDetail.size) ? productDetail.size : [],
      });
    } else if (initialData) {
      setFormData({
        ...createDefaultProductFormState(),
        ...initialData,
        price: initialData.price ?? "",
        discountedPrice: initialData.discountedPrice ?? "",
        size: Array.isArray(initialData.size) ? initialData.size : [],
      });
    }
  }, [isEdit, productDetail, initialData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSizeQuantityChange = useCallback((sizeName, field, value) => {
    setFormData((prev) => {
      const updatedSizes = (prev.size || []).map((s) =>
        s.name === sizeName ? { ...s, [field]: value } : s
      );
      const totalQty = updatedSizes.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
      return { ...prev, size: updatedSizes, quantity: totalQty };
    });
  }, []);

  const handleAddSize = useCallback((newSizeEntry) => {
    setFormData((prev) => {
      const updatedSizes = [...(prev.size || []), newSizeEntry];
      const totalQty = updatedSizes.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
      return { ...prev, size: updatedSizes, quantity: totalQty };
    });
  }, []);

  const handleRemoveSize = useCallback((sizeName) => {
    setFormData((prev) => {
      const updatedSizes = (prev.size || []).filter((s) => s.name !== sizeName);
      const totalQty = updatedSizes.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
      return { ...prev, size: updatedSizes, quantity: totalQty };
    });
  }, []);

  // Handle Submit => ghi vào /products và /currentProducts trên Mock Server qua React Query
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!activeUser?.email) {
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      navigate("/login");
      return;
    }

    if (!formData.title?.trim() || !formData.brand?.trim()) {
      toast.error("Vui lòng nhập Tên sản phẩm và Thương hiệu!");
      return;
    }

    const priceNum = Number(formData.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      toast.error("Giá sản phẩm phải lớn hơn 0.");
      return;
    }
    const discountedNum = formData.discountedPrice === "" || formData.discountedPrice == null
      ? priceNum
      : Number(formData.discountedPrice);
    if (!Number.isFinite(discountedNum) || discountedNum < 0 || discountedNum > priceNum) {
      toast.error("Giá khuyến mãi phải từ 0 đến giá gốc.");
      return;
    }

    const primaryImage = formData.images?.[0] || formData.imageUrl || "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1600&auto=format&fit=crop";

    const payload = {
      ...formData,
      title: formData.title.trim(),
      brand: formData.brand.trim(),
      price: priceNum,
      discountedPrice: discountedNum,
      quantity: (formData.size || []).reduce((total, size) => total + (Number(size.quantity) || 0), 0),
      size: (formData.size || [])
        .filter((size) => size && typeof size === "object" && size.name?.trim())
        .map((size) => ({ name: size.name.trim(), quantity: Number(size.quantity) || 0 })),
      imageUrl: primaryImage,
      isFlashSale: Boolean(formData.isFlashSale),
      flashSaleEndTime: formData.isFlashSale ? (formData.flashSaleEndTime || null) : null,
    };

    if (onSubmitProduct) {
      onSubmitProduct(payload);
    } else {
      try {
        await saveProductMutate({ productData: payload, isEdit: isEdit && !!productId });
        toast.success(
          isEdit
            ? `Cập nhật sản phẩm "${payload.title}" thành công!`
            : `Thêm sản phẩm "${payload.title}" thành công!`
        );
        navigate("/store-manager/products");
      } catch (err) {
        console.error('[useProductForm] Lỗi lưu sản phẩm:', err);
        const message = err.response?.data?.message || err.response?.data?.result?.message || err.message;
        toast.error("Lỗi khi lưu sản phẩm: " + message);
      }
    }
  }, [formData, isEdit, productId, navigate, onSubmitProduct, activeUser, saveProductMutate]);

  return {
    formData,
    handleChange,
    handleSizeQuantityChange,
    handleAddSize,
    handleRemoveSize,
    handleSubmit,
    isSubmitting,
  };
};

