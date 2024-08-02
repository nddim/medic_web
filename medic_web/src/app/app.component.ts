import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {SpinnerService} from "./helper/spinner/spinner.service";
import {AsyncPipe, CommonModule} from "@angular/common";
import {NgxSpinnerModule} from "ngx-spinner";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, CommonModule,
    NgxSpinnerModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(public spinnerService:SpinnerService,) {
  }
  ngOnInit() {
    this.spinnerService.show();

    setTimeout(() => {
      this.spinnerService.hide();
    }, );
  }
  title = 'medic_web';
}
