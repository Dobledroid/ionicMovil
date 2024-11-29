class MockStorage {
    private store: { [key: string]: any } = {}; // Simulamos un almacenamiento en memoria
  
    // Simulamos la creación del almacenamiento
    async create() {
      return this;
    }
  
    // Simulamos la función `set` de almacenamiento
    async set(key: string, value: any): Promise<void> {
      this.store[key] = value;
    }
  
    // Simulamos la función `get` de almacenamiento
    async get(key: string): Promise<any> {
      return this.store[key];
    }
  
    // Simulamos la función `remove` de almacenamiento
    async remove(key: string): Promise<void> {
      delete this.store[key];
    }
  
    // Simulamos la función `clear` de almacenamiento
    async clear(): Promise<void> {
      this.store = {};
    }
  }
  