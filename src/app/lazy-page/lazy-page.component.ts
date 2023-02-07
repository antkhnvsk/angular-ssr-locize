import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18NextService } from 'angular-i18next';

@Component({
  selector: 'app-lazy-page',
  templateUrl: './lazy-page.component.html',
  styleUrls: ['./lazy-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyPageComponent implements OnInit {
  constructor(
    private i18next: I18NextService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.i18next.loadNamespaces('user').then(() => {
      this.i18next.setDefaultNamespace('user');
      this.changeDetectorRef.detectChanges();
    });

    this.activatedRoute.params.subscribe((params) => {
      this.i18next.changeLanguage(params['lang']);
      this.changeDetectorRef.detectChanges();
    });
  }
}
