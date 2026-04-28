import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import "./styles.css";

import HomePage from "./pages/Home";
import ServicesPage from "./pages/Services";
import GalleryPage from "./pages/Gallery";
import ContactPage from "./pages/Contact";
import NotFoundPage from "./pages/NotFound";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster theme="dark" position="top-center" />
    </BrowserRouter>
  </React.StrictMode>,
);
