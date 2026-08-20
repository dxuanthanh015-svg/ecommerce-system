import React from "react";
import { useParams } from "react-router-dom";
import FormHeader from "./AddProductFormSections/FormHeader";
import BasicInformation from "./AddProductFormSections/BasicInformation";
import MediaSection from "./AddProductFormSections/MediaSection";
import VariantsSection from "./AddProductFormSections/VariantsSection";
import PricingSection from "./AddProductFormSections/PricingSection";
import CategorizationSection from "./AddProductFormSections/CategorizationSection";
import { useProductForm } from "./hooks/useProductForm";

const AddProductForm = ({ isEdit = false, initialData, onSubmitProduct }) => {
  const { productId } = useParams();
  const {
    formData,
    handleChange,
    handleSizeQuantityChange,
    handleAddSize,
    handleRemoveSize,
    handleSubmit,
  } = useProductForm(isEdit, initialData, productId, onSubmitProduct);

  return (
    <form className="space-y-6 font-sans pb-16" onSubmit={handleSubmit}>
      <FormHeader
        isEdit={isEdit}
        productId={productId}
        handleSubmit={handleSubmit}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <BasicInformation formData={formData} handleChange={handleChange} />
          <MediaSection formData={formData} handleChange={handleChange} />
          <VariantsSection
            formData={formData}
            handleSizeQuantityChange={handleSizeQuantityChange}
            handleAddSize={handleAddSize}
            handleRemoveSize={handleRemoveSize}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <PricingSection formData={formData} handleChange={handleChange} />
          <CategorizationSection formData={formData} handleChange={handleChange} />
        </div>
      </div>
    </form>
  );
};

export default AddProductForm;
