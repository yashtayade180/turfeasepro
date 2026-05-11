import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

// Booking is handled inline on TurfDetailPage — this redirects for legacy routes
const BookingPage: React.FC = () => {
  const { turfId } = useParams<{ turfId: string }>();
  return <Navigate to={`/turfs/${turfId}`} replace />;
};

export default BookingPage;
