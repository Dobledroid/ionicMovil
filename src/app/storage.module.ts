import { NgModule } from '@angular/core';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';

@NgModule({
  imports: [IonicStorageModule.forRoot()],
  providers: [
    {
      provide: Storage,
      useFactory: async () => {
        const storage = new Storage();
        return await storage.create();
      },
    },
  ],
})
export class StorageModule {}
