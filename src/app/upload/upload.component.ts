import { Component, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { finalize, filter, map } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements AfterViewInit {
  @ViewChild('fileInputElement') fileInputElement!: ElementRef<HTMLInputElement>;

  uploadProgress: Observable<number> | null = null;
  uploadedVideoUrl: string | undefined;

  constructor(
    private storage: AngularFireStorage, 
    private db: AngularFireDatabase, 
    private dialog: MatDialog,
    private auth: AngularFireAuth // Firebase Authentication service hozzáadása
  ) { }

  ngAfterViewInit() {
    if (!this.fileInputElement) {
      console.error('File input element is not available.');
      return;
    }
  }

  handleFileInput(event: any) {
    // Kezelje a fájl input eseményt itt
    console.log('File input event:', event);
  }

  uploadFile() {
    if (!this.fileInputElement || !this.fileInputElement.nativeElement.files || this.fileInputElement.nativeElement.files.length === 0) {
      console.error('No file selected.');
      return;
    }
  
    const file = this.fileInputElement.nativeElement.files[0];
    this.auth.currentUser.then(user => {
      if (!user) {
        console.error('User is not signed in.');
        return;
      }
      const userEmail = user.email; // Felhasználó email címe
      if (!userEmail) {
        console.error('User email is not available.');
        return;
      }
  
      const sanitizedEmail = userEmail.replace(/[.#$/[\]]/g, ''); // Speciális karakterek eltávolítása az email címből
      const filePath = `videos/${sanitizedEmail}/${file.name}`; // Videó útvonala a felhasználó mappájában
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
  
      this.uploadProgress = task.percentageChanges().pipe(
        filter(progress => progress !== undefined), // Szűrjük ki az undefined értékeket
        map(progress => progress as number) // Az értékeket típusként number típussá konvertáljuk
      );
  
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.uploadedVideoUrl = url;
            this.saveVideoToDatabase(url, file.name); // Pass the file name to the function
            this.openDialog('Upload successful!');
          });
        })
      ).subscribe();
    }).catch(error => {
      console.error('Error getting current user:', error);
    });
  }

  async saveVideoToDatabase(url: string, fileName: string) { // Elfogadjuk a fájl nevét paraméterként
    try {
      const user = await this.auth.currentUser; // Firebase Auth jelenlegi felhasználója
  
      if (!user) {
        console.error('A felhasználó nincs bejelentkezve.');
        return;
      }
  
      const userEmail = user.email; // Felhasználó email címe
  
      if (!userEmail) {
        console.error('Nincs elérhető felhasználói email.');
        return;
      }
  
      const sanitizedEmail = userEmail.replace(/[.#$/[\]]/g, ''); // Speciális karakterek eltávolítása az email címből
      const userVideosRef = this.db.list(`users/${sanitizedEmail}/videos`);
  
      // Hozzáadjuk a videót az adatbázishoz
      const newVideoRef = userVideosRef.push({}); // Egyedi azonosító létrehozása
      const videoId = newVideoRef.key; // Az új videó azonosítójának megszerzése
      const videoFolderRef = this.db.object(`users/${sanitizedEmail}/videos/${videoId}`); // Megfelelő referencia megszerzése
      videoFolderRef.set({ url: url, fileName: fileName }); // A fájl nevének és a letöltési URL-nek a mentése az adatbázisba
  
      // Nem töröljük a videókat
    } catch (error) {
      console.error('Hiba történt a videó mentésekor az adatbázisba:', error);
    }
  }

  
  openDialog(message: string) {
    this.dialog.open(DialogComponent, {
      data: { message: message }
    });
  }
}

@Component({
  selector: 'app-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.message }}</h2>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
}