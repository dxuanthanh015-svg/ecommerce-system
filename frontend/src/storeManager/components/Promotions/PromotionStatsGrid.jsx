import React from "react";
import PromotionStatCard from "./PromotionStatCard";

const PromotionStatsGrid = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <PromotionStatCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};

export default PromotionStatsGrid;
