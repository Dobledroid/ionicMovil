import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl = `https://v6.exchangerate-api.com/v6/${environment.exchangeRateApiKey}/latest`;

  constructor(private http: HttpClient) {}

  // Obtener el tipo de cambio para una moneda específica
  getExchangeRates(baseCurrency: string) {
    return this.http.get(`${this.apiUrl}/${baseCurrency}`);
  }

  // Convertir un monto entre dos monedas
  convertCurrency(
    baseCurrency: string,
    targetCurrency: string,
    amount: number
  ) {
    return this.getExchangeRates(baseCurrency).toPromise().then((data: any) => {
      const rate = data.conversion_rates[targetCurrency];
      return amount * rate;
    });
  }
}
