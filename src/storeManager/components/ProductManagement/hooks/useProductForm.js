import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createDefaultProductFormState } from "../productManagement.data";
import { product_mock_data } from "../../../../Data/product_mock_data";

export const useProductForm = (isEdit, initialData, productId, onSubmitProduct) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(createDefaultProductFormState);

  useEffect(() => {
    if (isEdit && productId) {
      const storedProducts = JSON.parse(localStorage.getItem("products")) || product_mock_data;
      const foundProduct = storedProducts.find(
        (p) => String(p.id) === String(productId)
      );

      if (foundProduct) {
        setFormData({
          ...createDefaultProductFormState(),
          ...foundProduct,
          flashSaleEndTime: foundProduct.isFlashSale ? (foundProduct.flashSaleEndTime || null) : null,
        });
        return;
      }
    }

    if (initialData) {
      setFormData({
        ...createDefaultProductFormState(),
        ...initialData,
        flashSaleEndTime: initialData.isFlashSale ? (initialData.flashSaleEndTime || null) : null,
      });
    } else {
      setFormData(createDefaultProductFormState());
    }
  }, [isEdit, initialData, productId]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      let updatedValue = type === "checkbox" ? checked : value;

      if (name === "isFlashSale" && !checked) {
        return {
          ...prev,
          isFlashSale: false,
          flashSaleEndTime: null,
        };
      }

      if (name === "isFlashSale" && checked && !prev.flashSaleEndTime) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);
        return {
          ...prev,
          isFlashSale: true,
          flashSaleEndTime: tomorrow.toISOString().substring(0, 19),
        };
      }

      return { ...prev, [name]: updatedValue };
    });
  }, []);

  const handleSizeQuantityChange = useCallback((index, newQuantity) => {
    setFormData((prev) => {
      const updatedSizes = [...(prev.size || [])];
      updatedSizes[index] = {
        ...updatedSizes[index],
        quantity: Math.max(0, Number(newQuantity) || 0),
      };

      const totalQty = updatedSizes.reduce(
        (acc, curr) => acc + (Number(curr.quantity) || 0),
        0
      );

      return {
        ...prev,
        size: updatedSizes,
        quantity: totalQty,
      };
    });
  }, []);

  const handleAddSize = useCallback((sizeName) => {
    if (!sizeName || !sizeName.trim()) return;
    const name = sizeName.trim().toUpperCase();

    setFormData((prev) => {
      const existingSizes = prev.size || [];
      if (existingSizes.some((s) => s.name === name)) return prev;

      const updatedSizes = [...existingSizes, { name, quantity: 5 }];
      const totalQty = updatedSizes.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

      return {
        ...prev,
        size: updatedSizes,
        quantity: totalQty,
      };
    });
  }, []);

  // Remove Size variant tag
  const handleRemoveSize = useCallback((sizeName) => {
    setFormData((prev) => {
      const updatedSizes = (prev.size || []).filter((s) => s.name !== sizeName);
      const totalQty = updatedSizes.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

      return {
        ...prev,
        size: updatedSizes,
        quantity: totalQty,
      };
    });
  }, []);

  // Handle Submit & Persistence to localStorage
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const activeUser = JSON.parse(localStorage.getItem("user")) || null;
    if (!activeUser.email) {
      alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại ")
      navigate("/login")
      return
    }

    if (!formData.title || !formData.price) {
      alert("Vui lòng nhập Tên sản phẩm và Giá bán!");
      return;
    }

    const priceNum = Number(formData.price) || 0;
    const discountedNum = Number(formData.discountedPrice) || priceNum;

    // Calculate discount percent
    const discountPersent =
      priceNum > 0 && priceNum > discountedNum
        ? Math.round(((priceNum - discountedNum) / priceNum) * 100)
        : 0;

    const currentStore = JSON.parse(localStorage.getItem("currentStore")) || {};
    const activeStoreId = currentStore?.id || activeUser?.storeId || formData.id_store;

    // Build finalized product payload matching product_mock_data.js
    const payload = {
      ...formData,
      id: formData.id || `prod-${Date.now()}`,
      id_store: activeStoreId,
      price: priceNum,
      discountedPrice: discountedNum,
      discountPersent,
      imageUrl:
        formData.imageUrl ||
        "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1600&auto=format&fit=crop",
      isFlashSale: Boolean(formData.isFlashSale),
      // STRICT RULE: if isFlashSale is false, set flashSaleEndTime to null!
      flashSaleEndTime: formData.isFlashSale ? (formData.flashSaleEndTime || null) : null,
    };

    if (onSubmitProduct) {
      onSubmitProduct(payload);
    } else {
      const saved = JSON.parse(localStorage.getItem("products")) || product_mock_data;
      const activeUser = JSON.parse(localStorage.getItem("user")) || {};
      const updateCurrent = JSON.parse(localStorage.getItem('currentProducts')) || [];

      let updatedList;
      if (isEdit && productId) {
        updatedList = saved.map((p) =>
          String(p.id) === String(productId) ? payload : p
        );
      } else {
        updatedList = [payload, ...saved];
      }

      let updateCurrentProduct;
      if (isEdit && productId) {
        updateCurrentProduct = updateCurrent.map((p) =>
          String(p.id) === String(productId) ? payload : p
        );
      } else {
        updateCurrentProduct = [payload, ...updateCurrent];
      }
      try {
        localStorage.setItem("products", JSON.stringify(updatedList));
        localStorage.setItem('currentProducts', JSON.stringify(updateCurrentProduct));
        alert(
          isEdit
            ? `Đã cập nhật sản phẩm "${payload.title}" thành công!`
            : `Thêm sản phẩm mới "${payload.title}" thành công!`
        );
        navigate("/store-manager/products");
      } catch (err) {
        if (err.name === "QuotaExceededError" || err.code === 22) {
          alert(
            "Lỗi lưu trữ: Dung lượng ảnh quá lớn!\n\n" +
            "Gợi ý: Dùng URL ảnh (dán link) thay vì upload file trực tiếp, " +
            "hoặc chọn ảnh có kích thước nhỏ hơn."
          );
        } else {
          alert("Lỗi không xác định khi lưu sản phẩm: " + err.message);
        }
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
