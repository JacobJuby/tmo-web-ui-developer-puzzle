import { Component } from '@angular/core';
import { OKREADS_CONSTANTS } from '@tmo/shared/models';

@Component({
  selector: 'tmo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appConstant = OKREADS_CONSTANTS.APP_CONSTANT;
}
