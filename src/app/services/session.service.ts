import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init(); // Inicializamos el almacenamiento
  }

  // Inicializar el almacenamiento
  async init() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  // Guardar datos en el almacenamiento
  async set(key: string, value: any): Promise<void> {
    await this.init(); // Asegurarse de que el almacenamiento está inicializado
    await this._storage?.set(key, value);
  }

  // Obtener datos del almacenamiento
  async get(key: string): Promise<any> {
    await this.init(); // Asegurarse de que el almacenamiento está inicializado
    return await this._storage?.get(key);
  }

  // Eliminar datos del almacenamiento
  async remove(key: string): Promise<void> {
    await this.init(); // Asegurarse de que el almacenamiento está inicializado
    await this._storage?.remove(key);
  }

  // Limpiar todos los datos del almacenamiento
  async clear(): Promise<void> {
    await this.init(); // Asegurarse de que el almacenamiento está inicializado
    await this._storage?.clear();
  }

  // Verificar si la sesión existe
  async isSessionActive(): Promise<boolean> {
    const user = await this.get('user');
    return !!user; // Devuelve true si hay una sesión activa
  }
}
