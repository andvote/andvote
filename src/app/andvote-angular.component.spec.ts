import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { AndvoteAngularAppComponent } from './../app/andvote-angular.component';

beforeEachProviders(() => [AndvoteAngularAppComponent]);

describe('App: AndvoteAngular', () => {
  it('should create the app',
      inject([AndvoteAngularAppComponent], (app: AndvoteAngularAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'andvote-angular works!\'',
      inject([AndvoteAngularAppComponent], (app: AndvoteAngularAppComponent) => {
    expect(app.title).toEqual('andvote-angular works!');
  }));
});
