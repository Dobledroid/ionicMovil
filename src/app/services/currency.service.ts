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
  async getExchangeRates(baseCurrency: string): Promise<any> {
    try {
      const response: any = await this.http.get(`${this.apiUrl}/${baseCurrency}`).toPromise();
      return response.conversion_rates;
    } catch (error) {
      console.error('Error al obtener los tipos de cambio:', error);
      throw new Error('No se pudo obtener los tipos de cambio.');
    }
  }

  // Convertir un monto entre dos monedas
  async convertCurrency(baseCurrency: string, targetCurrency: string, amount: number): Promise<number> {
    try {
      const rates = await this.getExchangeRates(baseCurrency);
      const rate = rates[targetCurrency];
      if (!rate) throw new Error(`Tipo de cambio no encontrado para ${targetCurrency}`);
      return amount * rate;
    } catch (error) {
      console.error('Error al convertir la moneda:', error);
      return amount; // Retornar el monto original si hay un error.
    }
  }
}
