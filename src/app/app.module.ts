import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { DialogComponent, UploadComponent } from './upload/upload.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { YearPipe } from './pipes/year.pipes';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { HomepageComponent } from './homepage/homepage.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    UploadComponent,
    YearPipe,
    DialogComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCZAGvRHxFg-QlSdOweW5x7FoHPBVYtjGM",
      authDomain: "balbertube-webkert.firebaseapp.com",
      databaseURL: "https://balbertube-webkert-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "balbertube-webkert",
      storageBucket: "balbertube-webkert.appspot.com",
      messagingSenderId: "887657935038",
      appId: "1:887657935038:web:4d235073e82cce74af6eef",
      measurementId: "G-PQ3K27BC3M"
    }),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDialogModule
    
  ],
  providers: [
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp({
      "projectId":"balbertube-webkert",
      "appId":"1:887657935038:web:4d235073e82cce74af6eef",
      "storageBucket":"balbertube-webkert.appspot.com",
      "apiKey":"AIzaSyCZAGvRHxFg-QlSdOweW5x7FoHPBVYtjGM",
      "authDomain":"balbertube-webkert.firebaseapp.com",
      databaseURL: "https://balbertube-webkert-default-rtdb.europe-west1.firebasedatabase.app",
      "messagingSenderId":"887657935038",
      "measurementId":"G-PQ3K27BC3M"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
