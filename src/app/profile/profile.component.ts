import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, of, combineLatest, from } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  videos: Observable<any[]> = of([]);

  constructor(private afStorage: AngularFireStorage, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase) { }

  ngOnInit(): void {
    this.videos = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user && user.email) {
          const userEmail = user.email.replace('.', ''); // remove dots from email
          return this.afStorage.ref(`videos/${userEmail}`).listAll().pipe(
            switchMap(refs => {
              const observables: Observable<string>[] = refs.items.map(item => from(item.getDownloadURL()));
              return combineLatest(observables);
            }),
            map(urls => urls.filter(url => !!url))
          );
        } else {
          return of([]);
        }
      })
    );
  }

  shareVideo(videoUrl: string) {
    
    const link = `${videoUrl}?alt=media`;
  
    if (typeof navigator !== 'undefined' && typeof navigator.clipboard !== 'undefined') {
      navigator.clipboard.writeText(link)
        .then(() => {
          console.log('Link copied to clipboard!');
        })
        .catch((error) => {
          console.error('Failed to copy link to clipboard:', error);
        });
    } else {
      console.log('A böngésző nem támogatja a link másolását a vágólapra');
    }
  }

  deleteAllData() {
    if (confirm('Are you sure you want to delete all data?')) {
      this.afAuth.authState.pipe(
        tap(user => {
          if (user && user.email) {
            const userEmail = user.email.replace('.', ''); // remove dots from email
            this.afStorage.ref(`videos/${userEmail}`).listAll().subscribe(refs => {
              refs.items.forEach(item => {
                item.delete();
              });
            });
            this.afDatabase.list(`users/${userEmail}`).remove();
          }
        })
      ).subscribe();
    }
  }

}