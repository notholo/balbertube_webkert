import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error: string | null = null;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      agreeToTerms: new FormControl(false, [Validators.requiredTrue]),
      notifications: new FormControl(false)
    });
  }

  ngOnInit(): void {}

  register(): void {
    if (this.registerForm.valid) {
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      this.afAuth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User registered successfully!');
          this.error = null;
          this.router.navigate(['/profile']);
        })
        .catch((error) => {
          this.error = error.message;
        });
    }
  }
}