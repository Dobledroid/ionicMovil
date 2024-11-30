// src/app/pages/iniciar-sesion/mock-storage.ts
export class MockStorage {
    private store: { [key: string]: any } = {};
  
    async create() {
      return this;
    }
  
    async set(key: string, value: any): Promise<void> {
      this.store[key] = value;
    }
  
    async get(key: string): Promise<any> {
      return this.store[key];
    }
  
    async remove(key: string): Promise<void> {
      delete this.store[key];
    }
  
    async clear(): Promise<void> {
      this.store = {};
    }
  }
  