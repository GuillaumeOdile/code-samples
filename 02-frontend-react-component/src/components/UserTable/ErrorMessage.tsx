/**
 * ErrorMessage component
 * 
 * Displays error information with retry functionality.
 * Provides clear error messaging and recovery options.
 */

import { ApiClientError } from '@/lib/api';

interface ErrorMessageProps {
  /**
   * Error object to display
   */
  error: Error | ApiClientError;
  
  /**
   * Callback for retry action
   */
  onRetry?: () => void;
  
  /**
   * Custom retry button text
   */
  retryText?: string;
}

export function ErrorMessage({ 
  error, 
  onRetry, 
  retryText = 'Try again' 
}: ErrorMessageProps): JSX.Element {
  const isApiError = error instanceof ApiClientError;
  
  const getErrorMessage = (): string => {
    if (isApiError) {
      switch (error.code) {
        case 'NETWORK_ERROR':
          return 'Unable to connect to the server. Please check your internet connection.';
        case 'USER_NOT_FOUND':
          return 'The requested user could not be found.';
        case 'VALIDATION_ERROR':
          return 'There was an error with the data provided.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }
    
    return error.message || 'An unexpected error occurred.';
  };

  const getErrorTitle = (): string => {
    if (isApiError) {
      switch (error.statusCode) {
        case 404:
          return 'Not Found';
        case 400:
          return 'Invalid Request';
        case 500:
          return 'Server Error';
        default:
          return 'Error';
      }
    }
    
    return 'Error';
  };

  return (
    <div className="error-message" role="alert" aria-live="assertive">
      <div className="error-content">
        <h3 className="error-title">{getErrorTitle()}</h3>
        <p className="error-description">{getErrorMessage()}</p>
        
        {onRetry && (
          <button 
            className="retry-button"
            onClick={onRetry}
            type="button"
          >
            {retryText}
          </button>
        )}
        
        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Technical Details</summary>
            <pre className="error-stack">
              {error.stack || JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
