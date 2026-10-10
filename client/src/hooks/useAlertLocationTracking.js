import {
  useEffect,
  useRef
} from 'react';

import {
  updateAlertLocation
} from '../services/alertService';

const useAlertLocationTracking = (
  alertId,
  isActive
) => {
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!alertId || !isActive) {
      return undefined;
    }

    if (!navigator.geolocation) {
      return undefined;
    }

    const handlePosition = async (position) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      try {
        await updateAlertLocation(
          alertId,
          location
        );
      } catch (error) {
        console.error(
          'Location update failed:',
          error.message
        );
      }
    };

    const handleError = (error) => {
      console.error(
        'Location tracking error:',
        error.message
      );
    };

    watchIdRef.current =
      navigator.geolocation.watchPosition(
        handlePosition,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );

        watchIdRef.current = null;
      }
    };
  }, [alertId, isActive]);
};

export default useAlertLocationTracking;