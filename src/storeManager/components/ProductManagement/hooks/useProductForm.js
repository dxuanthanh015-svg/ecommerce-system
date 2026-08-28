import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createDefaultProductFormState } from "../productManagement.data";
import { productService, authService, storeService } from "../../../../services";

export const useProductForm = (isEdit, initialData, productId, onSubmitProduct) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(createDefaultProductFormState);

  // Khi edit: load sản phẩm từ /products trên Mock Server
  useEffect(() => {
    if (isEdit && productId) {
      const loadProduct = async () => {
        try {
          const foundProduct = await productService.fetchProductById(productId)
          if (foundProduct) {
            setFormData({
              ...createDefaultProductFormState(),
              ...foundProduct,
              price: foundProduct.price ?? "",
              discountedPrice: foundProduct.discountedPrice ?? "",
              size: Array.isArray(foundProduct.size) ? foundProduct.size : [],
            });
          }
        } catch (err) {
          console.error('[useProductForm] Lỗi load sản phẩm:', err)
        }
      };
      loadProduct();
    } else if (initialData) {
      setFormData({
        ...createDefaultProductFormState(),
        ...initialData,
        price: initialData.price ?? "",
        discountedPrice: initialData.discountedPrice ?? "",
        size: Array.isArray(initialData.size) ? initialData.size : [],
      });
    }
  }, [isEdit, productId, initialData]);

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

  // Handle Submit => ghi vào /products và /currentProducts trên Mock Server
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Lấy user và store từ Mock Server
    const activeUser = await authService.getCurrentUser()
    if (!activeUser?.email) {
      alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      navigate("/login");
      return;
    }

    if (!formData.title || !formData.price) {
      alert("Vui lòng nhập Tên sản phẩm và Giá bán!");
      return;
    }

    const priceNum = Number(formData.price) || 0;
    const discountedNum = Number(formData.discountedPrice) || priceNum;
    const discountPersent =
      priceNum > 0 && priceNum > discountedNum
        ? Math.round(((priceNum - discountedNum) / priceNum) * 100)
        : 0;

    // Lấy storeId từ /currentStore
    const currentStore = await storeService.getCurrentStore()
    const activeStoreId = currentStore?.id || activeUser?.storeId || formData.id_store;
    const primaryImage = formData.images?.[0] || formData.imageUrl || "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1600&auto=format&fit=crop";

    const payload = {
      ...formData,
      id: formData.id || `prod-${Date.now()}`,
      id_store: activeStoreId,
      storeId: activeStoreId,
      price: priceNum,
      discountedPrice: discountedNum,
      discountPersent,
      imageUrl: primaryImage,
      isFlashSale: Boolean(formData.isFlashSale),
      flashSaleEndTime: formData.isFlashSale ? (formData.flashSaleEndTime || null) : null,
      createdAt: formData.createdAt || new Date().toISOString(),
    };

    if (onSubmitProduct) {
      onSubmitProduct(payload);
    } else {
      try {
        // Ghi đồng thời lên /products và /currentProducts
        await productService.saveProduct(payload, isEdit && !!productId);
        alert(
          isEdit
            ? `Đã cập nhật sản phẩm "${payload.title}" thành công!`
            : `Thêm sản phẩm mới "${payload.title}" thành công!`
        );
        navigate("/store-manager/products");
      } catch (err) {
        console.error('[useProductForm] Lỗi lưu sản phẩm:', err);
        alert("Lỗi khi lưu sản phẩm: " + err.message);
      }
    }
  }, [formData, isEdit, productId, navigate, onSubmitProduct]);

  return {
    formData,
    handleChange,
    handleSizeQuantityChange,
    handleAddSize,
    handleRemoveSize,
    handleSubmit,
  };
};
