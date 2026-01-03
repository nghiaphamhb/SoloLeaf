import React from "react";
import MainLayout from "../../../layouts/MainLayout.jsx";
import SearchPageContent from "../../../components/searchPage/SearchPageContent.jsx";
import "../../../styles/spin.css";

export default function SearchPage() {
    return (
        <MainLayout>
            <SearchPageContent />
        </MainLayout>
    );
}