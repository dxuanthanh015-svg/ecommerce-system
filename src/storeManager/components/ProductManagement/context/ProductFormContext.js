import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { generateVariantMatrix } from "../utils/matrixHelper";

const ProductFormContext = createContext();

export const useProductFormContext = () => {
  const context = useContext(ProductFormContext);
  if (!context) {
    throw new Error("useProductFormContext must be used within a ProductFormProvider");
  }
  return context;
};

const defaultProductState = {
  title: "",
  brand: "",
  description: "",
  price: "",
  promoPrice: "",
  level1Category: "",
  level2Category: "",
  level3Category: "",
  tags: "",
  visibility: "Active",
  mediaImages: [],
  variants: [
    { id: Date.now(), optionName: "Size", values: ["S", "M", "L"] },
  ],
  generatedMatrix: []
};

export const ProductFormProvider = ({ children, initialData, isEdit }) => {
  const [formData, setFormData] = useState(defaultProductState);
  const [newOptionName, setNewOptionName] = useState("");

  // Initialize data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Sync Matrix when variants change
  useEffect(() => {
    setFormData(prev => {
      const newMatrix = generateVariantMatrix(prev.variants, prev.generatedMatrix);
      return { ...prev, generatedMatrix: newMatrix };
    });
  }, [formData.variants]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const setVisibility = useCallback((val) => {
    setFormData(prev => ({ ...prev, visibility: val }));
  }, []);

  // Media Logic
  const addMediaImages = useCallback((newImages) => {
    setFormData(prev => ({
      ...prev,
      mediaImages: [...prev.mediaImages, ...newImages]
    }));
  }, []);

  const removeMediaImage = useCallback((id) => {
    setFormData(prev => ({
      ...prev,
      mediaImages: prev.mediaImages.filter(img => img.id !== id)
    }));
  }, []);

  const setMainImage = useCallback((id) => {
    setFormData(prev => ({
      ...prev,
      mediaImages: prev.mediaImages.map(img => ({
        ...img,
        isMain: img.id === id
      }))
    }));
  }, []);

  // Variant Logic
  const addOption = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { id: Date.now(), optionName: "", values: [] }]
    }));
  }, []);

  const removeOption = useCallback((optionId) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== optionId)
    }));
  }, []);

  const updateOptionName = useCallback((optionId, name) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(v => v.id === optionId ? { ...v, optionName: name } : v)
    }));
  }, []);

  const addValueToOption = useCallback((optionId, value) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(v => {
        if (v.id === optionId) {
          if (v.values.includes(value.trim())) return v;
          return { ...v, values: [...v.values, value.trim()] };
        }
        return v;
      })
    }));
  }, []);

  const removeValueFromOption = useCallback((optionId, valueToRemove) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(v => 
        v.id === optionId ? { ...v, values: v.values.filter(val => val !== valueToRemove) } : v
      )
    }));
  }, []);

  const handleMatrixChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const updatedMatrix = [...prev.generatedMatrix];
      updatedMatrix[index] = { ...updatedMatrix[index], [field]: value };
      return { ...prev, generatedMatrix: updatedMatrix };
    });
  }, []);

  const value = useMemo(() => ({
    formData,
    isEdit,
    handleChange,
    setVisibility,
    addMediaImages,
    removeMediaImage,
    setMainImage,
    addOption,
    removeOption,
    updateOptionName,
    addValueToOption,
    removeValueFromOption,
    handleMatrixChange,
    setFormData
  }), [
    formData, isEdit, handleChange, setVisibility, addMediaImages, removeMediaImage, 
    setMainImage, addOption, removeOption, updateOptionName, addValueToOption, 
    removeValueFromOption, handleMatrixChange
  ]);

  return (
    <ProductFormContext.Provider value={value}>
      {children}
    </ProductFormContext.Provider>
  );
};
