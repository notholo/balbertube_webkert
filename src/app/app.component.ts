import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'balbertubebeadando';
  

  constructor(public router: Router, public afAuth: AngularFireAuth) {}

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  isSpecialRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/login') || 
           currentUrl.includes('/register') || 
           currentUrl.includes('/profile') || 
           currentUrl.includes('/upload');
  }
  


}

