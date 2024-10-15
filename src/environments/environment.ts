// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://api44.vercel.app/api', 
  // apiUrl: 'http://localhost:4000/api',
  stripe:{
    publishableKey: 'pk_test_51Q4ZoeG08Y3Wb1J7PnJ7gLiD770ANG2w8daTWXHoCPJPRAc7CRrOCCxs0KkYY0cW9CIEf5CyAWBG7dUg4bzKsSCe00eZc7nhTR',
    secretKey: 'sk_test_51Q4ZoeG08Y3Wb1J7ZlSDtk2qJOKyunx8MmOHh41OdZgF4ypeHUZ0ZxcCCaDXwJg70HxTdKz1ZKSeIQiGazBpSdrR00aTX0plmG'
  },
  exchangeRateApiKey: '483474e0c630f855f216319e'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
