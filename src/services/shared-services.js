import { Observable, from } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError,map } from 'rxjs/operators';

// Function to make a POST request
export const uploadPdf = (file) => {
    let url = 'https://1d30-103-2-234-189.ngrok-free.app/pdf'

    const fileReader = new FileReader();
    
  
    return new Promise((resolve, reject) => {
        fileReader.onload = () => {
          const blob = new Blob([fileReader.result], { type: 'application/pdf' });
    
          const formData = new FormData();
          formData.append('pdfFile', blob);
    
          const observable = from(ajax.post(url, formData)).pipe(
            map(response => response.response),
            catchError(error => {
              console.error('Error uploading PDF:', error);
              reject(error);
              throw error; // Re-throw the error to propagate it further
            })
          );
    
          observable.subscribe(resolve, reject);
        };
    
        fileReader.onerror = (error) => {
          console.error('Error reading PDF file:', error);
          reject(error);
        };
    
        fileReader.readAsArrayBuffer(file);
      });
    
};

// Function to make a GET request with query parameters
export const getAnswer = (params) => {

    const queryParams = new URLSearchParams(params).toString(); // Convert params object to URL query string
    // const apiUrl = `${url}${queryParams}`;
    const apiUrl = `https://1d30-103-2-234-189.ngrok-free.app/query?${queryParams}`;
  
    return from(ajax.get(apiUrl,params)).pipe(
      map(response => response.response)
    );
  };
