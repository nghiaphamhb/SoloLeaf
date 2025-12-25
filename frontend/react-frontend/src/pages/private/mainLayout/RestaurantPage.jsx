import React from "react";
import RestaurantPageContent from "../../../components/restaurantPage/RestaurantPageContent.jsx";
import MainLayout from "../../../layouts/MainLayout.jsx";

import { useParams } from "react-router-dom";

export default function RestaurantPage() {
  const { id } = useParams(); // restaurant's id is string

  return (
    <MainLayout>
      <RestaurantPageContent resId={id} />
    </MainLayout>
  );
}
