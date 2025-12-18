import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UrlShortenerComponent } from './components/url-shortener/url-shortener.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UrlShortenerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'urlshortener';
}
