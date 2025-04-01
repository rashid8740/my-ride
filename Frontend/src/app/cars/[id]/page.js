"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { useFavorites } from "@/utils/FavoritesContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  ChevronRight, 
  Heart,
  Share2,
  MessageCircle,
  Phone,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Check,
  MapPin,
  Car,
  AlertCircle
} from "lucide-react";
import apiService from "@/utils/api";

const CarDetailPage = ({ params }) => {
  const { id } = params;
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch car data
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.cars.getById(id);
        
        if (response.status === 'success' && response.data) {
          setCar(response.data);
        } else {
          throw new Error(response.message || 'Failed to load car details');
        }
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError(err.message || 'Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    if (isTogglingFavorite || !car) return;
    
    try {
      setIsTogglingFavorite(true);
      await toggleFavorite(car._id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Handle contact form input changes
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (formSubmitting) return;
    
    try {
      setFormSubmitting(true);
      setFormError(null);
      
      const response = await apiService.contact.submitInquiry({
        ...contactForm,
        subject: `Inquiry about ${car.title} (ID: ${car._id})`,
        car: car._id
      });
      
      if (response.status === 'success') {
        setFormSuccess(true);
        setContactForm({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      } else {
        throw new Error(response.message || 'Failed to submit inquiry');
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setFormError(err.message || 'Failed to submit inquiry. Please try again.');
 