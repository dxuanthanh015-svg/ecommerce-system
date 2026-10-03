import React from "react";
import SummaryCard from "./SummaryCard";

const SummaryCardsRow = ({ cards = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <SummaryCard key={card.id} {...card} />
      ))}
    </div>
  );
};

export default SummaryCardsRow;
