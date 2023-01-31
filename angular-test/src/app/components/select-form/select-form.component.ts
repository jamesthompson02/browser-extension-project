import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.css']
})
export class SelectFormComponent {
  @Input() title : string = "";

}
