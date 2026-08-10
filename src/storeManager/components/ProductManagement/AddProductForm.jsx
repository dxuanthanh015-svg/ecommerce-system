import React from "react";
import { useParams } from "react-router-dom";
import FormHeader from "./AddProductFormSections/FormHeader";
import BasicInformation from "./AddProductFormSections/BasicInformation";
import MediaSection from "./AddProductFormSections/MediaSection";
import VariantsSection from "./AddProductFormSections/VariantsSection";
import PricingSection from "./AddProductFormSections/PricingSection";
import CategorizationSection from "./AddProductFormSections/CategorizationSection";
import VisibilitySection from "./AddProductFormSections/VisibilitySection";
import { useProductForm } from "./hooks/useProductForm";

const AddProductForm = ({ isEdit = false, initialData, onSubmitProduct }) => {
  const { productId } = useParams();
  const {
    formData,
    newSizeTag,
    setNewSizeTag,
    handleChange,
    handleVisibilityChange,
    handleMatrixChange,
    handleAddSizeTag,
    handleRemoveSizeTag,
    handleSubmit,
  } = useProductForm(isEdit, initialData, productId, onSubmitProduct);

  return (
    <form
      className="space-y-6 font-sans pb-16"
      onSubmit={(event) => handleSubmit(event, formData.visibility)}
    >
      <FormHeader
        isEdit={isEdit}
        productId={productId}
        handleSubmit={handleSubmit}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <BasicInformation formData={formData} handleChange={handleChange} />

          <MediaSection mediaImages={formData.mediaImages} />

          <VariantsSection
            variants={formData.variants}
            generatedMatrix={formData.generatedMatrix}
            newSizeTag={newSizeTag}
            setNewSizeTag={setNewSizeTag}
            handleAddSizeTag={handleAddSizeTag}
            handleRemoveSizeTag={handleRemoveSizeTag}
            handleMatrixChange={handleMatrixChange}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <PricingSection
            price={formData.price}
            promoPrice={formData.promoPrice}
            handleChange={handleChange}
          />

          <CategorizationSection
            level1Category={formData.level1Category}
            level2Category={formData.level2Category}
            level3Category={formData.level3Category}
            tags={formData.tags}
            handleChange={handleChange}
          />

          <VisibilitySection
            visibility={formData.visibility}
            setVisibility={handleVisibilityChange}
          />
        </div>
      </div>
    </form>
  );
};

export default AddProductForm;
