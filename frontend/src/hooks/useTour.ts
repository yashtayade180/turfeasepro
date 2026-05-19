import { useState, useEffect } from 'react';
import { STATUS, EVENTS } from 'react-joyride';
import type { Step } from 'react-joyride';

const tourKey = (userId?: string) =>
  userId ? `turfeasepro_tour_done_${userId}` : 'turfeasepro_tour_done';

export const TOUR_STEPS: Step[] = [
  {
    target: 'body',
    placement: 'center',
    title: '👋 Welcome to TurfEasePro!',
    content: "Let's take a quick tour so you know exactly where everything is. It'll take less than a minute.",
  },
  {
    target: '[data-tour="upcoming-games"]',
    placement: 'bottom',
    title: '📅 Your Upcoming Games',
    content: 'All your confirmed bookings appear here. Tap "Manage Game" to split the cost with teammates.',
  },
  {
    target: '[data-tour="quick-actions"]',
    placement: 'top',
    title: '⚡ Quick Actions',
    content: 'Book a new turf, jump to your split payments, or check your match history — all in one tap.',
  },
  {
    target: '[data-tour="nav-browse"]',
    placement: 'top',
    title: '🏟️ Find a Turf',
    content: 'Browse and filter turfs near you. Each listing shows live weather badges on time slots so you never get caught in the rain.',
  },
  {
    target: '[data-tour="nav-matches"]',
    placement: 'top',
    title: '📊 Match History',
    content: 'Log scores after every game, track your win rate, and climb the leaderboard.',
  },
  {
    target: '[data-tour="nav-profile"]',
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

  const handleCallback = (data: any) => {
    const { status, action, index, type } = data;
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === 'prev' ? -1 : 1));
    }
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem(tourKey(userId), 'true');
    }
  };

  return { run, stepIndex, startTour, handleCallback };
}
