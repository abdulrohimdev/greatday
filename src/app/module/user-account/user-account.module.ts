import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAccountRoutingModule } from './user-account-routing.module';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [RegisterComponent, SigninComponent],
  imports: [
    NgxSpinnerModule,
    CommonModule,
    ReactiveFormsModule,
    UserAccountRoutingModule,

  ],
  providers: [
  ],
})
export class UserAccountModule { }
