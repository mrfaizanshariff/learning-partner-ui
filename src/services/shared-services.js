import { Observable, from } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

// Function to make a POST request
export const uploadPdf = (url, body) => {
  return from(ajax.post(url, body)).pipe(
    map(response => response.response)
  );
};

// Function to make a GET request with query parameters
export const getAnswer = (url, params) => {
    const queryParams = new URLSearchParams(params).toString(); // Convert params object to URL query string
    const apiUrl = `${url}?${queryParams}`;
  
    return from(ajax.get(apiUrl)).pipe(
      map(response => response.response)
    );
  };
