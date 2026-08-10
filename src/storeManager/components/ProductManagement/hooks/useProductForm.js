import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  createDefaultProductFormState,
  MOCK_EDIT_PRODUCT_DATA,
} from "../productManagement.data";

export const useProductForm = (isEdit, initialData, productId, onSubmitProduct) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(createDefaultProductFormState);
  const [newSizeTag, setNewSizeTag] = useState("");

  useEffect(() => {
    const baseState = createDefaultProductFormState();

    if (!isEdit) {
      setFormData(initialData ? { ...baseState, ...initialData } : baseState);
      return;
    }

    setFormData({
      ...baseState,
      ...(initialData || MOCK_EDIT_PRODUCT_DATA),
    });
  }, [isEdit, initialData, productId]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleVisibilityChange = useCallback((val) => {
    setFormData((prev) => ({ ...prev, visibility: val }));
  }, []);

  const handleMatrixChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedMatrix = [...prev.generatedMatrix];
      updatedMatrix[index] = { ...updatedMatrix[index], [field]: value };
      return { ...prev, generatedMatrix: updatedMatrix };
    });
  }, []);

  const handleAddSizeTag = useCallback((e) => {
    if (e.key === "Enter" && newSizeTag.trim()) {
      e.preventDefault();
      const normalizedTag = newSizeTag.trim().toUpperCase();

      setFormData((prev) => {
        const updatedVariants = [...prev.variants];
        const sizeOption = updatedVariants.find((v) => v.optionName === "Size");
        if (sizeOption) {
          if (!sizeOption.values.includes(normalizedTag)) {
            sizeOption.values = [...sizeOption.values, normalizedTag];
          }
        }
        return { ...prev, variants: updatedVariants };
      });
      setNewSizeTag("");
    }
  }, [newSizeTag]);

  const handleRemoveSizeTag = useCallback((valToRemove) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      const sizeOption = updatedVariants.find((v) => v.optionName === "Size");
      if (sizeOption) {
        sizeOption.values = sizeOption.values.filter((v) => v !== valToRemove);
      }
      return { ...prev, variants: updatedVariants };
    });
  }, []);

  const handleSubmit = useCallback((e, status = "Active") => {
    e.preventDefault();
    const finalPayload = { ...formData, visibility: status };
    if (onSubmitProduct) {
      onSubmitProduct(finalPayload);
    } else {
      console.log("Submitting Product:", finalPayload);
      navigate("/store-manager/products");
    }
  }, [formData, navigate, onSubmitProduct]);

  return {
    formData,
    newSizeTag,
    setNewSizeTag,
    handleChange,
    handleVisibilityChange,
    handleMatrixChange,
    handleAddSizeTag,
    handleRemoveSizeTag,
    handleSubmit
  };
};
