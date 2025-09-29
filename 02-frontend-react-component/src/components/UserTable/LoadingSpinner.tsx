/**
 * LoadingSpinner component
 * 
 * Provides visual feedback during data loading operations.
 * Includes accessibility features for screen readers.
 */


interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Custom message for screen readers
   */
  message?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  message = 'Loading...' 
}: LoadingSpinnerProps): JSX.Element {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]}`} role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true">
        <div className="spinner-circle"></div>
      </div>
      <span className="sr-only">{message}</span>
    </div>
  );
}
