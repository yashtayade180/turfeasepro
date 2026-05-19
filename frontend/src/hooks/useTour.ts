import { useState, useEffect } from 'react';
import type { TourStep } from '../components/TourOverlay';

const tourKey = (userId?: string) =>
  userId ? `turfeasepro_tour_done_${userId}` : 'turfeasepro_tour_done';

export const TOUR_STEPS: TourStep[] = [
  {
    title: '👋 Welcome to TurfEasePro!',
    content: "Let's take a quick tour so you know exactly where everything is. It'll take less than a minute.",
  },
  {
    mobileTarget: '[data-tour="upcoming-games"]',
    desktopTarget: '[data-tour="desktop-upcoming"]',
    placement: 'bottom',
    title: '📅 Your Upcoming Games',
    content: 'All your confirmed bookings appear here. Tap "Manage Game" to split the cost with teammates.',
  },
  {
    mobileTarget: '[data-tour="quick-actions"]',
    desktopTarget: '[data-tour="desktop-stats"]',
    placement: 'bottom',
    title: '⚡ Quick Actions',
    content: 'Book a new turf, jump to your split payments, or check your match history — all in one tap.',
  },
  {
    mobileTarget: '[data-tour="nav-browse"]',
    desktopTarget: '[data-tour="desktop-nav-browse"]',
    placement: 'top',
    title: '🏟️ Find a Turf',
    content: 'Browse and filter turfs near you. Each listing shows live weather badges on time slots.',
  },
  {
    mobileTarget: '[data-tour="nav-matches"]',
    desktopTarget: '[data-tour="desktop-nav-matches"]',
    placement: 'top',
    title: '📊 Match History',
    content: 'Log scores after every game, track your win rate, and climb the leaderboard.',
  },
  {
    mobileTarget: '[data-tour="nav-profile"]',
    desktopTarget: '[data-tour="desktop-profile"]',
    placement: 'top',
    title: '👤 Your Profile',
    content: "Update your details and preferences here. You're all set — go book your first game! 🎉",
  },
];

export function useTour(userId?: string) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const done = localStorage.getItem(tourKey(userId));
    if (!done) {
      const t = setTimeout(() => setRun(true), 800);
      return () => clearTimeout(t);
    }
  }, [userId]);

  const startTour = () => {
    setStepIndex(0);
    setRun(true);
  };

  const next = () => setStepIndex(i => Math.min(i + 1, TOUR_STEPS.length - 1));
  const back = () => setStepIndex(i => Math.max(0, i - 1));

  const finish = () => {
    setRun(false);
    localStorage.setItem(tourKey(userId), 'true');
  };

  const skip = finish;

  return { run, stepIndex, startTour, next, back, finish, skip };
}
